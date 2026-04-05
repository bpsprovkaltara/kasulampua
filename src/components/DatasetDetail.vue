<template>
  <div v-if="dataset" class="dataset-detail-card mb-5">
    <div class="detail-header mb-5">
      <h1 class="detail-title mb-3">{{ dataset.title }}</h1>
      <p class="detail-notes" v-if="dataset.notes">{{ stripHtml(dataset.notes) }}</p>
    </div>

    <div class="info-section mb-5">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Informasi Umum</h5>
      </div>

      <div class="info-grid">
        <div class="info-row" v-if="dataset.organization">
          <div class="info-label">Organisasi</div>
          <div class="info-value">{{ dataset.organization.title || dataset.organization.name }}</div>
        </div>

        <div class="info-row" v-if="dataset.groups && dataset.groups.length">
          <div class="info-label">Kategori</div>
          <div class="info-value">
            <span
              v-for="group in dataset.groups"
              :key="group.name"
              class="info-badge-amber me-2 mb-1"
            >
              {{ group.display_name || group.title }}
            </span>
          </div>
        </div>

        <div class="info-row" v-if="dataset.license_title">
          <div class="info-label">Lisensi</div>
          <div class="info-value">{{ dataset.license_title }}</div>
        </div>

        <div class="info-row" v-if="dataset.metadata_created">
          <div class="info-label">Dibuat</div>
          <div class="info-value">{{ formatLongDate(dataset.metadata_created) }}</div>
        </div>

        <div class="info-row" v-if="dataset.metadata_modified">
          <div class="info-label">Diperbarui</div>
          <div class="info-value">{{ formatLongDate(dataset.metadata_modified) }}</div>
        </div>

        <div class="info-row" v-if="dataset.tags && dataset.tags.length">
          <div class="info-label">Tag</div>
          <div class="info-value">
            <span
              v-for="tag in dataset.tags"
              :key="tag.name"
              class="tag-badge me-2 mb-1"
            >
              {{ tag.display_name || tag.name }}
            </span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-label">Jumlah Resource</div>
          <div class="info-value fw-bold">{{ dataset.num_resources || (dataset.resources && dataset.resources.length) || 0 }}</div>
        </div>
      </div>
    </div>

    <div class="resource-section mb-5" v-if="dataset.resources && dataset.resources.length">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Daftar Resource</h5>
      </div>

      <div class="resource-list">
        <div
          v-for="res in dataset.resources"
          :key="res.id"
        >
          <div
            class="resource-card"
            :class="{ 'rc-selected': selectedResourceId === res.id }"
            @click="toggleResource(res.id)"
            style="cursor: pointer"
          >
            <div class="rc-icon" :class="getFormatClass(res.format)">
              <i :class="getFormatIcon(res.format)"></i>
            </div>
            <div class="rc-info flex-grow-1 min-w-0">
              <div class="rc-name">{{ res.name || res.description || 'Resource' }}</div>
              <div class="rc-meta">
                <span class="rc-format-badge">{{ (res.format || 'FILE').toUpperCase() }}</span>
                <span class="rc-date" v-if="res.created">{{ formatLongDate(res.created) }}</span>
              </div>
            </div>
            <div class="rc-toggle d-flex align-items-center gap-2">
              <span class="rc-toggle-label d-none d-sm-inline">{{ selectedResourceId === res.id ? 'Tutup' : 'Lihat Data' }}</span>
              <i class="bi" :class="selectedResourceId === res.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
          </div>

          <CkanResourceViewer
            v-if="selectedResourceId === res.id"
            :resource="res"
          />
        </div>
      </div>
    </div>

    <div v-else class="empty-resource-card mb-5">
      <i class="bi bi-folder2-open" style="font-size: 2rem; color: var(--text-secondary); opacity: 0.3;"></i>
      <p class="text-muted small mt-2 mb-0">Dataset ini belum memiliki resource.</p>
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
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.7;
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
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  color: var(--text-primary);
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

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resource-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.resource-card:hover {
  background: white;
  border-color: var(--primary-color);
  box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.1);
  transform: translateY(-2px);
}

.rc-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.rc-icon.csv { color: #0ea5e9; }
.rc-icon.xlsx, .rc-icon.xls { color: #16a34a; }
.rc-icon.pdf { color: #dc2626; }
.rc-icon.json { color: #8b5cf6; }
.rc-icon.api { color: #d97706; }
.rc-icon.other { color: #64748b; }

.rc-info { min-width: 0; }
.rc-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rc-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}
.rc-format-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 10px;
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}
.rc-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.rc-toggle {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.rc-toggle-label {
  font-size: 0.8rem;
}

.rc-selected {
  background: white !important;
  border-color: var(--primary-color) !important;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.1);
}
.rc-selected .rc-toggle {
  color: var(--primary-color);
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

@media (max-width: 768px) {
  .dataset-detail-card { padding: 1.5rem; }
  .info-row { grid-template-columns: 1fr; gap: 4px; padding: 1rem; }
  .info-label { font-size: 0.75rem; }
  .resource-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .rc-actions {
    width: 100%;
  }
  .rc-actions .btn {
    flex: 1;
    text-align: center;
  }
}
</style>


<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CKAN_ACTION_API } from '@/config/api'
import { formatLongDate } from '../utils/dates'
import { useToast } from '@/composables/useToast'
import CkanResourceViewer from './CkanResourceViewer.vue'

const route = useRoute()
const { error: toastError } = useToast()
const dataset = ref(null)
const notFound = ref(false)
const selectedResourceId = ref(null)
const emit = defineEmits(['setTitle', 'setOrganizationName'])

const toggleResource = (id) => {
  selectedResourceId.value = selectedResourceId.value === id ? null : id
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

const getFormatClass = (format) => {
  if (!format) return 'other'
  const f = format.toLowerCase()
  if (f === 'csv') return 'csv'
  if (f === 'xlsx' || f === 'xls') return 'xlsx'
  if (f === 'pdf') return 'pdf'
  if (f === 'json') return 'json'
  if (f === 'api') return 'api'
  return 'other'
}

const getFormatIcon = (format) => {
  if (!format) return 'bi bi-file-earmark'
  const f = format.toLowerCase()
  if (f === 'csv') return 'bi bi-filetype-csv'
  if (f === 'xlsx' || f === 'xls') return 'bi bi-filetype-xlsx'
  if (f === 'pdf') return 'bi bi-filetype-pdf'
  if (f === 'json') return 'bi bi-filetype-json'
  if (f === 'api') return 'bi bi-cloud-arrow-down'
  return 'bi bi-file-earmark'
}

const fetchDataset = async (id) => {
  try {
    const res = await fetch(`${CKAN_ACTION_API.PACKAGE_SHOW}?id=${encodeURIComponent(id)}`)
    const data = await res.json()

    if (data.success && data.result) {
      dataset.value = data.result
      emit('setTitle', data.result.title)
      emit('setOrganizationName', data.result.organization?.title || 'Tidak tersedia')

      // Auto-expand first resource if only 1
      if (data.result.resources && data.result.resources.length === 1) {
        selectedResourceId.value = data.result.resources[0].id
      }
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
