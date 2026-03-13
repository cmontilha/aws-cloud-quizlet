#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy .env.example to .env first."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

required_vars=(
  APPWRITE_ENDPOINT
  APPWRITE_PROJECT_ID
  APPWRITE_API_KEY
  APPWRITE_DB_ID
  APPWRITE_COLLECTION_PROGRESS_ID
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Missing ${var_name} in .env"
    exit 1
  fi
done

request() {
  local method="$1"
  local path="$2"
  local payload="${3:-}"
  local allow_conflict="${4:-false}"

  local tmp_file
  tmp_file="$(mktemp)"

  local status
  if [[ -n "${payload}" ]]; then
    status=$(curl -sS -o "${tmp_file}" -w "%{http_code}" \
      -X "${method}" "${APPWRITE_ENDPOINT}${path}" \
      -H "X-Appwrite-Project: ${APPWRITE_PROJECT_ID}" \
      -H "X-Appwrite-Key: ${APPWRITE_API_KEY}" \
      -H "Content-Type: application/json" \
      --data "${payload}")
  else
    status=$(curl -sS -o "${tmp_file}" -w "%{http_code}" \
      -X "${method}" "${APPWRITE_ENDPOINT}${path}" \
      -H "X-Appwrite-Project: ${APPWRITE_PROJECT_ID}" \
      -H "X-Appwrite-Key: ${APPWRITE_API_KEY}" \
      -H "Content-Type: application/json")
  fi

  if [[ "${status}" == 2* ]]; then
    rm -f "${tmp_file}"
    return 0
  fi

  if [[ "${allow_conflict}" == "true" && "${status}" == "409" ]]; then
    rm -f "${tmp_file}"
    return 0
  fi

  echo "Request failed: ${method} ${path} (HTTP ${status})"
  cat "${tmp_file}"
  rm -f "${tmp_file}"
  exit 1
}

echo "Creating database ${APPWRITE_DB_ID}..."
request POST "/databases" \
  "{\"databaseId\":\"${APPWRITE_DB_ID}\",\"name\":\"AWS Cloud Quizlet\"}" \
  true

echo "Creating collection ${APPWRITE_COLLECTION_PROGRESS_ID}..."
request POST "/databases/${APPWRITE_DB_ID}/collections" \
  "{\"collectionId\":\"${APPWRITE_COLLECTION_PROGRESS_ID}\",\"name\":\"user_progress\",\"documentSecurity\":true,\"enabled\":true}" \
  true

echo "Creating attributes..."
request POST "/databases/${APPWRITE_DB_ID}/collections/${APPWRITE_COLLECTION_PROGRESS_ID}/attributes/string" \
  '{"key":"userId","size":64,"required":true}' \
  true

request POST "/databases/${APPWRITE_DB_ID}/collections/${APPWRITE_COLLECTION_PROGRESS_ID}/attributes/string" \
  '{"key":"examId","size":32,"required":true}' \
  true

request POST "/databases/${APPWRITE_DB_ID}/collections/${APPWRITE_COLLECTION_PROGRESS_ID}/attributes/integer" \
  '{"key":"score","required":true,"min":0,"max":100}' \
  true

request POST "/databases/${APPWRITE_DB_ID}/collections/${APPWRITE_COLLECTION_PROGRESS_ID}/attributes/datetime" \
  '{"key":"takenAt","required":true}' \
  true

echo "Waiting attributes to finish processing..."
sleep 3

echo "Creating indexes..."
request POST "/databases/${APPWRITE_DB_ID}/collections/${APPWRITE_COLLECTION_PROGRESS_ID}/indexes" \
  '{"key":"user_exam_idx","type":"key","attributes":["userId","examId"],"orders":["ASC","ASC"]}' \
  true

request POST "/databases/${APPWRITE_DB_ID}/collections/${APPWRITE_COLLECTION_PROGRESS_ID}/indexes" \
  '{"key":"taken_at_idx","type":"key","attributes":["takenAt"],"orders":["DESC"]}' \
  true

echo "Migration finished."
