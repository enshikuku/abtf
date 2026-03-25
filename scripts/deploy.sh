#!/usr/bin/env bash
set -euo pipefail

REMOTE_ALIAS="webdock"
REMOTE_DIR="/home/enshikuku/apps/abtf"

is_truthy() {
  case "${1,,}" in
    1|true|yes|y|on) return 0 ;;
    *) return 1 ;;
  esac
}

BASELINE_ON_EXISTING_DB="false"
if is_truthy "${PRISMA_BASELINE_ON_EXISTING_DB:-false}"; then
  BASELINE_ON_EXISTING_DB="true"
fi

AUTO_BASELINE_ON_EXISTING_DB="false"
if is_truthy "${PRISMA_AUTO_BASELINE_ON_EXISTING_DB:-true}"; then
  AUTO_BASELINE_ON_EXISTING_DB="true"
fi

echo "=========================================="
echo "  Deploying ABTF to $REMOTE_ALIAS"
echo "=========================================="

echo "Ensuring remote directory exists..."
ssh "$REMOTE_ALIAS" "mkdir -p $REMOTE_DIR"

echo "Uploading files via rsync..."
rsync -avz --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude .next \
  --exclude dist \
  --exclude build \
  --exclude coverage \
  --exclude "*.log" \
  --exclude "public/uploads/*" \
  -e "ssh" \
  ./ "$REMOTE_ALIAS:$REMOTE_DIR/"

echo "Uploading .env..."
if [ ! -f .env ]; then
  echo "Missing .env in project root. Aborting deployment."
  exit 1
fi
rsync -avz -e "ssh" .env "$REMOTE_ALIAS:$REMOTE_DIR/.env"

echo "Running production script on server..."
if [ "$BASELINE_ON_EXISTING_DB" = "true" ]; then
  echo "Guarded baseline mode is ENABLED for this deploy."
else
  echo "Guarded baseline mode is disabled."
fi
if [ "$AUTO_BASELINE_ON_EXISTING_DB" = "true" ]; then
  echo "Auto-baseline mode is ENABLED for safe one-time baseline on existing DBs."
else
  echo "Auto-baseline mode is disabled."
fi
ssh "$REMOTE_ALIAS" "PRISMA_BASELINE_ON_EXISTING_DB=$BASELINE_ON_EXISTING_DB PRISMA_AUTO_BASELINE_ON_EXISTING_DB=$AUTO_BASELINE_ON_EXISTING_DB bash $REMOTE_DIR/scripts/run-production.sh"

echo "=========================================="
echo "  Deployment complete!"
echo "=========================================="
