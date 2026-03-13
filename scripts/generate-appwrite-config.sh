#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
OUTPUT_FILE="${ROOT_DIR}/appwrite-config.json"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy .env.example to .env first."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ -z "${APPWRITE_ENDPOINT:-}" ]]; then
  echo "APPWRITE_ENDPOINT is required in .env"
  exit 1
fi

if [[ -z "${APPWRITE_PROJECT_ID:-}" ]]; then
  echo "APPWRITE_PROJECT_ID is required in .env"
  exit 1
fi

APPWRITE_SDK_URL="${APPWRITE_SDK_URL:-https://cdn.jsdelivr.net/npm/appwrite@13.0.1}"

cat > "${OUTPUT_FILE}" <<EOF
{
  "endpoint": "${APPWRITE_ENDPOINT}",
  "projectId": "${APPWRITE_PROJECT_ID}",
  "sdkUrl": "${APPWRITE_SDK_URL}"
}
EOF

echo "Generated ${OUTPUT_FILE}"
