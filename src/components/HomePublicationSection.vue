<template>
  <section class="home-publication-section py-5">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
        <div class="section-label">PUBLIKASI</div>
        <div class="flex-grow-1 section-line d-none d-sm-block"></div>
        <router-link
          to="/publication"
          class="btn btn-sm btn-outline-amber rounded-pill px-3 py-2 text-nowrap"
        >
          Lihat katalog publikasi
          <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
        </router-link>
      </div>
      <p class="section-subtitle text-muted mb-4 mb-lg-5">
        Katalog publikasi statistik dari provinsi di wilayah Kalimantan, Sulawesi, Maluku, dan Papua.
      </p>

      <div v-if="errorMsg" class="alert alert-warning mb-4" role="alert">{{ errorMsg }}</div>

      <div v-if="loading" class="row g-4">
        <div v-for="i in 4" :key="i" class="col-12 col-sm-6 col-lg-3">
          <div class="pub-card pub-card--skeleton">
            <div class="pub-cover skeleton-block"></div>
            <div class="pub-body">
              <div class="skeleton-line mb-2"></div>
              <div class="skeleton-line w-75"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!items.length" class="empty-hint text-center py-4 rounded-3 border">
        <i class="bi bi-journal-text text-muted fs-1 d-block mb-2"></i>
        <p class="text-muted small mb-3">Belum ada publikasi untuk ditampilkan di beranda.</p>
        <router-link to="/publication" class="btn btn-premium-cta btn-premium-cta-outline btn-sm rounded-pill px-4">
          Buka katalog publikasi
        </router-link>
      </div>

      <div v-else class="row g-4">
        <div v-for="pub in items" :key="pub.pub_id" class="col-12 col-sm-6 col-lg-3">
          <router-link
            class="pub-card text-decoration-none"
            :to="{
              name: 'publikasi-detail',
              params: { id: pub.pub_id },
              query: { domain_id: pub.domain_id, from: route.fullPath },
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
              <div
                v-else
                class="pub-cover pub-cover--placeholder d-flex align-items-center justify-content-center"
              >
                <i class="bi bi-image text-muted fs-2"></i>
              </div>
            </div>
            <div class="pub-body">
              <div class="pub-tags mb-2" v-if="domainLabel(pub.domain_id)">
                <span class="pub-tag">{{ domainLabel(pub.domain_id) }}</span>
              </div>
              <h3 class="pub-title">{{ pub.title }}</h3>
              <div class="pub-meta text-muted small">
                <span v-if="pub.rl_date">
                  <i class="bi bi-calendar3 me-1" aria-hidden="true"></i>{{ formatRl(pub.rl_date) }}
                </span>
                <span v-if="pub.size" class="ms-2">
                  <i class="bi bi-hdd me-1" aria-hidden="true"></i>{{ pub.size }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { publicationDomainLabel } from '@/utils/kasulampuaPublicationDomains.js'
import { formatLongDate } from '@/utils/dates'

const route = useRoute()
const perPage = 4
const items = ref([])
const loading = ref(true)
const errorMsg = ref('')
const imageError = ref({})

function coverUrl(pub) {
  return DATAHUB_ENDPOINTS.PUBLICATION_COVER(pub.pub_id)
}

function domainLabel(domainId) {
  return publicationDomainLabel(domainId)
}

function formatRl(d) {
  return formatLongDate(d)
}

function onImgError(pubId) {
  imageError.value = { ...imageError.value, [pubId]: true }
}

async function fetchFeatured() {
  loading.value = true
  errorMsg.value = ''
  try {
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('per_page', String(perPage))
    const url = `${DATAHUB_ENDPOINTS.PUBLICATIONS}?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    items.value = Array.isArray(data.data) ? data.data : []
  } catch (e) {
    console.error('Gagal memuat publikasi beranda:', e)
    items.value = []
    errorMsg.value = 'Gagal memuat publikasi. Silakan buka katalog atau coba lagi nanti.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeatured()
})
</script>

<style scoped>
.home-publication-section {
  background: white;
  padding-top: 4rem !important;
  padding-bottom: 4rem !important;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--primary-color);
  background: rgba(217, 119, 6, 0.08);
  border: 1px solid var(--border-amber-20);
  padding: 6px 16px;
  border-radius: 100px;
}

.section-line {
  height: 1px;
  background: linear-gradient(to right, var(--border-color), transparent);
}

.section-subtitle {
  font-size: 0.9375rem;
  line-height: 1.55;
  max-width: 48rem;
}

.btn-outline-amber {
  color: var(--primary-color);
  border: 1.5px solid var(--primary-color);
  background: transparent;
  transition: var(--transition-smooth);
}

.btn-outline-amber:hover {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
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
  min-height: 160px;
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

.empty-hint {
  border-color: var(--border-color) !important;
  background: var(--bg-accent-light, #f8f9fa);
}
</style>
