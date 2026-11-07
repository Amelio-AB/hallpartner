#!/usr/bin/env bash
# Private synthetic HTTP->PHP->SMTP test. Never modifies production config or public_html.
set -Eeuo pipefail
if [[ $# -ne 1 || "$1" != '--send-test' ]]; then
  echo 'Usage: bash test-v2-loopback.sh --send-test'
  echo 'Runs one localhost-only V2 test and sends one synthetic email to kontakt@amelio.se.'
  exit 2
fi
umask 077
base="$HOME/hallpartner-leads"
bootstrap="$HOME/domains/hallpartner.se/public_html/api/lead.php"
origin='https://hallpartner-se.preview2.inleed.com'
for tool in php curl sha256sum mktemp; do
  command -v "$tool" >/dev/null || { echo "Missing tool: $tool"; exit 1; }
done
for file in "$base/validator.php" "$base/receiver.php" "$base/config.local.php" "$base/vendor/autoload.php" "$bootstrap"; do
  [[ -f "$file" ]] || { echo "Missing PHP or config file. Stopped."; exit 1; }
done
# This known SHA was confirmed on the Inleed preview before the test.
[[ "$(sha256sum "$bootstrap" | cut -d' ' -f1)" == '7d252addd5378e98ddb42871934190800800e076318661b3d66c1a202a89e7ef' ]] || {
  echo 'Public PHP bootstrap hash differs. No test sent.'; exit 1;
}
grep -Fq 'hallpartner-offert-v2-review' "$base/validator.php" || {
  echo 'Installed private validator lacks V2. No test sent.'; exit 1;
}
# Check only approved test identities and disabled state, without printing any secrets.
php -r '
$c = require $argv[1];
if (!is_array($c) || ($c["enabled"] ?? null) !== false ||
    ($c["privacy_approved"] ?? null) !== false ||
    ($c["allowed_origin"] ?? "") !== "https://hallpartner-se.preview2.inleed.com" ||
    // The installed recipient may belong to the configured project. Never
    // send synthetic mail there: the disposable wrapper below redirects it.
    ($c["smtp_from"] ?? "") !== "kontakt@amelio.se" ||
    !is_string($c["smtp_password"] ?? null) || $c["smtp_password"] === "" ||
    !is_string($c["smtp_host"] ?? null) || trim($c["smtp_host"]) === "" ||
    !filter_var($c["smtp_username"] ?? null, FILTER_VALIDATE_EMAIL) ||
    !in_array($c["smtp_port"] ?? null, [465,587], true)) {
    fwrite(STDERR, "Server configuration differs from the isolated Amelio test setup. Stopped.\n");
    exit(1);
}
' "$base/config.local.php"

workdir="$(mktemp -d "$HOME/hallpartner-v2-loopback.XXXXXXXX")"
server_pid=''
cleanup() {
  if [[ -n "$server_pid" ]]; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
  [[ -d "$workdir" ]] && rm -rf -- "$workdir"
  return 0
}
trap cleanup EXIT
mkdir -p "$workdir/private" "$workdir/public/api" "$workdir/rate"
cp "$base/validator.php" "$base/receiver.php" "$workdir/private/"
cp "$bootstrap" "$workdir/public/api/lead.php"
ln -s "$base/vendor" "$workdir/private/vendor"
# Disposable wrapper: credentials are loaded from the existing PRIVATE config
# at runtime, not copied. Enabled/privacy flags are overridden in this isolated
# localhost test ONLY; the real config stays disabled and unchanged.
cat > "$workdir/private/config.local.php" <<'PHP'
<?php
$c = require getenv('HP_V2_TEST_ORIGINAL_CONFIG');
if (!is_array($c)) throw new RuntimeException('Missing private config');
$c['enabled'] = true;
$c['privacy_approved'] = true; // Synthetic localhost simulation, NOT legal approval.
$c['recipient'] = 'kontakt@amelio.se'; // Local test only: explicitly chosen preview inbox; real config remains unchanged.
$c['rate_dir'] = getenv('HP_V2_TEST_RATE_DIR');
// This is a disposable local-only rate limit key. It does not change or
// prove the key used by the inactive public receiver.
$c['rate_secret'] = getenv('HP_V2_TEST_RATE_SECRET');
return $c;
PHP
cat > "$workdir/public/router.php" <<'PHP'
<?php
if (!hash_equals((string)getenv('HP_V2_TEST_TOKEN'), (string)($_SERVER['HTTP_X_HP_TEST_TOKEN'] ?? ''))) {
    http_response_code(404);
    exit;
}
// Simulate HTTPS termination on the localhost-only test process.
$_SERVER['HTTPS'] = 'on';
$_SERVER['SERVER_PORT'] = 443;
require __DIR__ . '/api/lead.php';
PHP
php -l "$workdir/private/validator.php" >/dev/null
php -l "$workdir/private/receiver.php" >/dev/null
token="$(php -r 'echo bin2hex(random_bytes(32));')"
port="$(php -r '$s=stream_socket_server("tcp://127.0.0.1:0",$e,$m); if(!$s)exit(1); $a=stream_socket_get_name($s,false); echo (int)substr(strrchr($a,":"),1); fclose($s);')"
[[ "$port" =~ ^[0-9]{4,5}$ ]] || { echo 'No loopback port available'; exit 1; }
HP_LEAD_PRIVATE_DIR="$workdir/private" \
HP_V2_TEST_ORIGINAL_CONFIG="$base/config.local.php" \
HP_V2_TEST_RATE_DIR="$workdir/rate" \
HP_V2_TEST_RATE_SECRET="$(php -r 'echo bin2hex(random_bytes(32));')" \
HP_V2_TEST_TOKEN="$token" \
php -S "127.0.0.1:$port" -t "$workdir/public" "$workdir/public/router.php" > "$workdir/server.log" 2>&1 &
server_pid=$!
ready=0
for _ in {1..30}; do
  if curl --noproxy '*' -s --max-time 1 -o /dev/null -H "X-HP-Test-Token: $token" "http://127.0.0.1:$port/" 2>/dev/null; then ready=1; break; fi
  kill -0 "$server_pid" 2>/dev/null || break
  sleep 0.2
done
[[ "$ready" == 1 ]] || { echo 'Local PHP server did not start'; exit 1; }
cat > "$workdir/request.json" <<'JSON'
{"contractVersion":1,"technicalId":"quote-flow","configurationId":"hallpartner-offert-v2-review","answers":{"project.use":"storage","project.description":"","dimensions.confidence":"","contact.name":"Syntetisk Testperson","contact.email":"test@example.invalid"}}
JSON
# Invalid origins must be rejected BEFORE any SMTP attempt.
bad_code="$(curl --noproxy '*' -sS --max-time 5 -o /dev/null -w '%{http_code}' -X POST \
  -H "X-HP-Test-Token: $token" -H 'Origin: https://wrong-origin.invalid' \
  -H 'Content-Type: application/json' --data-binary "@$workdir/request.json" \
  "http://127.0.0.1:$port/api/lead.php")"
[[ "$bad_code" == '403' ]] || { echo "Wrong origin not rejected (HTTP $bad_code); no test sent."; exit 1; }
echo 'Origin-skydd: OK. Testet använder separat mottagare, rate-dir och rate-secret.' 
echo 'Skickar en syntetisk V2-förfrågan via isolerad PHP-server.'
http_code="$(curl --noproxy '*' -sS --max-time 25 -o "$workdir/response.json" -w '%{http_code}' -X POST \
  -H "X-HP-Test-Token: $token" -H "Origin: $origin" \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  --data-binary "@$workdir/request.json" "http://127.0.0.1:$port/api/lead.php")"
php -r '
$j = json_decode(file_get_contents($argv[1]), true);
if ($argv[2] === "200" && is_array($j) && ($j["status"] ?? "") === "success" &&
    preg_match("/^[a-f0-9]{24}$/", $j["requestId"] ?? "")) {
    echo "HTTP 200 / SMTP accepted: TEST OK. Referens " . $j["requestId"] . "\n";
    exit(0);
}
echo "TEST INTE BEKRÄFTAT: HTTP " . $argv[2] .
     "; status " . (is_array($j) ? ($j["status"] ?? "invalid") : "invalid-json") . "\n";
exit(1);
' "$workdir/response.json" "$http_code"
php -r '$c=require $argv[1]; if (($c["enabled"] ?? null)!==false || ($c["privacy_approved"] ?? null)!==false) exit(1); echo "Publik mottagning fortfarande avstängd.\n";' "$base/config.local.php"
