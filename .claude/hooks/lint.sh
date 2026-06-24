#!/usr/bin/env bash
# Hook PostToolUse (matcher Write|Edit).
#
# Después de escribir/editar un archivo .ts/.js, corre dos chequeos rápidos:
#   1. grep de patrones peligrosos (innerHTML/outerHTML/insertAdjacentHTML) → XSS (A03).
#   2. ESLint sobre el archivo (si está instalado).
#
# Este hook es INFORMATIVO: avisa por stderr pero NO bloquea (exit 0 siempre).
# El bloqueo "duro" de secretos lo hace block-secrets.sh (PreToolUse, exit 2).
set -uo pipefail

input="$(cat)"

if command -v jq >/dev/null 2>&1; then
  file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')"
else
  file_path=""
fi

# Solo nos interesan fuentes JS/TS dentro de src/.
case "$file_path" in
  *src/*.ts|*src/*.js|*src/*.tsx|*src/*.jsx) ;;
  *) exit 0 ;;
esac

[ -f "$file_path" ] || exit 0

warned=0

# 1) Patrones de XSS DOM-based.
if grep -nE '\.(innerHTML|outerHTML)[[:space:]]*=|insertAdjacentHTML|document\.write|(^|[^.])\beval\(' "$file_path" >/dev/null 2>&1; then
  echo "⚠️  lint.sh: patrón peligroso (posible XSS / OWASP A03) en ${file_path}:" >&2
  grep -nE '\.(innerHTML|outerHTML)[[:space:]]*=|insertAdjacentHTML|document\.write|(^|[^.])\beval\(' "$file_path" >&2 || true
  echo "    Usa textContent / setText() en lugar de innerHTML." >&2
  warned=1
fi

# 2) ESLint (si el proyecto y node_modules están listos).
project_root="$(cd "$(dirname "$file_path")" && while [ ! -f package.json ] && [ "$PWD" != "/" ]; do cd ..; done; pwd)"
if [ -f "$project_root/package.json" ] && [ -x "$project_root/node_modules/.bin/eslint" ]; then
  if ! (cd "$project_root" && ./node_modules/.bin/eslint "$file_path" >&2 2>&1); then
    echo "⚠️  lint.sh: ESLint reportó problemas en ${file_path}." >&2
    warned=1
  fi
fi

[ "$warned" -eq 1 ] && echo "    (Aviso informativo; no bloquea la edición.)" >&2

exit 0
