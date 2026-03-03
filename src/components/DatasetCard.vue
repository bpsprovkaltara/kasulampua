<template>
  <div class="dataset-list">
    <div v-for="(dataset, index) in props.datasets" :key="dataset.id || index"
      class="dataset-item mb-3">
      <div class="card-content p-4">
        <div class="row align-items-start">
          <div class="col-md-10 col-12">
            <div class="d-flex align-items-center mb-2">
              <span class="org-badge">{{ dataset.organization?.title || 'Umum' }}</span>
            </div>
            <h5 class="dataset-title mb-2">
              <router-link :to="{ path: `/dataset/${dataset.id}`, query: { from: $route.fullPath } }" class="title-link">
                {{ dataset.title }}
              </router-link>
            </h5>
            
            <div class="dataset-meta mb-3">
              <span class="meta-item me-3">
                <i class="bi bi-calendar3 me-2"></i>
                {{ formatLongDate(dataset.metadata_created) }}
              </span>
              <span class="meta-item">
                <i class="bi bi-building me-2"></i>
                {{ dataset.organization?.title || 'BPS' }}
              </span>
            </div>

            <div class="notes-section">
              <p class="dataset-notes mb-0">
                <template v-if="!expanded[index]">
                  {{ truncateText(dataset.notes) }}
                  <a class="toggle-link" href="#" @click.prevent="expanded[index] = true">
                    Selengkapnya
                  </a>
                </template>
                <template v-else>
                  <span v-html="dataset.notes || 'Tanpa deskripsi.'"></span>
                  <a class="toggle-link ms-2" href="#" @click.prevent="expanded[index] = false">Tutup</a>
                </template>
              </p>
            </div>
          </div>

          <div class="col-md-2 col-12 d-flex justify-content-md-end mt-3 mt-md-0">
            <router-link :to="{ path: `/dataset/${dataset.id}`, query: { from: $route.fullPath } }"
              class="btn-detail">
              Detail Data
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatLongDate } from '../utils/dates'
const props = defineProps({
  datasets: {
    type: Array,
    required: true,
  },
  index: Number
})


// const truncateText = (text) => {
//   if (!text || typeof text !== 'string') return 'Tanpa deskripsi.'
//   return text.length > 100 ? text.slice(0, 100) + '...' : text
// }

const truncateText = (text) => {
  const html = text || ''
  const temp = document.createElement('div')
  temp.innerHTML = html
  const plainText = temp.textContent || temp.innerText || ''
  return plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText
}
const expanded = ref({})

onMounted(() => {
  expanded.value[props.index] = false
})
</script>

<style scoped>
.dataset-item {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition-smooth);
}

.dataset-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.05);
  border-color: var(--primary-color);
}

.org-badge {
  background-color: var(--bg-accent);
  color: var(--primary-color);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dataset-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
}

.title-link {
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition-smooth);
}

.title-link:hover {
  color: var(--primary-color);
}

.dataset-meta {
  display: flex;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

.meta-item i {
  color: var(--primary-color);
}

.dataset-notes {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.toggle-link {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.8rem;
}

.toggle-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.btn-detail {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-smooth);
  white-space: nowrap;
}

.btn-detail:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}
</style>


<!-- <template>
  <DatasetCardFull v-if="type === 'search'" :datasets="data" />
  <DatasetCardBasic v-else-if="type === 'list'" :datasetNames="data" />
</template>

<script setup>
import DatasetCardFull from '@/components/DatacardFull.vue'
import DatasetCardBasic from '@/components/DatacardBasic.vue'


defineProps({
  type: { type: String, required: true },
  data: { type: Array, required: true },
})
</script> -->
