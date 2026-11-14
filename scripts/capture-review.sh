#!/usr/bin/env bash
# Capture the register at three widths into .impeccable/review/.
# Usage: bash scripts/capture-review.sh [base-url] [session-suffix]
set -u
BASE="${1:-http://127.0.0.1:3001}"
SUFFIX="${2:-rev}"
WP=/home/openchamber/.config/opencode/skills/web-playtest/scripts/web-playtest
OUT=".impeccable/review"
mkdir -p "$OUT"

PUBLIC=(
  "/"
  "/was-steht-an"
  "/neuigkeiten"
  "/neuigkeiten/e39666f1"
  "/dorfleben"
  "/dorfleben/ortsrat/mitglieder"
  "/dorfleben/vereine/schuetzenverein"
  "/dorfleben/karte"
  "/dorfleben/wetter"
  "/dorfleben/archiv"
  "/dorfleben/wir-wendesser"
  "/geschichte"
  "/impressionen"
  "/impressionen/einreichen"
  "/wohnen-bauen"
  "/wohnen-bauen/neubaugebiet"
  "/kontakt"
  "/kontakt/verzeichnis"
  "/kontakt/formular"
  "/kontakt/redaktionsteam"
  "/impressum"
  "/datenschutz"
  "/suche?q=verein"
  "/suche?q=zzzz"
  "/gibt-es-nicht"
)

ADMIN=(
  "/admin/dashboard"
  "/admin/events"
  "/admin/news"
  "/admin/news/erstellen"
  "/admin/gallery"
  "/admin/portraits"
  "/admin/contacts"
  "/admin/organizations"
  "/admin/users"
  "/admin/settings"
  "/admin/logs"
  "/admin/archiv"
  "/admin/shared-gallery"
  "/admin/shared-gallery/meldungen"
  "/admin/wendessen"
  "/admin/login"
)

capture_device () {
  local device="$1"; shift
  local tag="$1"; shift
  local session="cap-$tag-$SUFFIX"
  "$WP" start "$BASE/" --device "$device" --session "$session" >/dev/null 2>&1
  sleep 1

  for route in "${PUBLIC[@]}"; do
    local name
    name=$(echo "$route" | sed 's|^/||; s|[/?=&]|_|g')
    [ -z "$name" ] && name="home"
    "$WP" goto "$BASE$route" --session "$session" >/dev/null 2>&1
    sleep 1.5
    "$WP" screenshot "$OUT/$tag-$name.png" --full --session "$session" >/dev/null 2>&1
  done

  if [ "${CAPTURE_ADMIN:-1}" = "1" ] && [ -f /tmp/opencode/temp-admin-pw.txt ]; then
    local pw
    pw=$(cat /tmp/opencode/temp-admin-pw.txt)
    "$WP" goto "$BASE/admin/login" --session "$session" >/dev/null 2>&1
    sleep 1
    "$WP" click "#username" --session "$session" >/dev/null 2>&1
    "$WP" type "redesign-review" --session "$session" >/dev/null 2>&1
    "$WP" click "#password" --session "$session" >/dev/null 2>&1
    "$WP" type "$pw" --session "$session" >/dev/null 2>&1
    "$WP" click "button[type=submit]" --session "$session" >/dev/null 2>&1
    sleep 3
    for route in "${ADMIN[@]}"; do
      local name
      name=$(echo "$route" | sed 's|^/||; s|[/?=&]|_|g')
      "$WP" goto "$BASE$route" --session "$session" >/dev/null 2>&1
      sleep 1.5
      "$WP" screenshot "$OUT/$tag-$name.png" --full --session "$session" >/dev/null 2>&1
    done
  fi

  "$WP" stop --session "$session" >/dev/null 2>&1
}

capture_device desktop desktop
capture_device ipad tablet
capture_device iphone phone

echo "Captured into $OUT"
ls "$OUT" | wc -l
