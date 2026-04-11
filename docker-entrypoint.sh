#!/bin/sh

CONFIG_FILE=/usr/share/nginx/html/config.js

# Inject semua variabel environment runtime ke dalam config.js
# Variabel ini tersedia di browser via window.__APP_CONFIG__
cat > "$CONFIG_FILE" <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL:              "${API_BASE_URL}",
  DATAHUB_BASE_URL:          "${DATAHUB_BASE_URL}",
  PUBLICATION_API_BASE_URL:  "${PUBLICATION_API_BASE_URL}",
  CKAN_BASE_URL:             "${CKAN_BASE_URL}",
  CKAN_FILE_BASE_URL:        "${CKAN_FILE_BASE_URL}",
  MATOMO_URL:                "${MATOMO_URL}",
  MATOMO_AUTH:               "${MATOMO_AUTH}",
};
EOF

# Jalankan perintah default (nginx)
exec "$@"
