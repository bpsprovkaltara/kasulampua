<template>
  <Navbar />

  <header class="hero-v2">
    <div class="hero-v2-glow" aria-hidden="true"></div>
    <div class="hero-v2-dots" aria-hidden="true"></div>

    <div class="container position-relative" style="z-index: 10">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="hero-v2-badge">
            <span class="badge-dot"></span>
            OPEN DATA KASULAMPUA
          </div>

          <h1 class="hero-v2-title">
            Katalog <br />
            <em>Dataset</em>
          </h1>

          <p class="hero-v2-subtitle">
            Akses dataset strategis dari <strong>Kalimantan</strong>, <strong>Sulawesi</strong>,
            <strong>Maluku</strong>, dan <strong>Papua</strong> secara terbuka dan terintegrasi.
          </p>
        </div>

        <div class="col-lg-4 d-flex justify-content-lg-end justify-content-center mt-4 mt-lg-0">
          <div class="hero-meta-card">
            <div class="hero-meta-item">
              <span class="hm-num">{{ total }}</span>
              <span class="hm-label">Dataset</span>
            </div>
            <div class="hm-divider"></div>
            <div class="hero-meta-item">
              <span class="hm-num">{{ categories.length }}</span>
              <span class="hm-label">Subjek</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="dataset-content py-5">
    <div class="container-xl">
      <div class="row g-4">
        <div class="col-lg-3 order-1 order-lg-1">
          <div class="sidebar-wrapper">
            <!-- Search (mobile) -->
            <div class="d-lg-none mb-3">
              <div class="search-box">
                <span class="search-icon" aria-hidden="true">
                  <span v-if="loading" class="search-spinner"></span>
                  <i v-else class="bi bi-search"></i>
                </span>
                <input
                  ref="mobileSearchInput"
                  class="search-input"
                  type="text"
                  v-model="search"
                  @input="applySearch"
                  @keydown.esc.prevent="clearSearch"
                  placeholder="Cari judul dataset atau kata kunci..."
                  aria-label="Cari dataset"
                />
                <button
                  v-if="search"
                  class="search-clear"
                  @click="clearSearch"
                  aria-label="Hapus pencarian"
                >
                  <i class="bi bi-x" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div class="sidebar-card mb-3">
              <div class="sidebar-card-header clickable" @click="toggleCategory">
                <div class="d-flex align-items-center">
                  <i class="bi bi-grid-3x3-gap-fill text-amber me-2"></i>
                  <span>Subjek</span>
                </div>
                <i class="bi bi-chevron-down ms-auto transition-smooth" :class="{ 'rotate-180': categoryExpanded }"></i>
              </div>
              <div class="sidebar-card-body collapsible" :class="{ 'expanded': categoryExpanded }">
                <button
                  class="sidebar-item"
                  :class="{ active: selectedCategory === null }"
                  @click="selectCategory(null)"
                >
                  <span class="si-icon"><i class="bi bi-archive-fill"></i></span>
                  <span class="si-label">Semua Subjek</span>
                </button>
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  class="sidebar-item"
                  :class="{ active: selectedCategory === cat.id }"
                  @click="selectCategory(cat.id)"
                >
                  <span class="si-icon"><i :class="getCategoryIcon(cat.name)"></i></span>
                  <span class="si-label">{{ cat.name }}</span>
                  <span class="si-badge">{{ cat.count }}</span>
                </button>
              </div>
            </div>

            <div class="sidebar-card mb-3">
              <div class="sidebar-card-header clickable" @click="toggleWilayah">
                <div class="d-flex align-items-center">
                  <i class="bi bi-geo-alt-fill text-amber me-2"></i>
                  <span>Wilayah</span>
                </div>
                <i class="bi bi-chevron-down ms-auto transition-smooth" :class="{ 'rotate-180': wilayahExpanded }"></i>
              </div>
              <div class="sidebar-card-body collapsible" :class="{ expanded: wilayahExpanded }">
                <button
                  class="sidebar-item"
                  :class="{ active: selectedWilayah === null }"
                  @click="selectWilayah(null)"
                >
                  <span class="si-icon"><i class="bi bi-globe2"></i></span>
                  <span class="si-label">Semua Wilayah</span>
                </button>
                <button
                  v-for="w in wilayahRegions"
                  :key="w.id"
                  class="sidebar-item"
                  :class="{ active: selectedWilayah === w.id }"
                  @click="selectWilayah(w.id)"
                >
                  <span class="si-icon"><i class="bi bi-geo-alt"></i></span>
                  <span class="si-label">{{ w.label }}</span>
                  <span class="si-badge">{{ w.count }}</span>
                </button>
              </div>
            </div>


            <div class="sidebar-card mb-3 premium-sidebar-card">
              <div class="sidebar-card-header clickable" @click="toggleSatuData">
                <div class="d-flex align-items-center">
                  <div class="header-icon-box me-2">
                    <i class="bi bi-link-45deg"></i>
                  </div>
                  <span>Portal Satu Data</span>
                </div>
                <i class="bi bi-chevron-down ms-auto transition-smooth" :class="{ 'rotate-180': satuDataExpanded }"></i>
              </div>
              <div class="sidebar-card-body collapsible" :class="{ expanded: satuDataExpanded }">
                <div v-for="region in satuDataLinks" :key="region.region" class="sd-region-group mb-3">
                  <div class="sd-region-label">
                    <span class="label-dot"></span>
                    {{ region.region }}
                  </div>
                  <div class="sd-links-grid">
                    <a
                      v-for="portal in region.portals"
                      :key="portal.name"
                      :href="portal.url"
                      target="_blank"
                      class="sd-link-item ripple"
                    >
                      <span class="portal-initial">{{ portal.name.charAt(0) }}</span>
                      <span class="portal-name">{{ portal.name }}</span>
                      <i class="bi bi-arrow-up-right portal-arrow"></i>
                    </a>
                  </div>
                </div>
                <div class="sd-footer-link pt-3 border-top">
                  <a href="https://data.go.id" target="_blank" class="sd-main-link">
                    <div class="sdi-icon-bg">
                      <i class="bi bi-database-fill"></i>
                    </div>
                    <span>Satu Data Indonesia</span>
                    <i class="bi bi-chevron-right ms-auto"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9 order-2 order-lg-2">
          <div class="topbar mb-3">
            <!-- Baris 1: Search input (desktop only) -->
            <div class="d-none d-lg-block topbar-search-row">
              <div class="search-box">
                <span class="search-icon" aria-hidden="true">
                  <span v-if="loading" class="search-spinner"></span>
                  <i v-else class="bi bi-search"></i>
                </span>
                <input
                  ref="desktopSearchInput"
                  class="search-input"
                  type="text"
                  v-model="search"
                  @input="applySearch"
                  @keydown.esc.prevent="clearSearch"
                  placeholder="Cari judul dataset atau kata kunci..."
                  aria-label="Cari dataset"
                />
                <button
                  v-if="search"
                  class="search-clear"
                  @click="clearSearch"
                  aria-label="Hapus pencarian"
                >
                  <i class="bi bi-x" aria-hidden="true"></i>
                </button>
                <span v-if="!search && !loading" class="search-shortcut-badge">/</span>
              </div>
            </div>

            <!-- Baris 2: Meta bar — result count + reset -->
            <div class="topbar-meta-row">
              <span class="result-count" v-if="!loading">
                <i class="bi bi-database-fill text-amber me-2"></i>
                <span class="text-muted small mx-1">Menampilkan</span> <strong>{{ datasets.length }}</strong> <span class="text-muted small mx-1">dari</span> <strong>{{ total }}</strong> <span class="text-muted small mx-1">dataset</span>
              </span>
              <span class="result-count result-count--skeleton" v-else aria-hidden="true">&nbsp;</span>
              <button
                v-if="hasActiveFilters"
                class="reset-all-btn"
                @click="resetFilters"
                aria-label="Reset semua filter"
              >
                <i class="bi bi-x-circle me-1"></i>Reset semua
              </button>
            </div>

            <!-- Baris 3: Filter chips aktif -->
            <div v-if="hasActiveFilters && !loading" class="filter-chips-row" role="list" aria-label="Filter aktif">
              <span v-if="search" class="filter-chip filter-chip--search" role="listitem">
                <i class="bi bi-search me-1" aria-hidden="true"></i>
                <span class="chip-label">"{{ search }}"</span>
                <button class="chip-dismiss" @click="clearSearch" aria-label="Hapus pencarian">
                  <i class="bi bi-x" aria-hidden="true"></i>
                </button>
              </span>
              <span v-if="activeCategoryLabel" class="filter-chip filter-chip--category" role="listitem">
                <i class="bi bi-grid-3x3-gap-fill me-1" aria-hidden="true"></i>
                <span class="chip-label">{{ activeCategoryLabel }}</span>
                <button class="chip-dismiss" @click="selectCategory(null)" aria-label="Hapus filter subjek">
                  <i class="bi bi-x" aria-hidden="true"></i>
                </button>
              </span>
              <span v-if="activeWilayahLabel" class="filter-chip filter-chip--wilayah" role="listitem">
                <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>
                <span class="chip-label">{{ activeWilayahLabel }}</span>
                <button class="chip-dismiss" @click="selectWilayah(null)" aria-label="Hapus filter wilayah">
                  <i class="bi bi-x" aria-hidden="true"></i>
                </button>
              </span>
            </div>
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="loading" class="dataset-list" key="loading">
              <div v-for="i in 5" :key="i" class="dataset-item skeleton-item">
                <div class="item-rank skeleton-rank"></div>
                <div class="item-content flex-grow-1">
                  <div class="skeleton-tags mb-2">
                    <div class="skeleton-tag"></div>
                    <div class="skeleton-tag"></div>
                  </div>
                  <div class="skeleton-title mb-2"></div>
                  <div class="skeleton-text"></div>
                  <div class="skeleton-text w-75 mt-1"></div>
                </div>
                <div class="item-action skeleton-action"></div>
              </div>
            </div>
            <div v-else-if="!displayedDatasets.length" class="empty-card" key="empty">
              <i class="bi bi-inbox empty-icon"></i>
              <h5 class="fw-bold mt-3 mb-1">Tidak ada dataset</h5>
              <p class="text-muted small">Coba ubah filter atau kata kunci pencarian.</p>
              <button
                class="btn btn-sm btn-outline-amber rounded-pill px-4 mt-2"
                @click="resetFilters"
              >
                Reset Filter
              </button>
            </div>

            <div v-else class="dataset-list" key="list">
              <router-link
                v-for="(dataset, index) in displayedDatasets"
                :key="dataset.id || index"
                :to="{ path: `/dataset/${dataset.name || dataset.id}`, query: { from: $route.fullPath } }"
                class="dataset-item text-decoration-none"
              >
                <div class="item-content flex-grow-1 min-w-0">
                  <div class="item-tags mb-2">
                    <span
                      class="item-cat-tag"
                      v-for="group in (dataset.groups || []).slice(0, 2)"
                      :key="group.name"
                    >
                      <i :class="getCategoryIcon(group.display_name || group.title)" class="me-1"></i>
                      {{ group.display_name || group.title }}
                    </span>
                    <span
                      class="item-region-tag"
                      v-if="dataset.organization"
                    >
                      <i class="bi bi-building me-1"></i>
                      {{ ckanOrgToWilayahLabel(dataset.organization) }}
                    </span>
                  </div>
                  <h6 class="item-title mb-2">{{ dataset.title }}</h6>
                  
                  <div class="item-meta-info d-flex align-items-center gap-3">
                    <span class="meta-data-item">
                      <i class="bi bi-calendar3 me-1"></i>
                      {{ formatLongDate(dataset.metadata_modified || dataset.metadata_created) }}
                    </span>
                  </div>
                </div>

                <div class="item-action flex-shrink-0">
                  <div class="detail-icon">
                    <i class="bi bi-chevron-right"></i>
                  </div>
                </div>
              </router-link>
            </div>
          </transition>

          <PaginationControl
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="goToPage"
          />
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import { useDatasetStore } from '@/composables/useDatasetStore'
import { CKAN_ACTION_API } from '@/config/api'
import { ckanOrgToWilayahLabel, sortDatasetsByDomain } from '@/utils/ckanOrganizationWilayah.js'
import { buildPackageSearchFilterQuery } from '@/utils/ckanPackageSearchFilters.js'
import { formatLongDate } from '@/utils/dates'
import PaginationControl from '../components/PaginationControl.vue'

