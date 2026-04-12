# Antigravity Rules — Kasulampua Project

Gunakan aturan ini sebagai dasar perilaku (behavior) dalam setiap sesi interaksi di repositori Kasulampua.

## ⚠️ AGENTIC BEHAVIOR & PLANNING (HIGH PRIORITY)

1. **Planning First:** Sebelum melakukan modifikasi file atau mengeksekusi perintah terminal apa pun, kamu WAJIB membuat rencana (Plan Artifact).
2. **Strict No-Execution:** Jangan pernah mengeksekusi perintah terminal (`pnpm`, `git`, dll) secara otomatis tanpa persetujuan eksplisit, meskipun perintah tersebut dianggap "aman" (read-only).
3. **Context Awareness:** Selalu periksa `src/config/api.js` dan file `.env` sebelum menyarankan perubahan pada alur pengambilan data (API).

## 🛠 TECH STACK & ARCHITECTURE

- **Framework:** Vue 3 (Composition API) + Vite 6.
- **State Management:** **DILARANG** menggunakan Pinia atau Vuex. Gunakan Shared State melalui Composables di folder `src/composables/`.
- **UI & Styling:** - Gunakan Bootstrap 5 dan Bootstrap Icons.
  - Ikon tambahan: `lucide-vue-next`.
  - CSS Global: `src/assets/css/main.css`.
- **Charts & Maps:** Chart.js untuk grafik dan Leaflet untuk visualisasi peta wilayah KASULAMPUA.
- **Package Manager:** Selalu gunakan **pnpm**.

## 🖋 CODE CONVENTIONS

- **Formatting (Prettier):** - TIDAK menggunakan titik koma (no semicolons).
  - Gunakan kutip tunggal (single quotes).
  - `printWidth`: 100.
- **Naming Conventions:**
  - **Components:** PascalCase (contoh: `NavSection.vue`, `DataCard.vue`).
  - **Composables:** `useSomething.js` (contoh: `useDatasetStore.js`).
  - **Utils:** Gunakan prefix domain (contoh: `ckanFetch`, `kasulampuaMap`).
- **Imports:** Gunakan alias `@/` untuk merujuk ke folder `src/`.

## 🌐 API & DATA PATTERN

- Proyek ini menggunakan 3 layer API. Selalu sinkronkan dengan `src/config/api.js`:
  1. **Custom API:** Untuk berita dan insight lokal.
  2. **Datahub:** Middleware untuk wrapper CKAN.
  3. **CKAN Action API:** Akses langsung ke portal data.
- Jika membuat fitur data baru, pastikan mendukung ekspor Excel menggunakan library `xlsx` dan `file-saver` yang sudah terpasang.

## 🗺 GIS & REGIONAL DATA

- Fokus wilayah: Kalimantan, Sulawesi, Maluku, Papua.
- Untuk manipulasi peta, gunakan helper yang tersedia di `src/utils/kasulampuaProvinces.js`.
- Pastikan normalisasi nama wilayah sesuai dengan standar data yang ada di project.

## 🇮🇩 LANGUAGE POLICY

- **UI/User-facing strings:** Gunakan Bahasa Indonesia (formal/semi-formal sesuai konteks BPS/PDRB).
- **Code/Comments:** Campuran Bahasa Inggris dan Indonesia diperbolehkan, namun utamakan konsistensi dengan kode yang sudah ada.

## 🚀 DEVELOPMENT WORKFLOW

- `pnpm dev` untuk menjalankan server lokal.
- `pnpm lint` sebelum melakukan commit untuk memastikan standar ESLint (Flat Config) terpenuhi.
- Selalu update `document.title` melalui router meta atau `useMeta.js` composable.