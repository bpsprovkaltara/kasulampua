<template>
  <Navbar />

  <section class="py-5 container mt-5 mt-md-0">
    <PageHeader :title_detil="titleDetail" />

    <div v-if="loading" class="row g-4">
      <div class="col-md-4">
        <div class="detail-cover-skeleton rounded-3"></div>
      </div>
      <div class="col-md-8">
        <div class="skeleton-title mb-3"></div>
        <div class="skeleton-line mb-2" v-for="n in 6" :key="n"></div>
      </div>
    </div>

    <div v-else-if="errorMsg" class="alert alert-danger" role="alert">{{ errorMsg }}</div>

    <div v-else-if="detail" class="row g-4 align-items-start publikasi-detail">
      <div class="col-md-4">
        <div class="detail-cover-card rounded-3 overflow-hidden border bg-white shadow-sm">
          <div class="cover-aspect bg-light">
            <img
              v-if="!coverFailed"
              :src="coverSrc"
              class="cover-img"
              :alt="`Sampul ${detail.title}`"
              loading="eager"
              @error="coverFailed = true"
            />
            <div
              v-else
              class="d-flex align-items-center justify-content-center cover-placeholder text-muted"
            >
              <i class="bi bi-image fs-1"></i>
            </div>
          </div>
        </div>
        <ul class="list-unstyled small text-muted mt-3 mb-0 pub-meta-list">
          <li v-if="detail.issn && detail.issn !== '-'">
            <strong>ISSN</strong> {{ detail.issn }}
          </li>
          <li v-if="detail.size"><strong>Ukuran</strong> {{ detail.size }}</li>
          <li v-if="detail.rl_date">
            <strong>Rilis</strong> {{ formatLongDate(detail.rl_date) }}
          </li>
        </ul>
      </div>

      <div class="col-md-8">
        <h1 class="h4 fw-bold mb-3">{{ detail.title }}</h1>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <span class="badge rounded-pill bg-amber-soft text-dark" v-if="wilayahLabel">{{
            wilayahLabel
          }}</span>
          <span
            v-for="(s, idx) in detail.subject_csa || []"
            :key="idx"
            class="badge rounded-pill bg-light text-dark border"
            >{{ s }}</span
          >
          <span v-if="releaseYear" class="badge rounded-pill bg-secondary">{{ releaseYear }}</span>
        </div>

        <div class="abstract-block mb-4">
          <h2 class="h6 text-uppercase text-muted fw-bold letter-spacing mb-2">Abstrak</h2>
          <p class="abstract-text mb-0">{{ abstractPlain }}</p>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <a
            class="btn btn-amber rounded-pill px-4"
            :href="pdfHref"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="bi bi-download me-2" aria-hidden="true"></i>
            Unduh PDF
          </a>
          <a
            class="btn btn-outline-dark rounded-pill px-4"
            :href="pdfHref"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="bi bi-eye me-2" aria-hidden="true"></i>
            Baca online
          </a>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../components/BreadcSection.vue'
import Footer from '../components/FooterSection.vue'
import Navbar from '../components/NavSection.vue'
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { publicationDomainLabel } from '@/utils/kasulampuaPublicationDomains.js'
import { formatLongDate } from '@/utils/dates'
import { useMeta } from '@/composables/useMeta'

const route = useRoute()
const { updateMeta } = useMeta()

const detail = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const coverFailed = ref(false)

const pubId = computed(() => String(route.params.id || ''))
const domainIdQ = computed(() => {
  const d = route.query.domain_id
  if (d == null || d === '') return ''
  return Array.isArray(d) ? String(d[0]) : String(d)
})

const listBackPath = computed(() => {
  const from = route.query.from
  if (typeof from === 'string' && from.trim().length > 0) return from
  return '/publication'
})

const titleDetail = computed(() => ({
  title: detail.value?.title || 'Publikasi',
  parent: [{ label: 'Publikasi', path: listBackPath.value }],
}))

const coverSrc = computed(() => DATAHUB_ENDPOINTS.PUBLICATION_COVER(pubId.value))

const pdfHref = computed(() => DATAHUB_ENDPOINTS.PUBLICATION_PDF(pubId.value))

const wilayahLabel = computed(() =>
  detail.value?.domain_id ? publicationDomainLabel(detail.value.domain_id) : ''
)

const releaseYear = computed(() => {
  const d = detail.value?.rl_date
  if (!d) return ''
  const y = new Date(d).getFullYear()
  return Number.isFinite(y) ? String(y) : ''
})

function decodeHtmlEntities(str) {
  if (!str) return ''
  if (typeof document === 'undefined') return str
  const t = document.createElement('textarea')
  t.innerHTML = str
  return t.value
}

const abstractPlain = computed(() => {
  const raw = detail.value?.abstract
  if (!raw) return 'Tidak ada abstrak untuk publikasi ini.'
  const decoded = decodeHtmlEntities(raw)
  return decoded.replace(/\s+/g, ' ').trim()
})

async function fetchDetail() {
  loading.value = true
  errorMsg.value = ''
  detail.value = null
  coverFailed.value = false
  try {
    const params = new URLSearchParams()
    if (domainIdQ.value) params.set('domain_id', domainIdQ.value)
    const q = params.toString()
    const url = `${DATAHUB_ENDPOINTS.PUBLICATION_DETAIL(pubId.value)}${q ? `?${q}` : ''}`
    const res = await fetch(url)
    if (res.status === 404) {
      errorMsg.value = 'Publikasi tidak ditemukan.'
      return
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    detail.value = data
  } catch (e) {
    console.error(e)
    errorMsg.value = 'Gagal memuat detail publikasi.'
  } finally {
    loading.value = false
  }
}

watch(
  () => [route.params.id, route.query.domain_id],
  () => {
    fetchDetail()
  },
  { immediate: true }
)

watch(
  detail,
  (d) => {
    if (d?.title) {
      const desc = decodeHtmlEntities(d.abstract || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160)
      updateMeta({
        title: d.title,
        description: desc || d.title,
      })
    }
  },
  { deep: true }
)
</script>

<style scoped>
.bg-amber-soft {
  background: rgba(201, 162, 39, 0.15) !important;
}

.detail-cover-skeleton {
  min-height: 320px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

.skeleton-title {
  height: 28px;
  max-width: 80%;
  border-radius: 8px;
  background: #eee;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: #eee;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.abstract-text {
  white-space: pre-wrap;
  line-height: 1.65;
  color: var(--text-primary);
}

.pub-meta-list li {
  margin-bottom: 0.35rem;
}

.btn-amber {
  background: linear-gradient(135deg, var(--amber, #c9a227), #b8860b);
  border: none;
  color: #fff;
  font-weight: 600;
}

.btn-amber:hover {
  filter: brightness(1.05);
  color: #fff;
}

.letter-spacing {
  letter-spacing: 0.06em;
}

.cover-aspect {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
}

.cover-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  position: absolute;
  inset: 0;
}
</style>
