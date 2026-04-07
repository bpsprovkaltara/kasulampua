<template>
  <div v-if="dataset" class="dataset-detail-card mb-5">
    <div class="detail-header mb-5">
      <h1 class="detail-title mb-3">{{ dataset.title }}</h1>
      <div
        v-if="dataset.notes"
        class="detail-notes markdown-notes"
        v-html="notesHtml"
      />
    </div>

    <div class="info-section mb-5">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Informasi Umum</h5>
      </div>

      <div class="info-grid">
        <div class="info-row">
          <div class="info-label text-truncate"><i class="bi bi-building me-2"></i>Organisasi</div>
          <div class="info-value">{{ valOrDash(dataset.organization?.title || dataset.organization?.name) }}</div>
        </div>

        <div class="info-row">
          <div class="info-label text-truncate"><i class="bi bi-bookmark-star me-2"></i>Subjek</div>
          <div class="info-value">
            <template v-if="dataset.groups && dataset.groups.length">
              <span
                v-for="group in dataset.groups"
                :key="group.name"
                class="info-badge-amber me-2 mb-1"
              >
                {{ group.display_name || group.title }}
              </span>
            </template>
            <template v-else>-</template>
          </div>
        </div>

        <div class="info-row">
          <div class="info-label text-truncate"><i class="bi bi-shield-check me-2"></i>Lisensi</div>
          <div class="info-value">{{ valOrDash(dataset.license_title) }}</div>
        </div>

        <div class="info-row">
          <div class="info-label text-truncate"><i class="bi bi-calendar-plus me-2"></i>Dibuat</div>
          <div class="info-value">{{ formatLongDate(dataset.metadata_created) }}</div>
        </div>

        <div class="info-row">
          <div class="info-label text-truncate"><i class="bi bi-calendar-event me-2"></i>Diperbarui</div>
          <div class="info-value">{{ formatLongDate(dataset.metadata_modified) }}</div>
        </div>

        <div class="info-row">
          <div class="info-label text-truncate"><i class="bi bi-tags me-2"></i>Tag</div>
          <div class="info-value">
            <template v-if="dataset.tags && dataset.tags.length">
              <span
                v-for="tag in dataset.tags"
                :key="tag.name"
                class="tag-badge me-2 mb-1"
              >
                {{ tag.display_name || tag.name }}
              </span>
            </template>
            <template v-else>-</template>
          </div>
        </div>

        <div class="info-row">
          <div class="info-label text-truncate"><i class="bi bi-files me-2"></i>Jumlah Resource</div>
          <div class="info-value fw-bold">
            {{ dataset.num_resources || (dataset.resources && dataset.resources.length) || 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <template v-if="dataset">
    <div class="data-section mb-5" v-if="dataset.resources && dataset.resources.length">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Data</h5>
      </div>

      <JsonDatasetInsightPanel v-if="jsonResource" :resource="jsonResource" />

      <div v-else class="empty-data-hint">
        <i class="bi bi-filetype-json" style="font-size: 2rem; color: var(--text-secondary); opacity: 0.35;"></i>
        <p class="text-muted small mt-2 mb-0">
          Dataset ini tidak memiliki resource <strong>JSON</strong> untuk pratinjau tabel dan grafik.
        </p>
      </div>
    </div>

    <div v-else class="data-section mb-5">
      <div class="empty-resource-card">
        <i class="bi bi-folder2-open" style="font-size: 2rem; color: var(--text-secondary); opacity: 0.3;"></i>
        <p class="text-muted small mt-2 mb-0">Dataset ini belum memiliki resource.</p>
      </div>
    </div>
  </template>

  <div v-else-if="notFound" class="text-center py-5">
    <i class="bi bi-database-slash" style="font-size: 3rem; color: var(--text-secondary);"></i>
    <h5 class="mt-3 fw-bold">Dataset Tidak Ditemukan</h5>
    <p class="text-muted small">Dataset yang Anda cari tidak tersedia atau telah dihapus.</p>
    <router-link to="/dataset" class="btn btn-outline-secondary btn-sm rounded-pill mt-2">
      Kembali ke Daftar Dataset
    </router-link>
  </div>

  <div v-else class="text-center py-5">
    <div class="ds-loading-spinner mx-auto mb-3"></div>
    <p class="text-muted small">Memuat data dataset...</p>
  </div>
</template>

<style scoped>
.dataset-detail-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.detail-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
}

.detail-notes {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  letter-spacing: 0.01em;
}

.detail-notes.markdown-notes :deep(p) {
  margin-bottom: 1rem;
}

.detail-notes.markdown-notes :deep(strong) {
  color: var(--text-primary);
  font-weight: 700;
  margin-right: 4px;
}

.detail-notes.markdown-notes :deep(br) {
  content: "";
  display: block;
  margin-top: 0.5rem;
}

.detail-notes.markdown-notes :deep(p:last-child) {
  margin-bottom: 0;
}

.detail-notes.markdown-notes :deep(ul),
.detail-notes.markdown-notes :deep(ol) {
  margin: 0.5rem 0 0.75rem;
  padding-left: 1.35rem;
}

.detail-notes.markdown-notes :deep(li) {
  margin-bottom: 0.35rem;
}

.detail-notes.markdown-notes :deep(h1),
.detail-notes.markdown-notes :deep(h2),
.detail-notes.markdown-notes :deep(h3),
.detail-notes.markdown-notes :deep(h4) {
  margin: 1rem 0 0.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
}

.detail-notes.markdown-notes :deep(h1) {
  font-size: 1.35rem;
}

.detail-notes.markdown-notes :deep(h2) {
  font-size: 1.2rem;
}

.detail-notes.markdown-notes :deep(h3) {
  font-size: 1.1rem;
}

.detail-notes.markdown-notes :deep(a) {
  color: var(--primary-color);
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-word;
}

.detail-notes.markdown-notes :deep(blockquote) {
  margin: 0.75rem 0;
  padding: 0.5rem 0 0.5rem 1rem;
  border-left: 3px solid var(--border-color);
  color: var(--text-secondary);
}

.detail-notes.markdown-notes :deep(pre) {
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  overflow-x: auto;
  font-size: 0.9em;
}

.detail-notes.markdown-notes :deep(code) {
  font-size: 0.92em;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  background: var(--bg-color);
}

.detail-notes.markdown-notes :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: inherit;
}