const route = useRoute()
const router = useRouter()

const store = useDatasetStore()
const { categories, wilayahRegions } = store

const search = ref('')
const selectedCategory = ref(null)
const selectedWilayah = ref(null)
const currentPage = ref(1)
const limit = 12
const categoryExpanded = ref(true)
const wilayahExpanded = ref(true)
const satuDataExpanded = ref(true)

const satuDataLinks = [
  {
    region: 'Kalimantan',
    portals: [
      { name: 'Kalbar', url: 'https://data.kalbarprov.go.id' },
      { name: 'Kalteng', url: 'https://satudata.kalteng.go.id' },
      { name: 'Kalsel', url: 'https://opendata.kalselprov.go.id' },
      { name: 'Kaltim', url: 'https://satudata.kaltimprov.go.id' }
    ]
  },
  {
    region: 'Sulawesi',
    portals: [
      { name: 'Sulut', url: 'https://data.go.id/dataset?q=sulawesi+utara' },
      { name: 'Sulsel', url: 'https://satudata.sulselprov.go.id' }
    ]
  },
  {
    region: 'Maluku',
    portals: [
      { name: 'Malut', url: 'https://satudata.malutprov.go.id' }
    ]
  }
]

const datasets = ref([])
/** Semua dataset terurut domain (dipakai saat mode default tanpa filter/pencarian) */
const allSortedDatasets = ref([])
const total = ref(0)
const loading = ref(true)

