#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BASELINE_MIGRATION_NAME="20260323000100_baseline_existing_db"

is_truthy() {
  case "${1,,}" in
    1|true|yes|y|on) return 0 ;;
    *) return 1 ;;
  esac
}

mark_baseline_as_applied() {
  echo "Marking baseline migration '$BASELINE_MIGRATION_NAME' as already applied..."
  npm run prisma:migrate:resolve:baseline
  echo "Baseline migration marked as applied."
}

cd "$PROJECT_DIR"

echo "=========================================="
echo "  Running production setup"
echo "=========================================="

# Ensure upload directories exist
mkdir -p public/uploads
mkdir -p public/uploads/payments
mkdir -p public/uploads/logos

echo "Installing dependencies..."
if [ ! -f package-lock.json ]; then
  echo "Missing package-lock.json. Refusing non-reproducible install in production."
  exit 1
fi

# Build requires devDependencies (TypeScript/PostCSS/Tailwind/Prisma CLI).
npm ci --include=dev --no-fund --no-audit

echo "Running Prisma generate..."
npm run prisma:generate

echo "Inspecting Prisma migration state..."
MIGRATION_STATE_OUTPUT="$(node <<'NODE'
const { PrismaClient } = require('@prisma/client');

const BASELINE_MIGRATION_NAME = '20260323000100_baseline_existing_db';

async function main() {
  const prisma = new PrismaClient();

  try {
    const tables = await prisma.$queryRawUnsafe(
      'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()'
    );

    const tableNames = tables.map((row) => row.TABLE_NAME || row.table_name).filter(Boolean);
    const migrationsTableExists = tableNames.includes('_prisma_migrations');
    const hasUserTables = tableNames.some((name) => name !== '_prisma_migrations');
    let baselineRecorded = false;

    if (migrationsTableExists) {
      const result = await prisma.$queryRawUnsafe(
        'SELECT COUNT(*) AS total FROM `_prisma_migrations` WHERE migration_name = ?',
        BASELINE_MIGRATION_NAME
      );
      const totalValue = result[0] && (result[0].total ?? Object.values(result[0])[0]);
      baselineRecorded = Number(totalValue || 0) > 0;
    }

    process.stdout.write(`MIGRATIONS_TABLE_EXISTS=${migrationsTableExists}\n`);
    process.stdout.write(`HAS_USER_TABLES=${hasUserTables}\n`);
    process.stdout.write(`BASELINE_RECORDED=${baselineRecorded}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
NODE
)"

MIGRATIONS_TABLE_EXISTS="$(printf '%s\n' "$MIGRATION_STATE_OUTPUT" | awk -F= '$1=="MIGRATIONS_TABLE_EXISTS" { print $2 }')"
HAS_USER_TABLES="$(printf '%s\n' "$MIGRATION_STATE_OUTPUT" | awk -F= '$1=="HAS_USER_TABLES" { print $2 }')"
BASELINE_RECORDED="$(printf '%s\n' "$MIGRATION_STATE_OUTPUT" | awk -F= '$1=="BASELINE_RECORDED" { print $2 }')"

if [ -z "$MIGRATIONS_TABLE_EXISTS" ] || [ -z "$HAS_USER_TABLES" ] || [ -z "$BASELINE_RECORDED" ]; then
  echo "Failed to parse Prisma migration state. Aborting deployment."
  exit 1
fi

echo "Prisma migration table exists: $MIGRATIONS_TABLE_EXISTS"
echo "Database has user tables: $HAS_USER_TABLES"
echo "Baseline migration recorded: $BASELINE_RECORDED"

BASELINE_MODE=false
if is_truthy "${PRISMA_BASELINE_ON_EXISTING_DB:-false}"; then
  BASELINE_MODE=true
fi

AUTO_BASELINE_MODE=false
if is_truthy "${PRISMA_AUTO_BASELINE_ON_EXISTING_DB:-false}"; then
  AUTO_BASELINE_MODE=true
fi

if [ "$BASELINE_RECORDED" = "true" ]; then
  echo "Baseline is already recorded. Proceeding with migrate deploy."
elif [ "$HAS_USER_TABLES" = "true" ]; then
  if [ "$BASELINE_MODE" = "true" ]; then
    echo "Guarded baseline mode enabled."
    mark_baseline_as_applied
  elif [ "$AUTO_BASELINE_MODE" = "true" ]; then
    echo "Auto-baseline mode enabled and existing DB detected."
    mark_baseline_as_applied
  else
    echo "ERROR: Existing non-empty database detected without baseline migration history."
    echo "Refusing to run 'prisma migrate deploy' to avoid applying baseline SQL to a populated schema."
    echo ""
    echo "Run this one-time command on production:"
    echo "  npx prisma migrate resolve --applied $BASELINE_MIGRATION_NAME"
    echo ""
    echo "Or rerun deploy with guarded baseline mode enabled (one-time):"
    echo "  PRISMA_BASELINE_ON_EXISTING_DB=true bash scripts/deploy.sh"
    exit 2
  fi
else
  echo "Database appears empty. Prisma will apply baseline migration via migrate deploy."
fi

echo "Running Prisma migrations..."
npm run prisma:migrate:deploy

echo "Building project..."
npm run build

echo "Pruning devDependencies for runtime..."
npm prune --omit=dev --no-fund --no-audit

APP_NAME="abtf"

if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  echo "Restarting existing PM2 process..."
  pm2 restart ecosystem.config.js --update-env
else
  echo "Starting new PM2 process..."
  pm2 start ecosystem.config.js
fi

pm2 save

echo "=========================================="
echo "  PM2 Status"
echo "=========================================="
pm2 status
