#!/usr/bin/env bash
set -euo pipefail

INPUT_FILE="${1:-.env}"
OUTPUT_FILE="${2:-.env.enc}"

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Input file '$INPUT_FILE' not found." >&2
  exit 1
fi

: "${ENV_ENCRYPTION_KEY:?Set ENV_ENCRYPTION_KEY to a strong passphrase before encrypting.}"

openssl enc -aes-256-cbc -pbkdf2 -iter 210000 -salt \
  -in "$INPUT_FILE" \
  -out "$OUTPUT_FILE" \
  -pass env:ENV_ENCRYPTION_KEY

echo "Encrypted $INPUT_FILE -> $OUTPUT_FILE"
echo "Do NOT store ENV_ENCRYPTION_KEY in this repository."
