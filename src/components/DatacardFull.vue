<template>
  <div class="list-group list-group-flush border-0">
    <div
      v-for="(dataset, index) in datasets"
      :key="dataset.id || index"
      class="dataset-card mb-3 p-4 bg-white"
    >
      <div class="d-flex justify-content-between align-items-start gap-3">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center mb-2">
            <span class="category-badge me-2">{{ dataset.organization?.title || 'Umum' }}</span>
          </div>
          <h5 class="dataset-title mb-2">
            <router-link :to="`/dataset/${dataset.id || dataset.name}`" class="text-decoration-none">
              {{ dataset.title }}
            </router-link>
          </h5>
          <p class="dataset-notes mb-3">
            {{ dataset.notes?.slice(0, 160) || 'Tanpa deskripsi' }}...
          </p>
          <div class="d-flex flex-wrap gap-3 align-items-center">
            <small class="meta-item">
              <i class="bi bi-calendar3 me-1"></i>
              {{ formatLongDate(dataset.metadata_created) }}
            </small>
            <small class="meta-item">
              <i class="bi bi-building me-1"></i>
              {{ dataset.organization?.title || 'Tidak diketahui' }}
            </small>
          </div>
        </div>
        <div class="flex-shrink-0 text-end">
          <a
            v-if="dataset.resources?.[0]?.url"
            :href="dataset.resources[0].url"
            target="_blank"
            class="btn-download d-inline-flex align-items-center gap-2"
          >
            <i class="bi bi-cloud-arrow-down-fill"></i>
            Unduh Data
          </a>
          <span v-else class="badge bg-light text-muted p-2 rounded-3">No File</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dataset-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition-smooth);
}

.dataset-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.08);
  border-color: var(--primary-color);
}

.category-badge {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.dataset-title {
  font-size: 1.125rem;
  font-weight: 700;
}

.dataset-title a {
  color: var(--text-primary);
  transition: var(--transition-smooth);
}

.dataset-title a:hover {
  color: var(--primary-color);
}

.dataset-notes {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
}

.meta-item {
  color: #6b7280;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

.meta-item i {
  color: var(--primary-color);
}

.btn-download {
  background-color: var(--amber-600);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-smooth);
}

.btn-download:hover {
  background-color: var(--amber-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}
</style>

<script setup>
import { formatLongDate } from '../utils/dates'
defineProps({ datasets: Array })

</script>
