#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Preview with a dedicated, disposable DB and no editorial credentials.
mkdir -p var
export CIVIS_DB_PATH="$PWD/var/preview.db"
unset CIVIS_ADMIN_PASSWORD
unset CIVIS_SESSION_KEY

# Codespaces forwards this private port over HTTPS. Pin Origin for test forms.
if [[ -n "${CODESPACE_NAME:-}" ]]; then
  export CIVIS_PUBLIC_ORIGIN="https://${CODESPACE_NAME}-3000.app.github.dev"
else
  unset CIVIS_PUBLIC_ORIGIN
fi

if ! curl --silent --fail --max-time 2 http://127.0.0.1:3000/api/health >/dev/null; then
  nohup npm run start -- --port 3000 >/tmp/plenario-preview.log 2>&1 </dev/null &
  echo "$!" >/tmp/plenario-preview.pid
fi

echo "Preview PLENÁRIO: porta privada 3000. Consulte a aba PORTAS."
echo "Área editorial desativada por segurança; banco separado em var/preview.db."
