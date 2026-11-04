#!/usr/bin/env bash
set -euo pipefail
if [ -z "$AMP_GITHUB_READ_TOKEN" ]; then
  echo "::error::Private AMP requires AMELIO_PLATFORM_READ_TOKEN to read the private source; build intentionally blocked."
  exit 1
fi
# The credential is used only during install; never stored in Git URLs,
# npm lockfile, scripts, or build/test environment.
cat > "$RUNNER_TEMP/amp-askpass.sh" <<'SH'
#!/bin/sh
case "$1" in
  *Username*) printf '%s\n' 'x-access-token' ;;
  *Password*) printf '%s\n' "$AMP_GITHUB_READ_TOKEN" ;;
  *) exit 1 ;;
esac
SH
chmod 700 "$RUNNER_TEMP/amp-askpass.sh"
trap 'rm -f "$RUNNER_TEMP/amp-askpass.sh"' EXIT
# Translate the locked SSH URL to HTTPS without persisting credentials/config.
export GIT_CONFIG_COUNT=2
export GIT_CONFIG_KEY_0=url.https://github.com/.insteadOf
export GIT_CONFIG_VALUE_0=ssh://git@github.com/
export GIT_CONFIG_KEY_1=url.https://github.com/.insteadOf
export GIT_CONFIG_VALUE_1=git@github.com:
GIT_ASKPASS="$RUNNER_TEMP/amp-askpass.sh" GIT_TERMINAL_PROMPT=0 npm ci --ignore-scripts --no-audit --no-fund

node --input-type=module -e "import { assertAmp } from './scripts/preview/policy.mjs'; assertAmp();"
