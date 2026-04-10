<template>
  <div class="publikasi-grid-wrap">
    <div class="publikasi-filters mb-4">
      <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
        <span class="filter-label text-muted small text-uppercase fw-bold">Provinsi</span>
      </div>
      <div class="domain-pills d-flex flex-wrap gap-2">
        <button
          type="button"
          class="domain-pill"
          :class="{ active: selectedDomain === null }"
          @click="selectDomain(null)"
        >
          Semua
        </button>
        <button
          v-for="opt in domainOptions"
          :key="opt.domain_id"
          type="button"
          class="domain-pill"
          :class="{ active: selectedDomain === opt.domain_id }"
          @click="selectDomain(opt.domain_id)"
        >
          {{ opt.label }}
        </button>
      </div>

      <div class="row g-2 align-items-center mt-3">
        <div class="col-auto">
          <label for="pub-year" class="form-label small text-muted mb-0 me-2">Tahun rilis</label>
        </div>
        <div class="col-auto">
          <select
            id="pub-year"
            class="form-select form-select-sm pub-year-select"
            v-model="selectedYear"
            @change="onYearChange"
          >
            <option value="">Semua tahun</option>
            <option v-for="y in yearOptions" :key="y" :value="String(y)">{{ y }}</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="!loading && !errorMsg" class="result-line text-muted small mb-3">
      <i class="bi bi-journal-text text-amber me-1"></i>
      Menampilkan <strong>{{ items.length }}</strong> dari <strong>{{ total }}</strong> publikasi
    </div>
    <div v-if="errorMsg" class="alert alert-warning" role="alert">{{ errorMsg }}</div>

    <transition name="fade" mode="out-in">
      <div v-if="loading" class="row g-4" key="skel">
        <div v-for="i in 9" :key="i" class="col-12 col-md-6 col-lg-4">
          <div class="pub-card pub-card--skeleton">
            <div class="pub-cover skeleton-block"></div>
            <div class="pub-body">
              <div class="skeleton-line mb-2"></div>
              <div class="skeleton-line w-75"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!items.length" class="empty-card text-center py-5" key="empty">
        <i class="bi bi-inbox empty-icon"></i>
        <h5 class="fw-bold mt-3 mb-1">Tidak ada publikasi</h5>
        <p class="text-muted small mb-0">Coba ubah filter provinsi atau tahun.</p>
      </div>
      <div v-else class="row g-4" key="list">
        <div v-for="pub in items" :key="pub.pub_id" class="col-12 col-md-6 col-lg-4">
          <router-link
            class="pub-card text-decoration-none"
            :to="{
              name: 'publikasi-detail',
              params: { id: pub.pub_id },
              query: { domain_id: pub.domain_id, from: $route.fullPath },
            }"
          >
            <div class="pub-cover-wrap">
              <img
                v-if="!imageError[pub.pub_id]"
                class="pub-cover"
                :src="coverUrl(pub)"
                :alt="`Sampul ${pub.title}`"
                loading="lazy"
                @error="onImgError(pub.pub_id)"
              />
              <div v-else class="pub-cover pub-cover--placeholder d-flex align-items-center justify-content-center">
                <i class="bi bi-image text-muted fs-2"></i>
              </div>
            </div>
            <div class="pub-body">
              <div class="pub-tags mb-2" v-if="pub.subject_csa && pub.subject_csa.length">
                <span v-for="(s, idx) in pub.subject_csa.slice(0, 2)" :key="idx" class="pub-tag">{{
                  s
                }}</span>
              </div>
              <h6 class="pub-title">{{ pub.title }}</h6>
              <div class="pub-meta text-muted small">
                <span v-if="pub.rl_date"><i class="bi bi-calendar3 me-1"></i>{{ formatRl(pub.rl_date) }}</span>
                <span v-if="pub.size" class="ms-2"><i class="bi bi-hdd me-1"></i>{{ pub.size }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </transition>

    <PaginationControl
      v-if="totalPages > 1 && !loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      @change="goToPage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { PUBLICATION_DOMAIN_OPTIONS } from '@/utils/kasulampuaPublicationDomains.js'
import { formatLongDate } from '@/utils/dates'
import PaginationControl from './PaginationControl.vue'

const domainOptions = PUBLICATION_DOMAIN_OPTIONS
const perPage = 12

const selectedDomain = ref(null)
const selectedYear = ref('')
const currentPage = ref(1)
const items = ref([])
const total = ref(0)
const pages = ref(1)
const loading = ref(true)
const errorMsg = ref('')
const imageError = ref({})

const yearOptions = computed(() => {
  const y = new Date().getFullYear()
  const out = []
  for (let i = y + 1; i >= 2015; i--) out.push(i)
  return out
})

const totalPages = computed(() => Math.max(1, pages.value || 1))

function coverUrl(pub) {
  return DATAHUB_ENDPOINTS.PUBLICATION_COVER(pub.pub_id)
}

function formatRl(d) {
  return formatLongDate(d)
}

function onImgError(pubId) {
  imageError.value = { ...imageError.value, [pubId]: true }
}

function selectDomain(id) {
  selectedDomain.value = id
  currentPage.value = 1
  imageError.value = {}
  fetchList()
}

function onYearChange() {
  currentPage.value = 1
  imageError.value = {}
  fetchList()
}

function goToPage(p) {
  currentPage.value = p
  imageError.value = {}
  fetchList()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function fetchList() {
  loading.value = true
  errorMsg.value = ''
  try {
    const params = new URLSearchParams()
    params.set('page', String(currentPage.value))
    params.set('per_page', String(perPage))
    if (selectedDomain.value) params.set('domain_id', selectedDomain.value)
    if (selectedYear.value && selectedYear.value !== '') params.set('year', selectedYear.value)

    const url = `${DATAHUB_ENDPOINTS.PUBLICATIONS}?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    items.value = Array.isArray(data.data) ? data.data : []
    total.value = typeof data.total === 'number' ? data.total : items.value.length
    pages.value = typeof data.pages === 'number' ? data.pages : 1
  } catch (e) {
    console.error('Gagal memuat publikasi:', e)
    items.value = []
    total.value = 0
    pages.value = 1
    errorMsg.value = 'Gagal memuat daftar publikasi. Periksa koneksi atau coba lagi nanti.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.publikasi-grid-wrap {
  min-height: 200px;
}

.filter-label {
  letter-spacing: 0.06em;
}

.domain-pill {
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.domain-pill:hover {
  border-color: var(--amber, #d4a574);
  color: var(--text-primary);
}

.domain-pill.active {
  background: linear-gradient(135deg, var(--amber, #c9a227), #b8860b);
  border-color: transparent;
  color: #fff;
}

.pub-year-select {
  min-width: 140px;
  border-radius: 10px;
}

.pub-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: var(--border-radius, 12px);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.pub-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.pub-cover-wrap {
  aspect-ratio: 3 / 4;
  background: var(--bg-accent-light, #f8f9fa);
  overflow: hidden;
}

.pub-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pub-cover--placeholder {
  background: linear-gradient(145deg, #eee, #f5f5f5);
}

.pub-body {
  padding: 1rem 1rem 1.15rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pub-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.pub-tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
  background: var(--bg-accent-light);
  color: var(--text-secondary);
}

.pub-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.pub-meta {
  margin-top: auto;
}

.pub-card--skeleton .skeleton-block {
  height: 100%;
  min-height: 200px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

.pub-card--skeleton .skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: #eee;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.empty-icon {
  font-size: 3rem;
  color: var(--border-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
