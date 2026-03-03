<template>
  <div v-if="dataset" class="dataset-detail-card mb-5">
    <div class="detail-header mb-5">
      <h1 class="detail-title mb-3">{{ dataset.title }}</h1>
      <p class="detail-notes" v-if="dataset.notes">{{ dataset.notes }}</p>
    </div>

    <div class="info-section">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Informasi Umum</h5>
      </div>
      
      <div class="info-grid">
        <div class="info-row">
          <div class="info-label">Kategori</div>
          <div class="info-value">
            <span class="info-badge-amber">
              {{ dataset.category_name || dataset.category || '-' }}
            </span>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Wilayah</div>
          <div class="info-value">{{ dataset.region_name || dataset.region || '-' }}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Tahun</div>
          <div class="info-value fw-bold">{{ dataset.year || '-' }}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Tanggal</div>
          <div class="info-value">{{ formatLongDate(dataset.date) || '-' }}</div>
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
</style>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { API_ENDPOINTS } from '@/config/api'
import { formatLongDate } from '../utils/dates'

const route = useRoute()
const dataset = ref(null)
const emit = defineEmits(['setTitle', 'setOrganizationName'])


const fetchDataset = async (id) => {
  try {
    const res = await fetch(API_ENDPOINTS.DATASET_DETAIL(id))
    dataset.value = await res.json()
    emit('setTitle', dataset.value.title)
    emit('setOrganizationName', dataset.value.region_name || dataset.value.region || '-')
  } catch (err) {
    console.error('Gagal mengambil dataset:', err)
  }
}

onMounted(() => {
  const id = route.params.id || route.query.id
  if (id) fetchDataset(id)
})
</script>
