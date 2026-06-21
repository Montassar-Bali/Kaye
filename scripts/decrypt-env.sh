#!/usr/bin/env bash
set -euo pipefail

INPUT_FILE="${1:-.env.enc}"
OUTPUT_FILE="${2:-.env}"

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Encrypted file '$INPUT_FILE' not found." >&2
  exit 1
fi

: "${ENV_ENCRYPTION_KEY:?Set ENV_ENCRYPTION_KEY to decrypt environment secrets.}"

openssl enc -d -aes-256-cbc -pbkdf2 -iter 210000 \
  -in "$INPUT_FILE" \
  -out "$OUTPUT_FILE" \
  -pass env:ENV_ENCRYPTION_KEY

chmod 600 "$OUTPUT_FILE" || true

echo "Decrypted $INPUT_FILE -> $OUTPUT_FILE"
