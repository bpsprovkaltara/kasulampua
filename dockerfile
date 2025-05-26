# =========================
# Stage 1: Build Vite App
# =========================
FROM node:18 AS build

WORKDIR /app

# Copy dan install dependensi
COPY package*.json ./
RUN npm install

# Salin seluruh project dan build
COPY . .
RUN npm run build


# ================================
# Stage 2: Serve via Nginx
# ================================
FROM nginx:stable-alpine

# Hapus HTML default Nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin hasil build dari stage build
COPY --from=build /app/dist /usr/share/nginx/html

# Salin file config.js default (placeholder)
COPY public/config.js /usr/share/nginx/html/config.js

# Salin file konfigurasi nginx jika Anda punya custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin entrypoint untuk inject runtime ENV ke config.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Gunakan entrypoint custom
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