/** True bila belum ada filter maupun pencarian teks yang aktif (tampilan default). */
const isDefaultView = computed(
  () => !search.value.trim() && !selectedCategory.value && !selectedWilayah.value
)

/**
 * Dataset yang ditampilkan di halaman saat ini.
 * - Mode default : slice dari allSortedDatasets yang sudah diurutkan by domain.
 * - Mode filter/search : hasil langsung dari CKAN (sudah dipaginasi server-side).
 */
const displayedDatasets = computed(() => {
  if (isDefaultView.value && allSortedDatasets.value.length > 0) {
    const start = (currentPage.value - 1) * limit
    return allSortedDatasets.value.slice(start, start + limit)
  }
  return datasets.value
})
const desktopSearchInput = ref(null)
const mobileSearchInput = ref(null)

let searchDebounce = null

function pickQueryStr(val) {
  if (val == null || val === '') return ''
  if (Array.isArray(val)) return String(val[0] ?? '')
  return String(val)
}

function cleanQuery(q) {
  const out = {}
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === '') continue
    out[k] = v
  }
  return out
}

const readRouteIntoState = () => {
  search.value = pickQueryStr(route.query.q)

  const pg = parseInt(pickQueryStr(route.query.page) || '1', 10)
  currentPage.value = Number.isFinite(pg) && pg >= 1 ? pg : 1

  const g = pickQueryStr(route.query.group)
  if (g && categories.value.length > 0) {
    const cat = categories.value.find((c) => c.id === g)
    if (cat) {
      selectedCategory.value = cat.id
      categoryExpanded.value = true
    } else {
      selectedCategory.value = null
    }
  } else {
    selectedCategory.value = null
  }

  const o = pickQueryStr(route.query.organization)
  if (o && wilayahRegions.value.length > 0) {
    const w = wilayahRegions.value.find((r) => r.id === o)
    if (w) {
      selectedWilayah.value = w.id
      wilayahExpanded.value = true
    } else {
      selectedWilayah.value = null
    }
  } else {
    selectedWilayah.value = null
  }
}