.detail-notes.markdown-notes :deep(table) {
  width: 100%;
  margin: 0.75rem 0;
  border-collapse: collapse;
  font-size: 0.95em;
}

.detail-notes.markdown-notes :deep(th),
.detail-notes.markdown-notes :deep(td) {
  border: 1px solid var(--border-color);
  padding: 0.45rem 0.6rem;
  text-align: left;
  vertical-align: top;
}

.detail-notes.markdown-notes :deep(th) {
  background: var(--bg-color);
  font-weight: 600;
}

.detail-notes.markdown-notes :deep(hr) {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid var(--border-color);
}

.header-line {
  width: 40px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.info-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  background: white;
  padding: 1rem 1.5rem;
  align-items: center;
}

.info-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
}

.info-label i {
  font-size: 1rem;
  color: #94a3b8;
}

.info-value {
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
}

.info-badge-amber {
  background: var(--bg-accent);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid var(--border-amber-20);
  display: inline-block;
}

.tag-badge {
  background: var(--bg-color);
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  display: inline-block;
}

.data-section {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.empty-data-hint {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-resource-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 3rem 2rem;
  text-align: center;
}

.ds-loading-spinner {
  width: 44px; height: 44px;
  border: 4px solid var(--secondary-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 991px) {
  .dataset-detail-card {
    padding: 1.5rem;
    border-radius: 20px;
  }
  .detail-title {
    font-size: 1.75rem;
  }
  .detail-header {
    margin-bottom: 2rem !important;
  }
  .data-section {
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 768px) {
  .info-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1.25rem;
    border-radius: 12px;
  }
  .info-label {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-bottom: 0.25rem;
  }
  .info-value {
    font-size: 0.875rem;
    word-break: break-word;
  }
  .detail-notes {
    font-size: 0.9375rem;
    line-height: 1.6;
  }
  
  /* Robust table responsiveness for markdown content */
  .markdown-notes :deep(table) {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .detail-title {
    font-size: 1.4rem;
  }
  .info-section {
    margin-bottom: 2rem !important;
  }
}
</style>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { CKAN_ACTION_API } from '@/config/api'
import { formatLongDate, formatDate } from '../utils/dates'
import { renderCkanNotesMarkdown } from '../utils/renderCkanNotesMarkdown'
import { useToast } from '@/composables/useToast'
import JsonDatasetInsightPanel from './JsonDatasetInsightPanel.vue'

const route = useRoute()
const { error: toastError } = useToast()
const dataset = ref(null)
const notFound = ref(false)
const emit = defineEmits(['setTitle', 'setOrganizationName', 'setOrganizationSlug'])

const jsonResource = computed(() => {
  const list = dataset.value?.resources
  if (!list?.length) return null
  const jsons = list.filter((r) => (r.format || '').toLowerCase() === 'json')
  return jsons.length ? jsons[0] : null
})

const notesHtml = computed(() => {
  const notes = renderCkanNotesMarkdown(dataset.value?.notes || '') || '<p>-</p>'
  return stripDuplicateTitleHeading(notes, dataset.value?.title)
})

const valOrDash = (v) => (v === null || v === undefined || String(v).trim() === '' ? '-' : v)

function stripDuplicateTitleHeading(html, title) {
  if (!html || !title) return html || ''
  if (typeof window === 'undefined') return html

  const parser = new window.DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const firstHeading = doc.body.querySelector('h1, h2, h3')
  if (!firstHeading) return html

  const headingText = firstHeading.textContent?.trim().toLowerCase()
  const titleText = String(title).trim().toLowerCase()
  if (headingText && headingText === titleText) {
    firstHeading.remove()
  }
  return doc.body.innerHTML
}

const fetchDataset = async (id) => {
  try {
    const res = await fetch(`${CKAN_ACTION_API.PACKAGE_SHOW}?id=${encodeURIComponent(id)}`)
    const data = await res.json()

    if (data.success && data.result) {
      dataset.value = data.result
      emit('setTitle', data.result.title)
      emit('setOrganizationName', data.result.organization?.title || 'Tidak tersedia')
      emit('setOrganizationSlug', data.result.organization?.name || '')
    } else {
      notFound.value = true
      toastError('Dataset tidak ditemukan.')
    }
  } catch (err) {
    console.error('Gagal memuat dataset:', err)
    notFound.value = true
    toastError('Gagal memuat dataset.')
  }
}

onMounted(() => {
  const id = route.params.id || route.query.id
  if (id) fetchDataset(id)
})
</script>
