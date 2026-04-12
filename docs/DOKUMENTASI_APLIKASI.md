# DOKUMENTASI LENGKAP APLIKASI KASULAMPUA FRONTEND

## Daftar Isi

1. [Ringkasan Umum](#1-ringkasan-umum)
2. [Teknologi & Framework](#2-teknologi--framework)
3. [Struktur Direktori](#3-struktur-direktori)
4. [Fitur Utama](#4-fitur-utama)
5. [Routing & Navigasi](#5-routing--navigasi)
6. [Integrasi API](#6-integrasi-api)
7. [State Management](#7-state-management)
8. [Komponen Utama](#8-komponen-utama)
9. [Alur Kerja Aplikasi](#9-alur-kerja-aplikasi)
10. [Alur Data (Data Flow)](#10-alur-data-data-flow)
11. [Komunikasi Antar Komponen](#11-komunikasi-antar-komponen)
12. [Alur Pencarian & Filter](#12-alur-pencarian--filter)
13. [Alur Download & Export](#13-alur-download--export)
14. [Integrasi Analytics (Matomo)](#14-integrasi-analytics-matomo)
15. [Contoh Perjalanan Pengguna](#15-contoh-perjalanan-pengguna)
16. [Hierarki Komponen](#16-hierarki-komponen)
17. [Utilities](#17-utilities)
18. [Konfigurasi Environment](#18-konfigurasi-environment)
19. [Error Handling](#19-error-handling)
20. [Deployment](#20-deployment)
21. [Scripts Development](#21-scripts-development)

---

## 1. Ringkasan Umum

**Kasulampua** adalah portal data regional berbasis Vue 3 yang berfungsi sebagai platform terpusat untuk eksplorasi data ekonomi regional wilayah **KASULAMPUA** (Kalimantan, Sulawesi, Maluku, dan Papua).

| Informasi | Detail |
|-----------|--------|
| **Tipe Aplikasi** | Single-Page Application (SPA) |
| **Framework** | Vue.js 3.5.13 |
| **Versi** | 0.0.0 (Early stage) |
| **Lisensi** | Private |

### Tujuan Aplikasi

1. **Data Discovery** - Pencarian dan browse dataset regional
2. **Visualisasi Data** - Chart interaktif untuk analisis regional
3. **Berita & Insight** - Update terbaru dan wawasan regional
4. **Akses Data** - Download dan preview file dalam berbagai format
5. **Analytics Regional** - Perbandingan data antar 4 wilayah

---

## 2. Teknologi & Framework

### Core Technologies

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Framework** | Vue.js | 3.5.13 |
| **Build Tool** | Vite | 6.3.5 |
| **Routing** | Vue Router | 4.5.0 |
| **CSS Framework** | Bootstrap | 5.3.6 |
| **Icons** | Bootstrap Icons | 1.12.1 |

### Data & Visualization

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Charting** | Chart.js | 4.4.9 |
| **Excel Processing** | XLSX | 0.18.5 |
| **File Download** | file-saver | 2.0.5 |

### UI Components

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Multiselect** | @vueform/multiselect | 2.6.11 |

### Development Tools

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Linting** | ESLint | 9.22.0 |
| **Formatting** | Prettier | 3.5.3 |
| **Vue Plugin** | @vitejs/plugin-vue | 5.2.3 |
| **DevTools** | vite-plugin-vue-devtools | 7.7.2 |

### Analytics

| Kategori | Teknologi |
|----------|-----------|
| **Web Analytics** | Matomo |

---

## 3. Struktur Direktori

```
fe_kasulampua/
├── public/
│   ├── assets/
│   ├── config.js
│   └── favicon.ico
│
├── src/
│   ├── App.vue                     # Root component
│   ├── main.js                     # Entry point + Matomo init
│   │
│   ├── router/
│   │   └── index.js                # Vue Router configuration
│   │
│   ├── views/                      # 11 Page-level components
│   │   ├── HomeView.vue
│   │   ├── BeritaView.vue
│   │   ├── BeritaDetil.vue
│   │   ├── RegionalInsight.vue
│   │   ├── RegionalInsightDetil.vue
│   │   ├── VisualisasiData.vue
│   │   ├── DatasetViewRoute.vue
│   │   ├── DatasetView.vue
│   │   ├── DatasetGroupView.vue
│   │   ├── DatasetOrganizationView.vue
│   │   ├── DatasetDetail.vue
│   │   ├── ResourceDetail.vue
│   │   └── AboutView.vue
│   │
│   ├── components/                 # 28+ Reusable components
│   │   ├── NavSection.vue
│   │   ├── HeadSection.vue
│   │   ├── FooterSection.vue
│   │   ├── BreadcSection.vue
│   │   ├── KontakSection.vue
│   │   ├── DataRepository.vue
│   │   ├── DatasetCard.vue
│   │   ├── DatasetDetail.vue
│   │   ├── DatasetFilter.vue
│   │   ├── DatasetSidebar.vue
│   │   ├── DatasetSidebarGroup.vue
│   │   ├── DatasetSidebarOrganization.vue
│   │   ├── DatasetPagination.vue
│   │   ├── ResourceDetail.vue
│   │   ├── ExcelPreview.vue
│   │   ├── DynamicTabelStatistik.vue
│   │   ├── DynamicTabelJenis1.vue
│   │   ├── DynamicTabelJenis2.vue
│   │   ├── DynamicTabelJenis3.vue
│   │   ├── NewsSection.vue
│   │   ├── DataStory.vue
│   │   ├── IndikatorStrategis.vue
│   │   ├── RegionalFilter.vue
│   │   ├── RegionalCard.vue
│   │   ├── InsightDetail.vue
│   │   ├── DatacardBasic.vue
│   │   └── DatacardFull.vue
│   │
│   ├── composables/
│   │   └── useNavigation.js        # Navigation utilities
│   │
│   ├── config/
│   │   └── api.js                  # API endpoint configuration
│   │
│   ├── utils/
│   │   ├── excel.js                # Excel export utility
│   │   └── dates.js                # Date formatting utility
│   │
│   └── assets/
│       ├── css/
│       │   └── main.css            # Global styles
│       └── images/                 # Static images
│
├── .env.development                # Development environment
├── .env.production                 # Production environment
├── package.json
├── vite.config.js
├── jsconfig.json
├── .prettierrc.json
├── Dockerfile
├── docker-entrypoint.sh
└── nginx.conf
```

---

## 4. Fitur Utama

### A. Halaman Beranda (`HomeView.vue`)

- Hero section dengan header regional
- Indikator strategis regional
- Carousel repositori data (organisasi)
- Seksi berita terbaru (headline)
- Data story (insight unggulan)
- Navigasi 4 wilayah: Kalimantan, Sulawesi, Maluku, Papua

### B. Regional Insight (`RegionalInsight.vue`)

- Eksplorasi wawasan dinamika sosial-ekonomi
- Filter berdasarkan wilayah dan topik
- Tampilan kartu dengan informasi penulis, tanggal, lokasi
- Detail insight dengan visualisasi Tableau

### C. Visualisasi Data (`VisualisasiData.vue`)

- Charting interaktif dengan Chart.js
- Multiselect dropdown untuk wilayah dan dataset
- Rendering chart dinamis berdasarkan data terpilih

### D. Manajemen Dataset (`DatasetView.vue`)

- Browse dataset dari repositori terintegrasi
- Pagination (10 item per halaman)
- Filter berdasarkan grup dan organisasi
- Fitur pencarian real-time

### E. Detail Dataset (`DatasetDetail.vue`)

- Informasi lengkap dataset (organisasi, author, lisensi)
- Daftar resource dengan opsi download dan preview
- Menampilkan tag dan metadata (extras)
- Tracking jumlah download per resource

### F. Preview Resource (`ResourceDetail.vue`)

- Preview file Excel/CSV dengan rendering tabel
- 3 format tabel dinamis berdasarkan struktur data
- Selector wilayah dan rentang tahun
- Export ke Excel

### G. Berita (`BeritaView.vue`, `BeritaDetil.vue`)

- Daftar artikel berita dengan thumbnail
- Detail artikel lengkap
- Sidebar berita terkini
- Fitur pencarian berita

### H. About Page (`AboutView.vue`)

- Informasi tentang Konsultasi Regional (KONREG)

---

## 5. Routing & Navigasi

### Struktur Routes

| Path | View | Deskripsi |
|------|------|-----------|
| `/` | `HomeView` | Halaman beranda |
| `/berita` | `BeritaView` | Daftar berita |
| `/berita/:id` | `BeritaDetil` | Detail berita (by slug) |
| `/regional_insight` | `RegionalInsight` | Daftar regional insight |
| `/regional_insight/:id` | `RegionalInsightDetil` | Detail insight |
| `/visualisasi_data` | `VisualisasiData` | Visualisasi data |
| `/dataset` | `DatasetViewRoute` | Browse dataset |
| `/dataset?group_id=X` | `DatasetGroupView` | Filter by grup |
| `/dataset?organization_id=X` | `DatasetOrganizationView` | Filter by organisasi |
| `/dataset/:id` | `DatasetDetail` | Detail dataset |
| `/resource/:id` | `ResourceDetail` | Detail resource |
| `/about` | `AboutView` | Tentang aplikasi |

### Scroll Behavior

```javascript
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition  // Restore scroll position on back
  } else {
    return { top: 0 }     // Scroll to top on new page
  }
}
```

### Metode Navigasi

**1. Router-Link (Declarative):**
```vue
<router-link :to="`/berita/${item.slug}`">
  {{ item.judul }}
</router-link>
```

**2. Programmatic Navigation:**
```javascript
router.push({ path: '/dataset', query: { group_id: groupId } })
router.replace({ path: '/dataset', query: { page: pageNum } })
```

---

## 6. Integrasi API

### Konfigurasi (`src/config/api.js`)

Aplikasi terintegrasi dengan **3 backend API**:

#### 1. Main API (`API_BASE_URL`)

| Endpoint | Fungsi |
|----------|--------|
| `/api/berita` | CRUD berita |
| `/api/insight` | Regional insights |
| `/api/setelan` | Pengaturan/konfigurasi |
| `/api/dataset-kategori` | Kategori dataset |
| `/api/dataset-list` | Daftar dataset internal |

#### 2. Data Hub API (`DATAHUB_BASE_URL`) - CKAN

| Endpoint | Fungsi |
|----------|--------|
| `/ckan/datasets` | Daftar dataset |
| `/ckan/datasets-show` | Detail dataset |
| `/ckan/datasets-search` | Pencarian dataset |
| `/ckan/group` | Daftar grup |
| `/ckan/organization_list` | Daftar organisasi |
| `/ckan/resource` | Detail resource |
| `/ckan/proxy-excel` | Proxy file Excel |
| `/analytics/download-statistik` | Statistik download |
| `/api/ress-db` | Database resources |
| `/api/ress-off` | Official resources |
| `/api/ress-bps` | BPS statistics resources |

#### 3. Matomo API (`MATOMO_BASE_URL`)

| Endpoint | Fungsi |
|----------|--------|
| `/matomo.php` | Page view tracking |
| `/matomo.js` | Analytics script |

### Pola Fetching Data

```javascript
const fetchData = async () => {
  try {
    loading.value = true
    const res = await fetch(API_ENDPOINTS.BERITA + '?filters')
    const data = await res.json()
    items.value = data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
```

---

## 7. State Management

Aplikasi menggunakan **Vue 3 Composition API** dengan `reactive` dan `ref` untuk state management di level komponen. **Tidak menggunakan state manager global** (Vuex/Pinia).

### Pola State

#### A. Ref Pattern (Simple State)

```javascript
const search = ref('')           // User input
const datasets = ref([])         // API response
const loading = ref(true)        // Loading state
const currentPage = ref(1)       // Pagination state
```

#### B. Reactive Pattern (Complex State)

```javascript
const berita = reactive({
  headline_image: '',
  judul_headline: '',
  ringkasan_headline: '',
  href: '#',
  text: 'Baca selengkapnya',
})

const state = reactive({
  insight: null,
  dataset: [],
})
```

#### C. Computed Properties (Derived State)

```javascript
const filteredTahunAkhir = computed(() => {
  if (!tahunAwal.value) return []
  return tahunOptions.value.filter(t => parseInt(t.label) >= tahunAwal.value)
})

const currentPage = computed(() => Math.floor(offset.value / limit) + 1)
const totalPages = computed(() => Math.ceil(totalCount.value / limit))
```

#### D. Watch Patterns (Side Effects)

```javascript
watch(wilayahData, (newVal) => {
  // Filter data based on selected region
})

watch(selectedData, () => {
  fetchData()
}, { immediate: true })
```

#### E. Lifecycle Methods

```javascript
onMounted(async () => {
  await fetchData()
  window.addEventListener('resize', updateItemsPerSlide)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerSlide)
})
```

---

## 8. Komponen Utama

### Layout Components

| Komponen | Fungsi |
|----------|--------|
| `NavSection.vue` | Navigation bar dengan efek scroll |
| `HeadSection.vue` | Header dengan kartu regional |
| `FooterSection.vue` | Footer aplikasi |
| `BreadcSection.vue` | Breadcrumb navigation |
| `KontakSection.vue` | Section kontak |

### Data Display Components

| Komponen | Fungsi |
|----------|--------|
| `DataRepository.vue` | Carousel organisasi |
| `DatasetCard.vue` | Kartu dataset individual |
| `DatasetDetail.vue` | Display detail dataset |
| `ResourceDetail.vue` | Detail resource |
| `ExcelPreview.vue` | Preview tabel Excel/CSV |
| `NewsSection.vue` | Display berita unggulan |
| `DataStory.vue` | Data story section |

### Filter/Search Components

| Komponen | Fungsi |
|----------|--------|
| `DatasetFilter.vue` | Search bar dataset |
| `DatasetSidebar.vue` | Sidebar filters |
| `DatasetSidebarGroup.vue` | Filter grup |
| `DatasetSidebarOrganization.vue` | Filter organisasi |
| `RegionalFilter.vue` | Filter regional |
| `DatasetPagination.vue` | Pagination controls |

### Dynamic Table Components

| Komponen | Fungsi |
|----------|--------|
| `DynamicTabelStatistik.vue` | Meta-component pemilih tipe tabel |
| `DynamicTabelJenis1.vue` | Tabel tipe 1 (year-based) |
| `DynamicTabelJenis2.vue` | Tabel tipe 2 (sub-year structure) |
| `DynamicTabelJenis3.vue` | Tabel tipe 3 (variable-based) |

### Card Components

| Komponen | Fungsi |
|----------|--------|
| `DatacardBasic.vue` | Kartu data basic |
| `DatacardFull.vue` | Kartu data lengkap |
| `RegionalCard.vue` | Kartu regional insight |

### Other Components

| Komponen | Fungsi |
|----------|--------|
| `IndikatorStrategis.vue` | Indikator strategis dengan tab |
| `InsightDetail.vue` | Detail insight view |

---

## 9. Alur Kerja Aplikasi

### A. Alur Home View (`/`)

```
OnMounted() →
├── fetchHeadlineBerita()    [Berita headline terbaru]
├── updateItemsPerSlide()    [Responsive carousel size]
├── fetchTopInsight()        [Top insight data + image]
├── fetchGroups()            [Organization list dari CKAN]
└── window.resize listener   [Responsive updates]
```

**Data Loading:**
- `kategori`: List organisasi untuk carousel
- `berita`: Objek berita headline
- `data_section`: Data insight unggulan
- `dataset`: Dataset terkait insight
- `itemsPerSlide`: Jumlah item carousel (responsive)

### B. Alur Dataset Listing (`/dataset`)

```
DatasetViewRoute mendeteksi query params:
├── Jika ?group_id → DatasetGroupView
├── Jika ?organization_id → DatasetOrganizationView
└── Default → DatasetView

DatasetView:
├── Load sidebar filters (groups, organizations)
├── User input search/klik filter
├── applySearch() dipanggil
│   ├── Jika search kosong → fetchData() [General list]
│   └── Jika search terisi → fetchDataFiltered() [Search results]
├── Render DatasetCard components
└── Pagination navigation
```

### C. Alur Dataset Detail (`/dataset/:id`)

```
OnMounted() →
├── Fetch CKAN_DATASET_SHOW?id={datasetId}
├── Populate metadata (title, description, author, license)
├── Load resource list dengan pagination
└── Untuk setiap resource:
    ├── Display format badge
    ├── Show download counter
    ├── "Unduh" button → checkAndDownload()
    └── "Preview" button → previewExcel()
```

### D. Alur Resource Detail (`/resource/:id`)

```
OnMounted() →
├── Fetch RESDB/{resourceId}
├── Check is_bps_api flag
│
├── Jika is_bps_api == 1 (BPS Resource):
│   ├── Fetch RESBPS/{resourceId}
│   ├── Load tahun options
│   ├── Load wilayah (region) options
│   └── Initialize statistikData
│
└── Jika is_bps_api == 0 (External Resource):
    ├── Fetch RESOFF/{resourceId}
    └── Display sebagai external resource dengan URL

User Selection:
├── Pilih Wilayah → Filter provinces berdasarkan region codes
├── Pilih Tahun Awal → Update filteredTahunAkhir
├── Pilih Tahun Akhir → Update rangeData
└── DynamicTabelStatistik renders appropriate table type
```

**Deteksi Tipe Tabel:**
```
DynamicTabelStatistik menganalisis struktur data:
├── jenis1: tahun!=0 && turtahun==0 && turvar==0
│   → TabelStatistikJenis1 (Columns = years, Rows = variables)
│
├── jenis2: tahun!=0 && turtahun!=0 && turvar==0
│   → TabelStatistikJenis2 (Sub-year breakdowns)
│
└── jenis3: tahun!=0 && turtahun!=0 && turvar!=0
    → TabelStatistikJenis3 (Multiple variables)
```

### E. Alur Regional Insight (`/regional_insight`)

```
OnMounted() →
├── Check route.query.region
├── Jika ada, set filter state
└── fetchInsight(filterObject)

RegionalFilter Component:
├── keyword: Search text
├── region: Selected region
└── topik: Selected topic

OnChange → emit('filter-changed', filterObject)
          → Parent fetchInsight(filterObject)
          → Render RegionalCard components
```

### F. Alur Berita (`/berita`)

```
OnMounted() →
├── Check route.query.q (search query)
├── fetchBerita(filter)
└── Render news cards grid

User clicks article →
├── Navigate to /berita/{slug}
├── Fetch full article
└── Display with sidebar (latest news, search)
```

### G. Alur Visualisasi Data (`/visualisasi_data`)

```
OnMounted() →
├── fetchDataset() [GET dataset list]
├── Filter items where visualisasi === "1"
├── Map to { value: ckan_resource_id, label: judul }
└── Set selectedData to first available

watch(selectedData) →
├── fetchData() [GET analytics download]
├── Format response for chart
├── Prepare state (labels, dataValues, satuan, judul)
└── renderChart() with Chart.js
```

---

## 10. Alur Data (Data Flow)

### Arsitektur Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
│                (Click, Input, Page Load)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                VUE COMPONENT LOGIC                           │
│  (onMounted, watch, methods, computed properties)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              API CONFIGURATION                              │
│     (src/config/api.js - Endpoint URLs)                     │
│                                                              │
│  Three API Sources:                                         │
│  1. MATOMO_ENDPOINT (Analytics)                             │
│  2. API_ENDPOINTS (Internal CMS data)                       │
│  3. DATAHUB_ENDPOINTS (CKAN data portal)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL APIs                                  │
│                                                              │
│  1. CKAN Backend (datasets, resources, organizations)       │
│  2. Internal API (berita, insights, settings)               │
│  3. Matomo (page view tracking)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             RESPONSE DATA STORAGE                            │
│                                                              │
│  ref/reactive state → Triggers template re-renders           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                TEMPLATE RENDERING                           │
│                                                              │
│  v-if/v-for directives → Component props → Event listeners  │
└─────────────────────────────────────────────────────────────┘
```

### Contoh Data Flow: Dataset Listing

```
DatasetView.vue (onMounted)
    ↓
fetchData()
    ↓
GET /ckan/datasets?limit=10&offset=0
    ↓
Response: { result: [...], total: 1000 }
    ↓
Store: datasets.ref = data.result
       filteredDatasets.ref = data.result
       totalCount.ref = data.total
    ↓
Template renders DatasetCard (v-for)
    ↓
User sees paginated results
```

### Contoh Data Flow: Resource BPS

```
ResourceDetail.vue (onMounted)
    ↓
Fetch RESDB/{resourceId}
    ↓
Check is_bps_api == 1
    ↓
GET /api/ress-bps/{resourceId}
    ↓
Response: {
    tahun: [{label: '2020', val: 20}, ...],
    turtahun: [{label: 'Q1', val: 1}, ...],
    turvar: [{label: 'Jkt', val: 1}, ...],
    vervar: [{label: 'Prov1', val: 6100}, ...],
    datacontent: { "6100##1##1##20##1": "value", ... }
}
    ↓
Store in dataResponse.ref
    ↓
watch(wilayahData) triggered
    ↓
Filter vervar based on region codes
    ↓
Store filtered data in statistikData
    ↓
DynamicTabelStatistik detects jenis type
    ↓
Render appropriate table component
```

---

## 11. Komunikasi Antar Komponen

### A. Props Flow (Parent → Child)

```vue
<!-- HomeView → DataRepository -->
<DataRepository
  :kategori="kategori"
  :itemsPerSlide="itemsPerSlide"
  :loading="loading"
/>

<!-- DatasetView → DatasetCard -->
<DatasetCard
  :datasets="filteredDatasets"
/>

<!-- ResourceDetail → DynamicTabelStatistik -->
<DynamicTabelStatistik
  :data="statistikData"
  :index="0"
  :yearRange="rangeData"
/>
```

### B. Emits Flow (Child → Parent)

```javascript
// DatasetFilter.vue
const emit = defineEmits(['update:search', 'search'])
emit('search', searchInput.value)

// DatasetView.vue
<DatasetFilter v-model:search="search" @search="applySearch" />

// DatasetSidebar emits
@groupSelected="redirectToGroup"
@organizationSelected="redirectToOrg"

// RegionalFilter emits
emit('filter-changed', { keyword, region, topik })
```

### C. Event Handling

```vue
<!-- Button clicks -->
<button @click="checkAndDownload(resource, datasetName)">
  Unduh
</button>

<!-- Form inputs -->
<input
  v-model="searchInput"
  @keyup.enter="emitSearch"
/>

<!-- Select changes -->
<select v-model="selectedRegion" @change="applyFilters">
```

---

## 12. Alur Pencarian & Filter

### A. Dataset Search

```
User Input Search Term
    ↓
v-model:search binds to search.ref
    ↓
@keyup.enter triggers emitSearch()
    ↓
applySearch():
    ├── Jika search kosong:
    │   ├── Reset offset to 0
    │   └── fetchData() [General list]
    │
    └── Jika search terisi:
        ├── Reset offset to 0
        └── fetchDataFiltered()
            GET /ckan/datasets-search?rows=10&offset=0&keyword={search}
            ↓
        Store filtered results
            ↓
        Re-render DatasetCard
```

### B. Regional Insight Filter

```
RegionalFilter Component:
├── search text input
├── selectedRegion dropdown
└── selectedTopic dropdown

Saat filter berubah:
    ↓
applyFilters() → emit('filter-changed', filterObject)
    ↓
Parent: fetchInsight(filterObject)
    GET /api/insight?keyword=...&region=...&topik=...
    ↓
insights.ref = data
    ↓
Render RegionalCard components
```

### C. Sidebar Filters

```
Group Filter:
├── Fetch groups from CKAN
├── Display list with package_count
├── User clicks → emit('groupSelected', groupId)
├── Parent: router.push({ query: { group_id: groupId } })
└── DatasetViewRoute switches to DatasetGroupView

Organization Filter:
├── Fetch organizations from CKAN
├── Display list with package_count
├── User clicks → emit('organizationSelected', orgId)
├── Parent: router.push({ query: { organization_id: orgId } })
└── DatasetViewRoute switches to DatasetOrganizationView
```

### D. Resource Detail Filters (BPS)

```
User selects Wilayah (Region)
    ↓
watch(wilayahData) triggered
    ↓
selectedFilter = region codes array
    Example: Kalimantan → [6100,6200,6300,6400,6500]
    ↓
Filter vervar to matching provinces
    ↓
statistikData updated
    ↓
Table renders with filtered regions

User selects Tahun Awal/Akhir
    ↓
rangeData computed: `${tahunAwal}-${tahunAkhir}`
    ↓
Pass to DynamicTabelStatistik for year-range filtering
```

---

## 13. Alur Download & Export

### A. Direct File Download

```
User clicks "Unduh (count)" button
    ↓
checkAndDownload(resource, datasetName)
    ├── Validate: resource.url exists
    │
    ├── Track download:
    │   POST /analytics/download-statistik
    │   Body: { resource_id, dataset_name, ... }
    │
    ├── Update counter:
    │   jumlahDownload[resourceId##resourceName]++
    │
    └── Browser downloads file:
        window.location.href = resource.url
```

### B. Excel Export dari Tabel Statistik

```
User clicks "Unduh" pada tabel
    ↓
downloadExcel(data, index, yearRange)
    ├── Parse yearRange into array: [2020, 2023]
    ├── Detect table type (jenis1, jenis2, jenis3)
    ├── Build appropriate header structure
    │
    ├── Map datacontent object by key:
    │   key format: `${vervar}${var}${turvar}${tahun}${turtahun}`
    │   value: data.datacontent[key] ?? ''
    │
    ├── Create 2D array (sheetData)
    │
    └── Use XLSX library:
        XLSX.utils.aoa_to_sheet(sheetData)
        XLSX.utils.book_new()
        XLSX.utils.book_append_sheet()
        XLSX.writeFile(workbook, filename)

Filename:
├── turtahun0_turvar0.xlsx (Jenis 1)
├── turtahun1_turvar0.xlsx (Jenis 2)
└── turtahun0_turvar1.xlsx (Jenis 3)
```

### C. Excel Preview Modal

```
User clicks "Preview" on Excel file
    ↓
previewExcel(resource, datasetName)
    ├── fileUrl = resource.url
    ├── name = resource.name
    └── showModal = true
        ↓
ExcelPreview modal opens
    ├── Proxy file: /ckan/proxy-excel?url={fileUrl}
    ├── Load Excel with XLSX library
    ├── Parse first sheet
    ├── Render table with merged headers
    └── Display first 20 rows
```

---

## 14. Integrasi Analytics (Matomo)

### A. Inisialisasi (main.js)

```javascript
app.mixin({
  mounted() {
    if (this.$root !== this) return
    if (window._paq) return  // Already initialized

    const _paq = (window._paq = window._paq || [])

    _paq.push(['trackPageView'])
    _paq.push(['enableLinkTracking'])

    const u = MATOMO_ENDPOINT.BASE_URL
    _paq.push(['setTrackerUrl', u + '/matomo.php'])
    _paq.push(['setSiteId', '1'])

    // Load Matomo script
    const g = document.createElement('script')
    g.async = true
    g.src = u + '/matomo.js'
    document.getElementsByTagName('script')[0].parentNode.insertBefore(g, s)
  }
})
```

### B. Page View Tracking (Router)

```javascript
router.afterEach(() => {
  if (window._paq) {
    _paq.push(['setCustomUrl', window.location.href])
    _paq.push(['setDocumentTitle', document.title])
    _paq.push(['trackPageView'])
  }
})
```

### C. Events yang Di-track

| Event | Trigger | Data |
|-------|---------|------|
| Page View | Route change | URL, Title |
| Download | File download | Resource ID, Dataset name |
| Filter | Search/filter applied | URL with query params |

### D. Data yang Dikirim ke Matomo

- Visitor IP (anonymized)
- Page URL
- Page title
- Referrer
- Device type/OS/Browser
- Resolution
- Timestamp
- Session duration

---

## 15. Contoh Perjalanan Pengguna

### Journey 1: Mencari dan Download Dataset

```
1. User lands on homepage /
   ↓
2. Sees organizations carousel
   ↓
3. Clicks "Data" in navbar → /dataset
   ↓
4. Sidebar shows organizations and groups
   ↓
5. Searches "kemiskinan"
   ↓
   DatasetFilter → search="kemiskinan"
   applySearch() → fetchDataFiltered()
   GET /ckan/datasets-search?keyword=kemiskinan
   ↓
6. Results appear in DatasetCard
   ↓
7. Clicks "Lihat Detail" on dataset
   ↓
   Navigate to /dataset/abc123
   ↓
8. DatasetDetail page loads
   ↓
   Fetch CKAN_DATASET_SHOW?id=abc123
   ↓
9. Sees resources list with download counts
   ↓
10. Clicks "Unduh (5)" on Excel file
    ↓
    checkAndDownload()
    POST /analytics/download-statistik
    Download count: "Unduh (6)"
    Browser downloads file.xlsx
```

### Journey 2: Eksplorasi Regional Insight

```
1. User clicks "Regional Insight" → /regional_insight
   ↓
2. Selects Region: "Sulawesi" + Topic: "Ketenagakerjaan"
   ↓
   emit('filter-changed')
   fetchInsight({region: 'sulawesi', topik: 'Ketenagakerjaan'})
   ↓
3. RegionalCard components render
   ↓
4. Clicks insight card → /regional_insight/slug123
   ↓
5. Insight detail loads with Tableau visualization
   ↓
6. Sees "Related Datasets" section
   ↓
7. Clicks related dataset → /dataset/xyz789
   ↓
8. Clicks "Preview" on resource
   ↓
   ExcelPreview modal opens
   ↓
9. Clicks "Download" → Downloads resource
```

### Journey 3: Melihat Data Statistik BPS

```
1. User on dataset detail → clicks resource link
   ↓
   Navigate to /resource/res123
   ↓
2. ResourceDetail loads
   ↓
   is_bps_api == 1, fetch RESBPS/{res123}
   ↓
3. Form appears with dropdowns:
   - Wilayah: [Kasulampua, Indonesia, Kalimantan, ...]
   - Tahun Awal: [2015, 2016, ..., 2023]
   - Tahun Akhir: [filtered]
   ↓
4. User selects:
   - Wilayah: "Sulawesi"
   - Tahun Awal: "2020"
   - Tahun Akhir: "2023"
   ↓
5. watch(wilayahData) filters vervar
   Filter to Sulawesi provinces: [7100,7200,...]
   ↓
6. Table renders (Jenis 1/2/3 detected)
   ↓
7. User clicks "Unduh" in table
   ↓
   downloadExcel(statistikData, 0, "2020-2023")
   ↓
   Downloads: turtahun0_turvar0.xlsx
```

---

## 16. Hierarki Komponen

```
App.vue (Root)
├── router-view
│
├── Layout Components:
│   ├── NavSection.vue
│   ├── BreadcSection.vue
│   ├── KontakSection.vue
│   └── FooterSection.vue
│
└── Page Components:
    │
    ├── HomeView.vue
    │   ├── HeadSection.vue
    │   ├── IndikatorStrategis.vue
    │   ├── DataRepository.vue
    │   ├── NewsSection.vue
    │   ├── DataStory.vue
    │   └── DatacardFull.vue
    │
    ├── DatasetViewRoute.vue
    │   ├── DatasetView.vue
    │   │   ├── DatasetFilter.vue
    │   │   ├── DatasetSidebar.vue
    │   │   │   ├── DatasetSidebarGroup.vue
    │   │   │   └── DatasetSidebarOrganization.vue
    │   │   ├── DatasetCard.vue
    │   │   └── DatasetPagination.vue
    │   ├── DatasetGroupView.vue
    │   └── DatasetOrganizationView.vue
    │
    ├── DatasetDetail.vue (View)
    │   └── DatasetDetail.vue (Component)
    │       └── ExcelPreview.vue
    │
    ├── ResourceDetail.vue (View)
    │   └── ResourceDetail.vue (Component)
    │       └── DynamicTabelStatistik.vue
    │           ├── DynamicTabelJenis1.vue
    │           ├── DynamicTabelJenis2.vue
    │           └── DynamicTabelJenis3.vue
    │
    ├── RegionalInsight.vue
    │   ├── RegionalFilter.vue
    │   └── RegionalCard.vue
    │
    ├── RegionalInsightDetil.vue
    │   └── InsightDetail.vue
    │
    ├── BeritaView.vue
    │
    ├── BeritaDetil.vue
    │
    ├── VisualisasiData.vue
    │
    └── AboutView.vue
```

---

## 17. Utilities

### src/utils/dates.js

```javascript
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)

  const tanggal = date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const waktu = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return `${tanggal} - ${waktu}`
}

// Output: "1 Januari 2024 - 14:30:45"
```

### src/utils/excel.js

```javascript
export const downloadExcel = (data, index, yearRange) => {
  // 1. Parse data structure
  // 2. Detect table type (jenis1, jenis2, jenis3)
  // 3. Build appropriate headers
  // 4. Map datacontent to 2D array
  // 5. Export using XLSX library
  // 6. Trigger browser download
}
```

### src/composables/useNavigation.js

```javascript
export function useNavigation() {
  const isScrolledNav = ref(false)

  const handleScroll = () => {
    isScrolledNav.value = window.scrollY > 50
  }

  const navigationLinks = computed(() => [
    { text: 'Beranda', href: '/' },
    { text: 'Pusat Informasi', href: 'https://info.kasulampua.id' },
    { text: 'Regional Insight', href: '/regional_insight' },
    { text: 'Data', href: '/dataset' },
    { text: 'Berita', href: '/berita' },
    { text: 'Tentang', href: '/about' },
  ])

  return { isScrolledNav, handleScroll, navigationLinks }
}
```

---

## 18. Konfigurasi Environment

### .env.development

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_DATAHUB_BASE_URL=http://localhost:3500
VITE_MATOMO_URL=http://localhost:9000
VITE_MATOMO_AUTH=dev_token
```

### .env.production

```env
VITE_API_BASE_URL=https://atur-api.kasulampua.id
VITE_DATAHUB_BASE_URL=https://datahub.kasulampua.id
VITE_MATOMO_URL=https://itik.kasulampua.id
VITE_MATOMO_AUTH=production_token
```

### Penggunaan di Code

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const DATAHUB_BASE_URL = import.meta.env.VITE_DATAHUB_BASE_URL
const MATOMO_BASE_URL = import.meta.env.VITE_MATOMO_URL
```

---

## 19. Error Handling

### Try-Catch Pattern

```javascript
try {
  const res = await fetch(API_ENDPOINTS.BERITA)
  const data = await res.json()
  berita.value = data
} catch (err) {
  console.error('Gagal memuat berita:', err)
}
```

### Loading & Error States

```javascript
const loading = ref(true)
const error = ref(null)

// Template usage:
<div v-if="loading" class="spinner-border">Loading...</div>
<div v-if="error" class="alert alert-danger">{{ error }}</div>
<div v-else>Content</div>
```

### Excel Preview Error Handling

```javascript
const showErrorWithLink = async (err, fileUrl, varname) => {
  // Check if file exists via CEK_URL_DATA_GO_ID
  // Show fallback link if file unreachable
}
```

---

## 20. Deployment

### Docker Configuration

**dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

**nginx.conf:**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Production URLs

| Service | URL |
|---------|-----|
| API | https://atur-api.kasulampua.id |
| Data Hub | https://datahub.kasulampua.id |
| Analytics | https://itik.kasulampua.id |

---

## 21. Scripts Development

```bash
# Start development server dengan hot reload
npm run dev

# Build untuk production
npm run build

# Preview build hasil
npm run preview

# Linting dengan ESLint (auto-fix)
npm run lint

# Format code dengan Prettier
npm run format
```

### Code Style Configuration

**.prettierrc.json:**
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

---

## Kesimpulan

**Kasulampua Frontend** adalah aplikasi portal data regional yang komprehensif dengan:

1. **Arsitektur Modern** - Vue 3 Composition API, Vite build tool
2. **Integrasi Multi-API** - CKAN, Internal CMS, Matomo Analytics
3. **Fitur Lengkap** - Browse dataset, visualisasi, berita, insight regional
4. **UX Responsif** - Bootstrap 5, mobile-friendly
5. **Analytics Terintegrasi** - Tracking pageview dan download
6. **Export Data** - Download file dan export Excel dari tabel statistik

Aplikasi ini dirancang sebagai portal publik tanpa autentikasi, fokus pada aksesibilitas data untuk analisis ekonomi lintas wilayah Kalimantan, Sulawesi, Maluku, dan Papua.