const totalPages = computed(() => {
  if (isDefaultView.value && allSortedDatasets.value.length > 0) {
    return Math.ceil(allSortedDatasets.value.length / limit)
  }
  return Math.ceil(total.value / limit)
})

const activeCategoryLabel = computed(() => {
  if (!selectedCategory.value) return null
  const cat = categories.value.find((c) => c.id === selectedCategory.value)
  return cat ? cat.name : null
})

const activeWilayahLabel = computed(() => {
  if (!selectedWilayah.value) return null
  const w = wilayahRegions.value.find((r) => r.id === selectedWilayah.value)
  return w ? w.label : null
})

const hasActiveFilters = computed(() =>
  !!(search.value || selectedCategory.value || selectedWilayah.value)
)

const toggleCategory = () => (categoryExpanded.value = !categoryExpanded.value)
const toggleWilayah = () => (wilayahExpanded.value = !wilayahExpanded.value)
const toggleSatuData = () => (satuDataExpanded.value = !satuDataExpanded.value)

const fetchDatasets = async () => {
  loading.value = true
  try {
    const hasFilters = search.value.trim() || selectedCategory.value || selectedWilayah.value

    if (!hasFilters) {
      // ─── MODE DEFAULT ─────────────────────────────────────────────────────────
      // Strategi adaptif:
      //  ≤ DOMAIN_SORT_THRESHOLD  → fetch semua sekaligus, sort client-side (akurat 100%)
      //  >  DOMAIN_SORT_THRESHOLD → server-side sort=organization asc (ringan, ~akurat)
      const DOMAIN_SORT_THRESHOLD = 500

      // Langkah 1: cek jumlah total dulu (request ringan, rows=0)
      const countRes = await fetch(
        `${CKAN_ACTION_API.PACKAGE_SEARCH}?q=*:*&rows=0&start=0`
      )
      const countData = await countRes.json()
      const totalCount = countData.success ? (countData.result?.count || 0) : 0
      total.value = totalCount

      if (totalCount <= DOMAIN_SORT_THRESHOLD) {
        // ── Fetch semua → sort domain client-side (paginasi client-side) ──────
        const allParams = new URLSearchParams()
        allParams.set('q', '*:*')
        allParams.set('rows', totalCount || DOMAIN_SORT_THRESHOLD)
        allParams.set('start', 0)
        const allRes = await fetch(`${CKAN_ACTION_API.PACKAGE_SEARCH}?${allParams.toString()}`)
        const allData = await allRes.json()
        if (allData.success && allData.result) {
          allSortedDatasets.value = sortDatasetsByDomain(allData.result.results || [])
        } else {
          allSortedDatasets.value = []
        }
        datasets.value = []
      } else {
        // ── Dataset sangat banyak: sort server-side, paginate CKAN ───────────
        // organization asc ≈ urutan domain BPS (K-alimantan < M-aluku < P-apua < S-ulawesi)
        allSortedDatasets.value = []
        const params = new URLSearchParams()
        params.set('q', '*:*')
        params.set('rows', limit)
        params.set('start', (currentPage.value - 1) * limit)
        params.set('sort', 'organization asc')
        const res = await fetch(`${CKAN_ACTION_API.PACKAGE_SEARCH}?${params.toString()}`)
        const data = await res.json()
        if (data.success && data.result) {
          datasets.value = sortDatasetsByDomain(data.result.results || [])
        } else {
          datasets.value = []
        }
      }
    } else {
      // ─── MODE FILTER / PENCARIAN ──────────────────────────────────────────────
      // Gunakan pagination server-side CKAN agar relevansi/filter tetap akurat.
      allSortedDatasets.value = []

      const params = new URLSearchParams()
      params.set('rows', limit)
      params.set('start', (currentPage.value - 1) * limit)

      const qParts = []
      if (search.value.trim()) qParts.push(search.value.trim())
      params.set('q', qParts.length ? qParts.join(' ') : '*:*')

      const fq = buildPackageSearchFilterQuery({
        group: selectedCategory.value,
        organization: selectedWilayah.value,
      })
      if (fq) params.set('fq', fq)

      const res = await fetch(`${CKAN_ACTION_API.PACKAGE_SEARCH}?${params.toString()}`)
      const data = await res.json()

      if (data.success && data.result) {
        datasets.value = data.result.results || []
        total.value = data.result.count || 0
      } else {
        if (data && data.error) console.error('CKAN package_search error:', data.error)
        datasets.value = []
        total.value = 0
      }
    }
  } catch (err) {
    console.error('Gagal memuat dataset:', err)
    datasets.value = []
    allSortedDatasets.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const categoryIcons = {
  Sosial: 'bi bi-people-fill',
  Kependudukan: 'bi bi-person-vcard-fill',
  Pertanian: 'bi bi-flower2',
  Pendidikan: 'bi bi-mortarboard-fill',
  Transportasi: 'bi bi-bus-front-fill',
  Ekonomi: 'bi bi-graph-up-arrow',
  Iklim: 'bi bi-cloud-sun-fill',
  Kesehatan: 'bi bi-heart-pulse-fill',
  Perdagangan: 'bi bi-shop-window',
  Pemerintahan: 'bi bi-bank2',
  Perkebunan: 'bi bi-tree-fill',
}
const getCategoryIcon = (name) => categoryIcons[name] || 'bi bi-archive-fill'

const selectCategory = (id) => {
  const next = { ...route.query, page: undefined }
  if (id) next.group = id
  else delete next.group
  router.replace({ path: '/dataset', query: cleanQuery(next) })
}

const selectWilayah = (orgName) => {
  const next = { ...route.query, page: undefined }
  if (orgName) next.organization = orgName
  else delete next.organization
  router.replace({ path: '/dataset', query: cleanQuery(next) })
}

const applySearch = () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    const next = {
      ...route.query,
      q: search.value.trim() || undefined,
      page: undefined,
    }
    router.replace({ path: '/dataset', query: cleanQuery(next) })
  }, 400)
}

