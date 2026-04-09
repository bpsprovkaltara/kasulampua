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
                <i class="bi bi-search search-icon"></i>
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
          </div>
        </div>

        <div class="col-lg-9 order-2 order-lg-2">
          <div class="topbar mb-4">
            <div class="d-none d-lg-block">
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
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
                <span v-if="!search" class="search-shortcut-badge">/</span>
              </div>
            </div>
            <div class="result-info d-flex align-items-center">
              <span class="result-count me-auto" v-if="!loading">
                <i class="bi bi-database-fill text-amber me-2"></i>
                Menampilkan <strong>{{ datasets.length }}</strong> dari <strong>{{ total }}</strong> dataset
              </span>
            </div>
          </div>
          <div v-if="search && !loading" class="search-state mb-3">
            <i class="bi bi-search me-2"></i>
            Menampilkan hasil untuk: <strong>"{{ search }}"</strong>
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
            <div v-else-if="!datasets.length" class="empty-card" key="empty">
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
                v-for="(dataset, index) in datasets"
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
import { ckanOrgToWilayahLabel } from '@/utils/ckanOrganizationWilayah.js'
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

const datasets = ref([])
const total = ref(0)
const loading = ref(true)
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

/** Baca route.query ke state lokal (setelah metadata store siap). */
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

const totalPages = computed(() => Math.ceil(total.value / limit))

const toggleCategory = () => (categoryExpanded.value = !categoryExpanded.value)
const toggleWilayah = () => (wilayahExpanded.value = !wilayahExpanded.value)

const stripHtml = (html) => {
  if (!html) return ''
  
  let text = html.replace(/<[^>]*>/g, '')
 
  text = text.replace(/[*_~#`>+\\-]+/g, ' ')
  
  text = text.replace(/\s+/g, ' ').trim()
  return text.substring(0, 200)
}

const fetchDatasets = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('rows', limit)
    params.set('start', (currentPage.value - 1) * limit)

    // Build Solr query
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
      if (data && data.error) {
        console.error('CKAN package_search error:', data.error)
      }
      datasets.value = []
      total.value = 0
    }
  } catch (err) {
    console.error('Gagal memuat dataset:', err)
    datasets.value = []
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

const resetFilters = () => {
  router.replace({ path: '/dataset', query: {} })
}

watch(
  () => route.query,
  async () => {
    readRouteIntoState()
    await fetchDatasets()
  },
  { deep: true }
)

onMounted(async () => {
  await store.fetchAllData()
  readRouteIntoState()
  await fetchDatasets()
  window.addEventListener('keydown', handleGlobalSearchShortcut)
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

.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.topbar > div:first-child {
  flex: 1;
  min-width: 240px;
}
.result-info {
  flex-shrink: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: white;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  flex: 1;
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
}
.search-input {
  width: 100%;
  padding: 12px 56px 12px 48px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: white;
  outline: none;
  transition: var(--transition-smooth);
}
.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
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

.search-state {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  background: #fffaf0;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
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
    padding: 100px 0 60px;
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
  .topbar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .result-info {
    justify-content: space-between;
    width: 100%;
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
    padding: 0.75rem 1rem 0.75rem 2.75rem;
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
