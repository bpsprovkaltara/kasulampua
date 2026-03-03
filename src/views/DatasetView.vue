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

        <div class="col-lg-4 d-none d-lg-flex justify-content-end">
          <div class="hero-meta-card">
            <div class="hero-meta-item">
              <span class="hm-num">{{ allDatasets.length }}</span>
              <span class="hm-label">Dataset</span>
            </div>
            <div class="hm-divider"></div>
            <div class="hero-meta-item">
              <span class="hm-num">{{ categories.length }}</span>
              <span class="hm-label">Kategori</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="dataset-content py-5">
    <div class="container-xl">
      <div class="row g-4">
        <div class="col-lg-3 order-2 order-lg-1">
          <div class="sidebar-wrapper">
            <!-- Search (mobile) -->
            <div class="d-lg-none mb-3">
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input
                  class="search-input"
                  type="text"
                  v-model="search"
                  @input="applySearch"
                  placeholder="Cari dataset..."
                />
              </div>
            </div>

            <div class="sidebar-card mb-3">
              <div class="sidebar-card-header">
                <i class="bi bi-grid-3x3-gap-fill text-amber me-2"></i>
                <span>Kategori</span>
              </div>
              <div class="sidebar-card-body">
                <button
                  class="sidebar-item"
                  :class="{ active: selectedCategory === null }"
                  @click="selectCategory(null)"
                >
                  <span class="si-icon"><i class="bi bi-archive-fill"></i></span>
                  <span class="si-label">Semua Kategori</span>
                  <span class="si-badge">{{ allDatasets.length }}</span>
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
                  <span class="si-badge">{{ countByCategory(cat.id) }}</span>
                </button>
              </div>
            </div>

            <div class="sidebar-card">
              <div class="sidebar-card-header">
                <i class="bi bi-geo-alt-fill text-amber me-2"></i>
                <span>Wilayah</span>
              </div>
              <div class="sidebar-card-body">
                <button
                  class="sidebar-item"
                  :class="{ active: selectedRegion === null }"
                  @click="selectRegion(null)"
                >
                  <span class="si-icon"><i class="bi bi-globe2"></i></span>
                  <span class="si-label">Semua Wilayah</span>
                </button>
                <button
                  v-for="reg in regions"
                  :key="reg.id"
                  class="sidebar-item"
                  :class="{ active: selectedRegion === reg.id }"
                  @click="selectRegion(reg.id)"
                >
                  <span class="si-icon"><i class="bi bi-pin-map-fill"></i></span>
                  <span class="si-label">{{ reg.name }}</span>
                  <span class="si-badge">{{ countByRegion(reg.id) }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9 order-1 order-lg-2">
          <div class="topbar mb-4">
            <div class="d-none d-lg-block">
              <div class="search-box">
                <i class="bi bi-search search-icon"></i>
                <input
                  class="search-input"
                  type="text"
                  v-model="search"
                  @input="applySearch"
                  placeholder="Cari judul dataset..."
                />
                <button
                  v-if="search"
                  class="search-clear"
                  @click="
                    search = ''
                    applySearch()
                  "
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
            <div class="result-info">
              <span class="result-count" v-if="!loading">
                <i class="bi bi-database-fill text-amber me-2"></i>
                Menampilkan <strong>{{ paginatedDatasets.length }}</strong> dari
                <strong>{{ filteredDatasets.length }}</strong> dataset
              </span>
            </div>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="ds-loading-spinner mx-auto mb-3"></div>
            <p class="text-muted small">Memuat dataset...</p>
          </div>
          <div v-else-if="!filteredDatasets.length" class="empty-card">
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

          <div v-else class="dataset-list">
            <div
              v-for="(dataset, index) in paginatedDatasets"
              :key="dataset.id || index"
              class="dataset-item"
            >
              <div class="item-rank">{{ (currentPage - 1) * limit + index + 1 }}</div>

              <div class="item-content flex-grow-1 min-w-0">
                <div class="item-tags mb-1">
                  <span class="item-cat-tag">
                    <i :class="getCategoryIcon(getCategoryName(dataset.category))" class="me-1"></i>
                    {{ getCategoryName(dataset.category) }}
                  </span>
                  <span class="item-region-tag" v-if="getRegionName(dataset.region)">
                    <i class="bi bi-geo-alt me-1"></i>
                    {{ getRegionName(dataset.region) }}
                  </span>
                  <span class="item-year-tag" v-if="dataset.year">{{ dataset.year }}</span>
                  <span
                    class="item-status-tag"
                    :class="dataset.status === 'active' ? 'active' : 'inactive'"
                  >
                    {{ dataset.status === 'active' ? '● Aktif' : '○ Tidak Aktif' }}
                  </span>
                </div>
                <h6 class="item-title">{{ dataset.title }}</h6>
                <p class="item-notes" v-if="dataset.notes">{{ dataset.notes }}</p>
              </div>

              <div class="item-action flex-shrink-0">
                <router-link
                  :to="{ path: `/dataset/${dataset.id}`, query: { from: $route.fullPath } }"
                  class="detail-btn"
                >
                  <i class="bi bi-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </div>

          <div class="pagination-bar mt-4" v-if="totalPages > 1">
            <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            <div class="page-numbers">
              <button
                v-for="p in visiblePages"
                :key="p"
                class="page-num"
                :class="{ active: p === currentPage, ellipsis: p === '...' }"
                :disabled="p === '...'"
                @click="p !== '...' && goToPage(p)"
              >
                {{ p }}
              </button>
            </div>
            <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import { API_ENDPOINTS } from '@/config/api'

const route = useRoute()
const allDatasets = ref([])
const categories = ref([])
const regions = ref([])
const search = ref('')
const selectedCategory = ref(null)
const selectedRegion = ref(null)
const loading = ref(true)
const currentPage = ref(1)
const limit = 12

const filteredDatasets = computed(() => {
  let result = allDatasets.value
  if (selectedCategory.value !== null)
    result = result.filter((d) => d.category === selectedCategory.value)
  if (selectedRegion.value !== null)
    result = result.filter((d) => d.region === selectedRegion.value)
  if (search.value.trim())
    result = result.filter((d) => d.title.toLowerCase().includes(search.value.toLowerCase()))
  return result
})

const totalPages = computed(() => Math.ceil(filteredDatasets.value.length / limit))
const paginatedDatasets = computed(() =>
  filteredDatasets.value.slice((currentPage.value - 1) * limit, currentPage.value * limit),
)

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  if (cur > 3) {
    pages.push(1)
    if (cur > 4) pages.push('...')
  }
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.push(i)
  if (cur < total - 3) {
    if (cur < total - 3) pages.push('...')
    pages.push(total)
  }
  return pages
})