const clearSearch = () => {
  search.value = ''
  applySearch()
}

const focusSearchInput = () => {
  const input = desktopSearchInput.value || mobileSearchInput.value
  if (input) input.focus()
}

const handleGlobalSearchShortcut = (event) => {
  const isSlash = event.key === '/'
  const targetTag = event.target?.tagName?.toLowerCase()
  const isTypingContext =
    targetTag === 'input' || targetTag === 'textarea' || event.target?.isContentEditable
  if (isSlash && !isTypingContext) {
    event.preventDefault()
    focusSearchInput()
  }
}

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    const next = { ...route.query, page: p > 1 ? String(p) : undefined }
    router.replace({ path: '/dataset', query: cleanQuery(next) })
  }
}

/**
 * Membangun query default: wilayah=Kasulampua, subjek=Neraca Ekonomi.
 * ID diambil dari store (sudah di-load) agar tidak hardcode slug CKAN.
 */
function getDefaultQuery() {
  const q = {}
  const kasulampua = wilayahRegions.value.find((r) => r.label === 'Kasulampua')
  if (kasulampua) q.organization = kasulampua.id

  const neracaEkonomi = categories.value.find((c) =>
    c.name.toLowerCase().includes('neraca') && c.name.toLowerCase().includes('ekonomi')
  )
  if (neracaEkonomi) q.group = neracaEkonomi.id

  return q
}

