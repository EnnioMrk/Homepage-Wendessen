#!/usr/bin/env bash
# Wrapper to ensure an admin user exists before starting Next.js dev server.
# Usage: ./scripts/start-dev-with-admin.sh

set -euo pipefail

# Load .env if present
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

echo "Running ensure-admin startup script..."
# Run the ensure-admin startup (non-fatal)
bunx tsx scripts/ensure-admin-startup.ts || true

echo "Starting Next dev..."
exec bun run --bun next dev --turbopack
