# =============================================================
# Stage 1: Dependency Cache
#   Memisahkan instalasi dependensi agar layer di-cache Docker
#   dan tidak perlu diulang jika source code berubah.
# =============================================================
FROM node:20-alpine AS deps

# Aktifkan corepack agar pnpm tersedia tanpa install manual
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Salin lockfile & manifest terlebih dahulu untuk memanfaatkan cache layer
COPY package.json pnpm-lock.yaml ./

# Install dependensi (frozen lockfile = reproducible build)
RUN pnpm install --frozen-lockfile


# =============================================================
# Stage 2: Build
#   Compile source Vue + Vite menjadi static assets.
# =============================================================
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Ambil node_modules dari stage deps (tanpa re-install)
COPY --from=deps /app/node_modules ./node_modules

# Salin seluruh source project
COPY . .

# Build production bundle (gunakan .env.production secara otomatis oleh Vite)
RUN pnpm run build


# =============================================================
# Stage 3: Production Image
#   Hanya berisi static files + Nginx. Tidak ada Node.js,
#   sehingga image jauh lebih kecil dan aman.
# =============================================================
FROM nginx:1.27-alpine AS production

# curl untuk healthcheck Docker (wget tidak selalu ada di image nginx:alpine)
RUN apk add --no-cache curl

# Hapus default config Nginx
RUN rm -f /etc/nginx/conf.d/default.conf && rm -rf /usr/share/nginx/html/*

# Salin custom Nginx config (sudah include proxy CKAN & security headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari stage build
COPY --from=build /app/dist /usr/share/nginx/html

# Salin config.js placeholder (akan di-overwrite oleh entrypoint saat runtime)
COPY public/config.js /usr/share/nginx/html/config.js

# Salin entrypoint untuk injeksi runtime ENV ke config.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Jalankan Nginx sebagai non-root user untuk keamanan
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

# Port internal container (Traefik akan forward ke sini via label)
EXPOSE 8082

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
