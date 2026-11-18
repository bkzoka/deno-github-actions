#!/usr/bin/env bash
# Executa as 3 variantes compiladas e mostra quais permissoes foram bloqueadas.
set -uo pipefail

DIST="${1:-dist}"
URL="${TEST_URL:-https://example.com}"

NOMES=("no-fs" "no-net" "locked")
DESCS=(
  "sem acesso a arquivos (rede LIBERADA)"
  "sem acesso a rede (arquivos LIBERADOS)"
  "sem acesso aos 2 (TUDO BLOQUEADO)"
)

echo "========================================================================"
echo " ISOLAMENTO DE PERMISSOES EM BINARIOS DENO COMPILADOS"
echo " alvo de rede: $URL   |   pasta listada: ."
echo "========================================================================"

RESULTADOS=()

for i in "${!NOMES[@]}"; do
  bin="$DIST/${NOMES[$i]}"
  echo
  echo ">>> ${NOMES[$i]} :: ${DESCS[$i]}"

  if [[ ! -x "$bin" ]]; then
    echo "  BINARIO NAO ENCONTRADO: $bin"
    RESULTADOS+=("? binario ausente")
    continue
  fi

  saida=$("$bin" all "$URL" 2>&1) || true
  printf '%s\n' "$saida"

  rede=$(printf '%s\n' "$saida" | grep '\[REDE\]' | grep -c 'BLOQUEADO' || true)
  arq=$(printf '%s\n' "$saida" | grep '\[ARQ \]' | grep -c 'BLOQUEADO' || true)

  if [[ "$rede" -gt 0 ]]; then r="BLOQUEADA"; else r="OK"; fi
  if [[ "$arq" -gt 0 ]]; then a="BLOQUEADA"; else a="OK"; fi
  RESULTADOS+=("rede=$r | arquivos=$a")
done

echo
echo "========================================================================"
echo " RESUMO"
echo "========================================================================"
for i in "${!NOMES[@]}"; do
  printf '  %-7s %-40s %s\n' "${NOMES[$i]}" "${DESCS[$i]}" "${RESULTADOS[$i]:-?}"
done
echo "========================================================================"
