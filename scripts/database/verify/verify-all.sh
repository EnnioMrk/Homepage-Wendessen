#!/usr/bin/env bash
set -euo pipefail
DIR=$(dirname "$0")
SCRIPTS=(
  verify-admin_users.ts
  verify-roles.ts
  verify-permissions.ts
  verify-contacts.ts
  verify-push_subscriptions.ts
  verify-notification_events.ts
  verify-shared_gallery_submissions.ts
  verify-shared_gallery_reports.ts
  verify-portraits.ts
  verify-events.ts
  verify-news.ts
  verify-site_settings.ts
  verify-archive.ts
  verify-admin_logs.ts
)

FAIL=0
for s in "${SCRIPTS[@]}"; do
  echo "Running $s"
  if ! bun "$DIR/$s"; then
    echo "-> $s FAILED"
    FAIL=1
  fi
done

if [ $FAIL -eq 1 ]; then
  echo "One or more verifications failed" >&2
  exit 2
fi

echo "All verifications passed"
exit 0
