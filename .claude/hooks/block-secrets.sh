#!/usr/bin/env bash
# Hook PreToolUse (matcher Write|Edit).
#
# Lee el JSON del evento por stdin y revisa el contenido que se va a escribir
# (tool_input). Si detecta algo que parece un secreto hardcodeado, escribe una
# explicación a stderr y termina con EXIT CODE 2, lo que hace que Claude Code
# BLOQUEE la escritura.
#
# Objetivo (demo DevSecOps): mostrar el harness deteniendo un secreto ANTES de
# que llegue al repo. Es defensa local, complementaria a gitleaks en el CI.
set -euo pipefail

input="$(cat)"

# Extraemos los campos relevantes del tool_input.
# - Write: tool_input.content
# - Edit:  tool_input.new_string
# Usamos jq si está disponible; si no, caemos a una extracción simple.
if command -v jq >/dev/null 2>&1; then
  file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')"
  content="$(printf '%s' "$input" | jq -r '
    [.tool_input.content, .tool_input.new_string, .tool_input.old_string]
    | map(select(. != null)) | join("\n")
  ')"
else
  file_path=""
  content="$input"
fi

# No analizamos archivos de ejemplo/documentación donde los placeholders viven a
# propósito (.env.example, README, docs, el propio hook, etc.).
case "$file_path" in
  *.env.example|*README*|*/docs/*|*CLAUDE.md|*SKILL.md|*security-reviewer.md|*.claude/hooks/*)
    exit 0
    ;;
esac

# Patrones de secretos (heurística, sin pretender ser exhaustiva).
# Nota: los placeholders evidentes (CHANGE_ME) NO se consideran secreto.
patterns=(
  'sk_live_[0-9A-Za-z]{16,}'                 # claves estilo Stripe
  'AKIA[0-9A-Z]{16}'                         # AWS Access Key ID
  'ghp_[0-9A-Za-z]{20,}'                     # GitHub PAT
  'AIza[0-9A-Za-z_\-]{20,}'                  # Google API key
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'       # claves privadas PEM
  '(api[_-]?key|secret|token|password|passwd)[[:space:]]*[:=][[:space:]]*["'\''][^"'\'' ]{8,}["'\'']'
)

for re in "${patterns[@]}"; do
  # -e "$re" evita que patrones que empiezan con "-" (p. ej. claves PEM) se
  # interpreten como opciones de grep.
  if printf '%s' "$content" | grep -E -qi -e "$re"; then
    match="$(printf '%s' "$content" | grep -E -io -e "$re" | head -1)"
    # Ignorar placeholders evidentes.
    if printf '%s' "$match" | grep -qiE 'CHANGE_ME|example|placeholder|xxxx|your[_-]?'; then
      continue
    fi
    echo "🚫 BLOQUEADO por block-secrets.sh: posible secreto hardcodeado." >&2
    echo "   Patrón: ${re}" >&2
    echo "   Coincidencia: ${match}" >&2
    echo "   Regla (OWASP A02): los secretos no van en el código. Usa import.meta.env" >&2
    echo "   para valores públicos y un backend para secretos reales." >&2
    exit 2
  fi
done

exit 0