const resetFilters = () => {
  // Kembali ke filter default (bukan halaman kosong)
  router.replace({ path: '/dataset', query: cleanQuery(getDefaultQuery()) })
}

watch(
  () => route.query,
  async () => {
    if (pickQueryStr(route.query.tab) === 'publikasi') {
      const next = { ...route.query }
      delete next.tab
      router.replace({ path: '/publication', query: cleanQuery(next) })
      return
    }
    readRouteIntoState()
    await fetchDatasets()
  },
  { deep: true }
)

onMounted(async () => {
  if (pickQueryStr(route.query.tab) === 'publikasi') {
    const next = { ...route.query }
    delete next.tab
    router.replace({ path: '/publication', query: cleanQuery(next) })
    return
  }

  await store.fetchAllData()
  window.addEventListener('keydown', handleGlobalSearchShortcut)

  // Terapkan filter default hanya bila belum ada filter/pencarian di URL
  const hasExistingFilters = route.query.q || route.query.group || route.query.organization
  if (!hasExistingFilters) {
    const defaultQuery = getDefaultQuery()
    if (Object.keys(defaultQuery).length > 0) {
      // router.replace akan memicu watch(route.query) → readRouteIntoState + fetchDatasets
      router.replace({ path: '/dataset', query: cleanQuery(defaultQuery) })
      return
    }
  }

  readRouteIntoState()
  await fetchDatasets()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalSearchShortcut)
})
</script>

<style scoped>
.hero-meta-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--hero-white-30);
  backdrop-filter: blur(12px);
  border-radius: var(--border-radius);
  padding: 1.5rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.hero-meta-item {
  text-align: center;
}
.hm-num {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  color: white;
}
.hm-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--hero-white-90);
  text-transform: uppercase;
  margin-top: 6px;
}
.hm-divider {
  width: 1px;
  height: 32px;
  background: var(--hero-white-30);
  flex-shrink: 0;
}

.dataset-content {
  background: var(--bg-color);
  min-height: 70vh;
}

