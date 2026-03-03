<template>
  <div class="insight-detail-container mb-5">
    <div class="info-grid mb-5">
      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-journal-text"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Topik</span>
          <span class="info-value">{{ props.topic }}</span>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-building"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Regional</span>
          <span class="info-value">{{ props.regional }}</span>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-geo-alt"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Wilayah</span>
          <span class="info-value">{{ props.wilayah }}</span>
        </div>
      </div>
    </div>

    <div class="related-section">
      <div class="section-header d-flex align-items-center mb-4">
        <div class="header-line me-3"></div>
        <h5 class="fw-bold mb-0">Dataset Terkait</h5>
      </div>

      <div class="datasets-list" v-if="props.relatedDatasets.length > 0">
        <div v-for="(dataset, i) in props.relatedDatasets" :key="i" class="dataset-link-card">
          <a :href="dataset.url" class="dataset-link">
            <span class="link-icon"><i class="bi bi-database-fill"></i></span>
            <span class="link-text">{{ dataset.title }}</span>
            <i class="bi bi-arrow-up-right ms-auto link-arrow"></i>
          </a>
        </div>
      </div>

      <div v-else class="empty-datasets p-4 text-center rounded">
        <p class="text-muted mb-0">Tidak ada dataset terkait yang tersedia untuk insight ini.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '../config/api'
import { onMounted } from 'vue'

const props = defineProps({
  id: String,
  topic: String,
  regional: String,
  wilayah: String,
  relatedDatasets: {
    type: Array,
    default: () => [],
  },
})

const handleViews = async () => {
  try {
    await fetch(`${API_ENDPOINTS.INSIGHT}/${props.id}/increment-views`, {
      method: 'POST',
    })
  } catch (error) {
    console.error('Gagal menambah view:', error)
  }
}

onMounted(() => {
  handleViews()
})
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition-smooth);
}

.info-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.info-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-accent);
  color: var(--primary-color);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.header-line {
  width: 40px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
}

.datasets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dataset-link-card {
  transition: var(--transition-smooth);
}

.dataset-link {
  display: flex;
  align-items: center;
  gap: 14px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-smooth);
}

.dataset-link:hover {
  border-color: var(--primary-color);
  background: var(--bg-accent-light);
  transform: translateX(4px);
}

.link-icon {
  color: var(--primary-color);
  font-size: 1.125rem;
}

.link-arrow {
  color: var(--text-secondary);
  opacity: 0.5;
  transition: var(--transition-smooth);
}

.dataset-link:hover .link-arrow {
  color: var(--primary-color);
  opacity: 1;
}

.empty-datasets {
  background: var(--bg-color);
  border: 1px dashed var(--border-color);
}

@media (max-width: 576px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
