#!/usr/bin/env bash
set -euo pipefail
# Fixed official release, checksum from GitHub release metadata (2026-11-03).
archive="$RUNNER_TEMP/actionlint_1.7.12_linux_amd64.tar.gz"
curl --fail --silent --show-error --location --proto '=https' --proto-redir '=https' --max-time 60 \
  https://github.com/rhysd/actionlint/releases/download/v1.7.12/actionlint_1.7.12_linux_amd64.tar.gz -o "$archive"
printf '%s  %s\n' '8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8' "$archive" | sha256sum --check --status
mkdir -p "$RUNNER_TEMP/hp-actionlint"
tar -xzf "$archive" -C "$RUNNER_TEMP/hp-actionlint" actionlint
"$RUNNER_TEMP/hp-actionlint/actionlint" .github/workflows/deploy-production.yml .github/workflows/preview-validation.yml .github/workflows/ci.yml .github/workflows/amp-readiness.yml .github/workflows/hallpartner-draft.yml
shellcheck scripts/preview/*.sh
node scripts/preview/workflow-contract.mjs