.sidebar-wrapper {
  position: sticky;
  top: 100px;
}
.sidebar-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.sidebar-card-header {
  padding: 16px 20px;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-card-header.clickable {
  cursor: pointer;
  user-select: none;
}
.sidebar-card-header.clickable:hover {
  background: var(--bg-accent-light);
}

.sidebar-card-body.collapsible {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s;
  padding: 0 10px;
}
.sidebar-card-body.collapsible.expanded {
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  -webkit-overflow-scrolling: touch;
}
.sidebar-card-body.collapsible.expanded::-webkit-scrollbar {
  width: 6px;
}
.sidebar-card-body.collapsible.expanded::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 6px;
}
.sidebar-card-body.collapsible.expanded::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.rotate-180 {
  transform: rotate(180deg);
}

.transition-smooth {
  transition: all 0.3s ease;
}

.sidebar-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: var(--transition-smooth);
  text-align: left;
  color: var(--text-secondary);
}
.sidebar-item:hover {
  background: var(--bg-accent-light);
  border-color: var(--border-amber-20);
  color: var(--primary-color);
}
.sidebar-item.active {
  background: var(--bg-accent);
  border-color: var(--border-amber-20);
  color: var(--primary-color);
  font-weight: 700;
}
.si-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
  transition: var(--transition-smooth);
}
.sidebar-item.active .si-icon {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.1);
}
.sidebar-item:hover .si-icon {
  background: white;
  color: var(--primary-color);
}
.si-label {
  font-size: 0.875rem;
  flex: 1;
}
.si-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--bg-color);
  padding: 2px 10px;
  border-radius: 100px;
  flex-shrink: 0;
}
.sidebar-item.active .si-badge {
  background: var(--primary-color);
  color: white;
}

/* Portal Satu Data Styles - PREMIUM UPGRADE */
.premium-sidebar-card {
  border: 1px solid rgba(217, 119, 6, 0.15) !important;
  box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.05) !important;
}

.header-icon-box {
  width: 28px;
  height: 28px;
  background: var(--bg-accent);
  color: var(--primary-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.sd-region-group {
  padding: 0 2px;
}

.sd-region-label {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-dot {
  width: 4px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 50%;
}

.sd-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.sd-link-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(241, 245, 249, 0.5);
  backdrop-filter: blur(4px);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.portal-initial {
  width: 18px;
  height: 18px;
  background: white;
  color: var(--primary-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 900;
  border: 1px solid rgba(217, 119, 6, 0.1);
}

.portal-arrow {
  position: absolute;
  right: -10px;
  top: 10px;
  font-size: 0.6rem;
  opacity: 0;
  transition: all 0.3s ease;
  color: var(--primary-color);
}

.sd-link-item:hover {
  background: white;
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.15);
}

.sd-link-item:hover .portal-arrow {
  right: 10px;
  opacity: 1;
}

.sd-link-item:hover .portal-name {
  transform: translateX(-5px);
}

.portal-name {
  transition: all 0.3s ease;
}

.sd-footer-link {
  margin-top: 5px;
}

.sd-main-link {
  display: flex;
  align-items: center;
  width: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--hero-orange));
  color: white !important;
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.25);
  border: none;
}

.sd-main-link:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 30px -5px rgba(217, 119, 6, 0.4);
}

.sdi-icon-bg {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1rem;
}

.topbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-box {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1rem;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}
.search-input {
  width: 100%;
  padding: 14px 56px 14px 48px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: white;
  outline: none;
  transition: var(--transition-smooth);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.12), 0 4px 12px rgba(217, 119, 6, 0.08);
}
.search-input::placeholder {
  color: #94a3b8;
}
.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-smooth);
}
.search-clear:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}
.search-shortcut-badge {
  position: absolute;
  right: 44px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.68rem;
  font-weight: 700;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 2px 8px;
  line-height: 1;
  pointer-events: none;
}

/* ---- Topbar vertical layout ---- */
.topbar-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  min-height: 42px;
}

.result-count {
  display: inline-flex;
  align-items: center;
}

.result-count--skeleton {
  display: inline-block;
  width: 200px;
  height: 1em;
  border-radius: 4px;
  background: linear-gradient(90deg, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.reset-all-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.775rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
  white-space: nowrap;
  flex-shrink: 0;
}
.reset-all-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--bg-accent);
}

