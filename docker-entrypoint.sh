#!/bin/sh

CONFIG_FILE=/usr/share/nginx/html/config.js

# Inject nilai dari ENV ke dalam config.js
echo "window.__APP_CONFIG__ = {" > $CONFIG_FILE
echo "  API_BASE_URL: \"${API_BASE_URL}\"" >> $CONFIG_FILE
echo "};" >> $CONFIG_FILE

# Jalankan perintah default (nginx)
exec "$@"