const getCategoryName = (id) => categories.value.find((c) => c.id === id)?.name || '-'
const getRegionName = (id) => regions.value.find((r) => r.id === id)?.name || '-'
const countByCategory = (id) => allDatasets.value.filter((d) => d.category === id).length
const countByRegion = (id) => allDatasets.value.filter((d) => d.region === id).length

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
  selectedCategory.value = id
  currentPage.value = 1
}
const selectRegion = (id) => {
  selectedRegion.value = id
  currentPage.value = 1
}
const applySearch = () => {
  currentPage.value = 1
}
const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}
const resetFilters = () => {
  selectedCategory.value = null
  selectedRegion.value = null
  search.value = ''
  currentPage.value = 1
}

const fetchData = async () => {
  loading.value = true
  try {
    const [dsRes, catRes, regRes] = await Promise.all([
      fetch(API_ENDPOINTS.DATASET),
      fetch(API_ENDPOINTS.DATASET_KATEGORI),
      fetch(API_ENDPOINTS.DATASET_REGION),
    ])
    allDatasets.value = (await dsRes.json()) || []
    categories.value = (await catRes.json()) || []
    regions.value = (await regRes.json()) || []
  } catch (err) {
    console.error('Gagal memuat dataset:', err)
  }
  loading.value = false
}

onMounted(fetchData)
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
}
.sidebar-card-body {
  padding: 10px;
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
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
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
  padding: 12px 48px 12px 48px;
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
  border-radius: var(--border-radius);
  padding: 20px 24px;
  transition: var(--transition-smooth);
  cursor: default;
}
.dataset-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.item-rank {
  font-size: 0.8125rem;
  font-weight: 800;
  color: var(--border-color);
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}

.item-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.item-cat-tag,
.item-region-tag,
.item-year-tag,
.item-status-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
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
.item-year-tag {
  background: var(--bg-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}
.item-status-tag.active {
  background: #f0fdf4;
  color: #16a34a;
}
.item-status-tag.inactive {
  background: #fef2f2;
  color: #dc2626;
}

.item-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 6px 0 4px;
  line-height: 1.4;
}
.dataset-item:hover .item-title {
  color: var(--primary-color);
}
.item-notes {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}

.detail-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.25rem;
  transition: var(--transition-smooth);
  flex-shrink: 0;
}
.dataset-item:hover .detail-btn {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--bg-accent-light);
}
.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.page-numbers {
  display: flex;
  gap: 6px;
}
.page-num {
  min-width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 700;
  transition: var(--transition-smooth);
  padding: 0 12px;
}
.page-num:hover:not(.ellipsis) {
  background: var(--bg-accent-light);
  border-color: var(--border-amber-20);
  color: var(--primary-color);
}
.page-num.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}
.page-num.ellipsis {
  cursor: default;
}

.ds-loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--secondary-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-card {
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  padding: 5rem 2rem;
  text-align: center;
}
.empty-icon {
  font-size: 4rem;
  color: var(--primary-color);
  opacity: 0.2;
}

@media (max-width: 992px) {
  .hero-title {
    font-size: clamp(2rem, 8vw, 2.5rem);
  }
  .dataset-item {
    padding: 16px 20px;
  }
  .item-notes {
    display: none;
  }
  .topbar {
    gap: 12px;
  }
  .hero-meta-card {
    padding: 1.25rem 2rem;
    gap: 1.5rem;
  }
  .hm-num {
    font-size: 2rem;
  }
}
</style>