/* ---- Filter chips row ---- */
.filter-chips-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.775rem;
  font-weight: 600;
  border-radius: 100px;
  padding: 5px 10px 5px 12px;
  border: 1px solid transparent;
  transition: var(--transition-smooth);
  user-select: none;
}

.filter-chip--search {
  background: var(--bg-accent);
  border-color: var(--border-amber-20);
  color: var(--primary-color);
}

.filter-chip--category {
  background: #fdf4e7;
  border-color: rgba(217, 119, 6, 0.15);
  color: #b45309;
}

.filter-chip--wilayah {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.chip-label {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin-left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  transition: var(--transition-smooth);
  font-size: 0.85rem;
  flex-shrink: 0;
}
.chip-dismiss:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.08);
}

/* ---- Loading spinner inside search box ---- */
.search-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: search-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes search-spin {
  to { transform: rotate(360deg); }
}

.dataset-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dataset-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.dataset-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: var(--primary-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.dataset-item:hover {
  border-color: var(--primary-color);
  background-color: #fffaf0;
  box-shadow: 0 10px 30px -10px rgba(217, 119, 6, 0.15);
  transform: translateY(-2px);
}
.dataset-item:hover::before {
  opacity: 1;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.item-cat-tag,
.item-region-tag,
.item-status-tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.item-cat-tag {
  background: var(--bg-accent);
  color: var(--primary-color);
  border: 1px solid var(--border-amber-20);
}
.item-region-tag {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.item-status-tag.active {
  background: #f0fdf4;
  color: #16a34a;
  padding-left: 8px;
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #16a34a;
  border-radius: 50%;
  margin-right: 6px;
  display: inline-block;
}

.item-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 8px 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}
.dataset-item:hover .item-title {
  color: var(--primary-color);
}

.item-meta-info {
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.meta-data-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.meta-data-item i {
  color: var(--primary-color);
}

.item-action {
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}
.dataset-item:hover .detail-icon {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.detail-label {
  display: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Skeleton Loading */
.skeleton-item {
  pointer-events: none;
  border-color: #f1f5f9 !important;
}
.skeleton-rank,
.skeleton-tag,
.skeleton-title,
.skeleton-text,
.skeleton-action {
  background: #f1f5f9;
  background: linear-gradient(90deg, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-rank {
  height: 20px;
  width: 24px;
}
.skeleton-tags {
  display: flex;
  gap: 8px;
}
.skeleton-tag {
  height: 22px;
  width: 80px;
  border-radius: 100px;
}
.skeleton-title {
  height: 24px;
  width: 60%;
}
.skeleton-text {
  height: 14px;
  width: 100%;
}
.skeleton-action {
  height: 20px;
  width: 80px;
}

@media (max-width: 991px) {
  .hero-v2 {
    padding: 108px 0 60px;
  }
  .hero-v2-title {
    font-size: 2.75rem;
    margin-bottom: 1rem;
  }
  .hero-v2-subtitle {
    font-size: 1rem;
    max-width: 100%;
  }
  .sidebar-wrapper {
    position: static;
    margin-top: 1rem;
  }
  .sidebar-card {
    border-radius: 16px;
  }
  .dataset-item {
    padding: 1.25rem;
    border-radius: 16px;
    margin-bottom: 1rem;
  }
}

  @media (max-width: 768px) {
    .dataset-item {
      padding: 16px;
      gap: 12px;
    }
    .item-title {
      font-size: 0.95rem;
    }
    .item-meta-info {
      flex-wrap: wrap;
      gap: 8px 16px;
    }
    .item-action {
      display: none;
    }
    .hero-meta-card {
      padding: 1rem 1.5rem;
      gap: 1rem;
      width: 100%;
      justify-content: space-around;
    }
    .hm-num {
      font-size: 1.75rem;
    }
  }

@media (max-width: 480px) {
  .hero-v2-title {
    font-size: 2rem;
  }
  .search-box {
    border-radius: 12px;
  }
  .search-input {
    font-size: 0.95rem;
    padding: 12px 1rem 12px 2.75rem;
  }
  .item-content {
    width: 100%;
  }
  .item-notes {
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    max-width: 100%;
    white-space: normal;
  }
}
</style>
