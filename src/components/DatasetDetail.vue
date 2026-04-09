<template>
  <div v-if="dataset" class="dataset-detail-container">
    <!-- Header Section (Full Width) -->
    <div class="dataset-main-card mb-4">
      <div class="detail-header mb-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <span v-for="group in dataset.groups" :key="group.name" class="info-badge-amber">
            <i class="bi bi-bookmark-star me-1"></i>
            {{ group.display_name || group.title }}
          </span>
        </div>
        <h1 class="detail-title mb-3">{{ dataset.title }}</h1>
        <!-- Horizontal Metadata Grid -->
        <div class="metadata-horizontal-grid">
          <div class="metadata-item">
            <div class="meta-label"><i class="bi bi-building me-2"></i>Organisasi</div>
            <div class="meta-value text-truncate" :title="dataset.organization?.title || dataset.organization?.name">
              {{ valOrDash(dataset.organization?.title || dataset.organization?.name) }}
            </div>
          </div>

          <div class="metadata-item">
            <div class="meta-label"><i class="bi bi-calendar-plus me-2"></i>Dibuat</div>
            <div class="meta-value">{{ formatLongDate(dataset.metadata_created) }}</div>
          </div>

          <div class="metadata-item">
            <div class="meta-label"><i class="bi bi-calendar-event me-2"></i>Diperbarui</div>
            <div class="meta-value">{{ formatLongDate(dataset.metadata_modified) }}</div>
          </div>

          <div class="metadata-item">
            <div class="meta-label"><i class="bi bi-rulers me-2"></i>Unit</div>
            <div class="meta-value">{{ unitNote }}</div>
          </div>

          <div class="metadata-item">
            <div class="meta-label"><i class="bi bi-files me-2"></i>Jumlah File</div>
            <div class="meta-value fw-bold">
              {{ dataset.num_resources || (dataset.resources && dataset.resources.length) || 0 }}
            </div>
          </div>
        </div>

        <div v-if="dataset.tags && dataset.tags.length" class="mt-4 d-flex flex-wrap gap-2">
          <span v-for="tag in dataset.tags" :key="tag.name" class="tag-badge">
            #{{ tag.display_name || tag.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Data Preview Section (Full Width) -->
    <div class="dataset-main-card mb-4">
      <div class="data-section p-0 border-0 mt-0">
        <div class="section-header d-flex align-items-center mb-4">
          <div class="header-line me-3"></div>
          <h5 class="fw-bold mb-0">Pratinjau Data</h5>
        </div>

        <JsonDatasetInsightPanel v-if="jsonResource" :resource="jsonResource" />

        <div v-else class="empty-data-hint">
          <i class="bi bi-filetype-json" style="font-size: 2rem; color: var(--text-secondary); opacity: 0.35;"></i>
          <p class="text-muted small mt-2 mb-0">
            Dataset ini tidak memiliki resource <strong>JSON</strong> untuk pratinjau tabel dan grafik.
          </p>
        </div>
      </div>

      <div v-if="!dataset.resources || !dataset.resources.length" class="empty-resource-card border-0 bg-transparent p-0">
        <i class="bi bi-folder2-open" style="font-size: 2rem; color: var(--text-secondary); opacity: 0.3;"></i>
        <p class="text-muted small mt-2 mb-0">Dataset ini belum memiliki resource.</p>
      </div>
    </div>

    <div v-if="dataset.notes" class="dataset-main-card">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Deskripsi</h5>
      </div>
      <div class="detail-notes markdown-notes" v-html="notesHtml" />
    </div>
  </div>

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
.dataset-detail-container {
  padding-top: 1rem;
}

.dataset-main-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

.detail-title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.2;
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
}

.header-line {
  width: 40px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
}

.sticky-sidebar {
  display: none;
}

.metadata-horizontal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  background: var(--bg-color);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.meta-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
}

.meta-label i {
  color: var(--primary-color);
  font-size: 0.85rem;
}

.meta-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-badge-amber {
  background: var(--bg-accent);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  border: 1px solid var(--border-amber-20);
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.tag-badge {
  background: white;
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  display: inline-block;
  transition: all 0.2s ease;
}

.tag-badge:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--bg-accent-light);
}

.data-section {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.empty-data-hint, .empty-resource-card {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--bg-color);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}


@media (max-width: 991px) {
  .dataset-main-card {
    padding: 1.5rem;
    border-radius: 16px;
  }
  .metadata-horizontal-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1.25rem;
  }
}

@media (max-width: 768px) {
  .detail-title {
    font-size: 1.5rem;
  }
  .detail-notes {
    font-size: 0.9375rem;
  }
  .metadata-horizontal-grid {
    grid-template-columns: 1fr;
  }
}
</style>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { CKAN_ACTION_API } from '@/config/api'
import { formatLongDate } from '../utils/dates'
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

function normalizeMetadataLine(line) {
  return String(line || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[*_~`>#-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractNotesMetadataValue(notes, labels) {
  if (!notes || typeof notes !== 'string') return '-'
  const rows = notes.split(/\r?\n/)
  for (const row of rows) {
    const normalized = normalizeMetadataLine(row)
    for (const label of labels) {
      const regex = new RegExp(`^${label}\\s*:`, 'i')
      if (regex.test(normalized)) {
        const value = normalized.slice(normalized.indexOf(':') + 1).trim()
        return value || '-'
      }
    }
  }
  return '-'
}

const unitNote = computed(() => extractNotesMetadataValue(dataset.value?.notes, ['Unit']))

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
