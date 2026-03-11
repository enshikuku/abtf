#!/usr/bin/env bash
set -euo pipefail

REMOTE_ALIAS="webdock"
REMOTE_DIR="/home/enshikuku/apps/abtf"

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
rsync -avz -e "ssh" .env "$REMOTE_ALIAS:$REMOTE_DIR/.env"

echo "Running production script on server..."
ssh "$REMOTE_ALIAS" "bash $REMOTE_DIR/scripts/run-production.sh"

echo "=========================================="
echo "  Deployment complete!"
echo "=========================================="
