#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "=========================================="
echo "  Running production setup"
echo "=========================================="

# Ensure upload directories exist
mkdir -p public/uploads
mkdir -p public/uploads/payments
mkdir -p public/uploads/logos

echo "Installing dependencies..."
if [ -f package-lock.json ]; then
  NODE_ENV=development npm ci
else
  NODE_ENV=development npm install
fi

echo "Running Prisma generate..."
npx prisma generate

echo "Running Prisma migrations..."
npx prisma migrate deploy || true

echo "Pushing Prisma schema..."
npx prisma db push

echo "Building project..."
npm run build

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
