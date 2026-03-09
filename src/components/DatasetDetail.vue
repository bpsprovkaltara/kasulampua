<template>
  <div v-if="dataset" class="dataset-detail-card mb-5">
    <div class="detail-header mb-5">
      <h1 class="detail-title mb-3">{{ dataset.title }}</h1>
      <p class="detail-notes" v-if="dataset.notes">{{ dataset.notes }}</p>
    </div>

    <div class="info-section mb-5">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Informasi Umum</h5>
      </div>
      
      <div class="info-grid">
        <div class="info-row">
          <div class="info-label">Kategori</div>
          <div class="info-value">
            <span class="info-badge-amber">
              {{ dataset.category_name || dataset.category || 'Tidak tersedia' }}
            </span>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Wilayah</div>
          <div class="info-value">{{ dataset.region_name || dataset.region || 'Tidak tersedia' }}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Tahun</div>
          <div class="info-value fw-bold">{{ dataset.year || 'Tidak tersedia' }}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Tanggal</div>
          <div class="info-value">{{ formatLongDate(dataset.date) || 'Tidak tersedia' }}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Status</div>
          <div class="info-value">
            <span class="status-badge" :class="dataset.status === 'active' ? 'active' : 'inactive'">
              {{ dataset.status === 'active' ? '● Aktif' : '○ Tidak Aktif' }}
            </span>
          </div>
        </div>
        
        <div v-if="dataset.url" class="info-row">
          <div class="info-label">URL</div>
          <div class="info-value">
            <a :href="dataset.url" target="_blank" class="dataset-url-link">
              {{ dataset.url }} <i class="bi bi-box-arrow-up-right ms-1"></i>
            </a>
          </div>
        </div>
        
        <div v-if="dataset.path" class="info-row">
          <div class="info-label">Path</div>
          <div class="info-value text-muted font-monospace small">{{ dataset.path }}</div>
        </div>
      </div>
    </div>

    <div class="preview-section mb-5">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Pratinjau Data</h5>
      </div>
      
      <div class="preview-container">
        <div class="table-responsive">
          <table class="table mb-0 dataset-table">
            <thead>
              <tr>
                <th width="5%" class="text-center">No</th>
                <th width="30%">Wilayah</th>
                <th width="40%">Indikator</th>
                <th width="15%" class="text-end">Nilai</th>
                <th width="10%" class="text-center">Tahun</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td class="text-center">{{ i }}</td>
                <td>{{ dataset.region_name || 'Kalimantan Utara' }} - Area {{ i }}</td>
                <td class="text-truncate" style="max-width: 250px;">{{ dataset.title }}</td>
                <td class="text-end fw-medium">{{ (Math.random() * 1000 + 100).toFixed(2) }}</td>
                <td class="text-center">{{ dataset.year || new Date().getFullYear() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="preview-footer">
          <span class="text-muted small"><i class="bi bi-info-circle me-1"></i> Menampilkan 5 baris pertama sebagai pratinjau. Unduh dataset untuk melihat data lengkap.</span>
        </div>
      </div>
    </div>

    <div class="download-section">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Unduh Dataset</h5>
      </div>
      
      <div class="download-grid">
        <div class="download-card" @click="simulateDownload('CSV')">
          <div class="dc-icon csv"><i class="bi bi-filetype-csv"></i></div>
          <div class="dc-info">
            <div class="dc-title">Comma Separated Values</div>
            <div class="dc-ext">.CSV</div>
          </div>
          <div class="dc-action"><i class="bi bi-download"></i></div>
        </div>
        
        <div class="download-card" @click="simulateDownload('Excel')">
          <div class="dc-icon xlsx"><i class="bi bi-filetype-xlsx"></i></div>
          <div class="dc-info">
            <div class="dc-title">Microsoft Excel Spreadsheet</div>
            <div class="dc-ext">.XLSX</div>
          </div>
          <div class="dc-action"><i class="bi bi-download"></i></div>
        </div>
        
        <div class="download-card" @click="simulateDownload('PDF')">
          <div class="dc-icon pdf"><i class="bi bi-filetype-pdf"></i></div>
          <div class="dc-info">
            <div class="dc-title">Portable Document Format</div>
            <div class="dc-ext">.PDF</div>
          </div>
          <div class="dc-action"><i class="bi bi-download"></i></div>
        </div>
      </div>
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
}

.status-badge {
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 100px;
}
.status-badge.active { background: #f0fdf4; color: #16a34a; }
.status-badge.inactive { background: #fef2f2; color: #dc2626; }

.dataset-url-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid transparent;
  transition: var(--transition-smooth);
}
.dataset-url-link:hover {
  border-bottom-color: var(--primary-color);
}

.preview-container {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.dataset-table {
  font-size: 0.9375rem;
}

.dataset-table thead {
  background-color: #f8fafc;
}

.dataset-table th {
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.8125rem;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid var(--border-color) !important;
}

.dataset-table td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.dataset-table tbody tr:hover {
  background-color: #f8fafc;
}

.preview-footer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid var(--border-color);
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
}

.download-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.download-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.download-card:hover {
  background: white;
  border-color: var(--primary-color);
  box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.1);
  transform: translateY(-2px);
}

.dc-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
}

.dc-icon.csv { color: #0ea5e9; }
.dc-icon.xlsx { color: #16a34a; }
.dc-icon.pdf { color: #dc2626; }

.dc-info { flex: 1; }
.dc-title { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.02em; }
.dc-ext { font-size: 1.125rem; font-weight: 800; color: var(--text-primary); }

.dc-action { color: #94a3b8; transition: all 0.3s ease; }
.download-card:hover .dc-action { color: var(--primary-color); transform: scale(1.1); }

.download-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.toast-content {
  background: #1e293b;
  color: white;
  padding: 12px 24px;
  border-radius: 100px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
}

.toast-content i { color: #22c55e; }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>


<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDatasetStore } from '@/composables/useDatasetStore'
import { formatLongDate } from '../utils/dates'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const store = useDatasetStore()
const { allDatasets, categories } = store
const { error: toastError, success: toastSuccess } = useToast()
const dataset = ref(null)
const notFound = ref(false)
const downloadFormat = ref('')
const emit = defineEmits(['setTitle', 'setOrganizationName'])

const simulateDownload = (format) => {
  downloadFormat.value = format
  toastSuccess(`Dataset berhasil diunduh dalam format ${format}!`)
}


const fetchDataset = async (id) => {
  if (!store.hasLoaded.value) {
    await store.fetchAllData()
  }
  
  const found = allDatasets.value.find(d => String(d.id) === String(id))
  if (found) {
    dataset.value = {
      ...found,
      category_name: categories.value.find(c => c.id === found.category)?.name || found.category
    }
    emit('setTitle', dataset.value.title)
    emit('setOrganizationName', dataset.value.region_name || 'Tidak tersedia')
  } else {
    notFound.value = true
    toastError('Dataset tidak ditemukan.')
  }
}

onMounted(() => {
  const id = route.params.id || route.query.id
  if (id) fetchDataset(id)
})
</script>
