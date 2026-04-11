# Laporan Review Performance-driven UX: Kasulampua Frontend

Berdasarkan tinjauan source code di aplikasi Kasulampua (terutama pada file Router, `HomeView.vue`, `HeadSection.vue`, dan `DataRepository.vue`), berikut identifikasi masalah dan rekomendasi untuk peningkatan performa secara signifikan.

## 1. Layout Shift (Cumulative Layout Shift / CLS)
- **Ketiadaan Dimensi Eksplisit pada Aset Gambar:** Sebagian besar elemen `<img />` dalam `HeadSection.vue` dan `HomeView.vue` (contoh: logo aplikasi, logo _partner_, dan icon region) tidak menetapkan atribut lebar (`width`) dan tinggi (`height`) secara langsung di HTML. 
  - *Dampak:* Browser tidak mereservasi ruang pada layar sebelum gambar terunduh. Ketika aset selesai dimuat render ke viewport, hal ini memaksa *reflow* atau pendorongan konten lain ke bawah, mendegradasikan skor CLS (Cumulative Layout Shift) dan kesan stabilitas halaman.
  - *Saran:* Manfaatkan atribut `width` dan `height` dengan rasio sebenarnya (atau menggunakan CSS property `aspect-ratio`).

## 2. Pemicu Waktu Muat yang Lama (Long Load Times)
- **Routing Synchronous (Tidak Menerapkan Lazy-loading):** Pada file `src/router/index.js`, semua View di-import secara statis di awal baris kode (seperti `import HomeView from '../views/HomeView.vue'`). 
  - *Dampak:* Aplikasi secara keseluruhan dikemas ke dalam 1 bundel JavaScript utama (*Main bundle bloat*). Menambahkan ukuran *Time to Interactive* aplikasi secara drastis saat awal diunduh.
  - *Saran:* Manfaatkan Route-level Code Splitting melalui dynamic import: `component: () => import('@/views/HomeView.vue')`.
- **Eager Loading Gambar:** Semua aset memuat gambar di-load seketika meskipun ada di bagian *below the fold* area (di luar jangkauan pandangan pembuka).
  - *Saran:* Berikan dukungan standar `loading="lazy"` dan `decoding="async"` pada semua elemen gambar yang bersembunyi di bawah scroll pada _first paint_.

## 3. Komponen Spesifik dan Interaksi Melambat
### A. Analisis Carousel (`DataRepository.vue`)
- **Desain Kompositor Baik:** Komponen ini secara pintar membongkar beban geser ke animasi native lewat CSS (`overflow-x: auto` dan `scroll-snap-type: x mandatory`). Hal ini memastikan animasi scroll lebih *smooth* dengan *60fps* standar secara hardware dibanding memaksakan JS Transform geser.
- **Masalah *Scroll Handling* Tak Ter-Throttle:** Terdapat fungsi `handleScroll()` mengikat langsung *event* kelenturan native tanpa hambatan (*no debounce/throttle*). Saat digeser, ia membaca ukuran element (*Read DOM: `scrollLeft`, `scrollWidth`*) untuk mengubah reaktivitas State (`scrollProgress`, `activeIndex`). Siklus ini terulang sangat banyak dalam mili-sekon dapat memicu potensi **Layout Thrashing FPS-Drop / Jank**.
  - *Saran:* Bungkus fungsi `handleScroll` dengan teknik **Throttle** (contoh: lodash `throttle` / gunakan `requestAnimationFrame()`), atau menggabungkan `IntersectionObserver` guna menyadari elemen dataset mana yang aktif di center tanpa mengkalkulasi DOM tiada henti.

### B. Analisis Pattern Overlay / Animasi di Hero (`HeadSection.vue`)
- **Beban `<feTurbulence>` SVG Grain:** Overlay partikel layar `hero-grain` memakai SVG Filter Fraktal tipe `feTurbulence` guna mendesain debu grafis semu (*Noise*). Merender SVG Fractals ini pada waktu nyata akan sangat menuntut unjuk kemampuan GPU perangkat rendah, serta meningkatkan konsumsi baterai laptop.
  - *Saran:* Buangkan filter SVG noise, gunakan file Background gambar resolusi rendah WEBP berpola statis yang di `background-repeat`.
- **Penggunaan Hover Efek Box-Shadow:** Animasi `box-shadow` lumayan berat dirender GPU; pertimbangkan menggantinya dengan mengubah properti `opacity` elemen visual transparan. Tambahkan dukungan hardware acceleration pada _floating elements_ melalui property `will-change: transform`.

## 4. Rekomendasi Teknik Frontend Tambahan
Untuk menjamin tingkat interaksi super mulus, beberapa teknik di bawah direkomendasikan pada proses optimisasi tahap lanjutan:
1. **Modernisasi Ekstensi Aset Gambar:** Penuhi pipeline build melalui Vite plugin pembungkus otomatis untuk memodifikasi konversi `.PNG` statis berubah jadi format ringan modern `WebP / AVIF`. 
2. **Management State:** Lakukan Cache minimal atas REST-API untuk "Berita Headline" dan "Insight", misal memakai **Pinia**. Jangan lakukan data FETCH ulang dan menampilkan kerangka Skeleton setiapkali user bergerak (bolak-balik page) menuju `HomeView.vue`.
3. **Responsivitas Berbasis CSS:** Di `HomeView`, script `updateItemsPerSlide` dihitung oleh JS dari `window.innerWidth`. Sebisa mungkin hindari *Resize Listener* ini. Sebagai gantinya, aplikasikan *CSS Grid Component / CSS Container Queries* untuk menyortir layout adaptif via Styling, melepaskan Main-Thread JS dari kalkulasi tersebut.
