<template>
  <div class="dataset-list">
    <router-link 
      v-for="(dataset, index) in props.datasets" 
      :key="dataset.id || index"
      :to="{ path: `/dataset/${dataset.id}`, query: { from: $route.fullPath } }"
      class="dataset-item d-block text-decoration-none mb-3"
    >
      <div class="card-content p-4">
        <div class="row align-items-center">
          <div class="col-md-9 col-12">
            <div class="d-flex align-items-center mb-2">
              <span class="org-badge">{{ dataset.organization?.title || 'Umum' }}</span>
            </div>
            <h5 class="dataset-title mb-2">
              {{ dataset.title }}
            </h5>
            
            <div class="dataset-meta mb-3">
              <span class="meta-item me-3" v-if="dataset.metadata_created">
                <i class="bi bi-calendar3 me-2"></i>
                {{ formatLongDate(dataset.metadata_created) }}
              </span>
              <span class="meta-item me-3">
                <i class="bi bi-building me-2"></i>
                {{ dataset.organization?.title || 'BPS' }}
              </span>
              <span class="meta-item" v-if="getRegionName(dataset)">
                <i class="bi bi-geo-alt me-2"></i>
                {{ getRegionName(dataset) }}
              </span>
            </div>

            <div class="notes-section">
              <p class="dataset-notes mb-0">
                <template v-if="!expanded[index]">
                  {{ truncateText(dataset.notes) }}
                  <span class="toggle-link" @click.prevent.stop="expanded[index] = true">
                    Selengkapnya
                  </span>
                </template>
                <template v-else>
                  <span v-html="dataset.notes || 'Tanpa deskripsi.'"></span>
                  <span class="toggle-link ms-2" @click.prevent.stop="expanded[index] = false">Tutup</span>
                </template>
              </p>
            </div>
          </div>

          <div class="col-md-3 col-12 d-flex justify-content-md-end mt-3 mt-md-0">
            <div class="detail-label">
              Lihat Detail
            </div>
          </div>
        </div>
      </div>
    </router-link>
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

const getRegionName = (dataset) => {
  const orgName = dataset.organization?.name || ''
  if (orgName.includes('kaltara')) return 'Kalimantan Utara'
  if (orgName.includes('sulteng')) return 'Sulawesi Tengah'
  if (orgName.includes('malut')) return 'Maluku Utara'
  if (orgName.includes('pabarat')) return 'Papua Barat'
  return null
}

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
  color: var(--text-primary);
  transition: var(--transition-smooth);
}

.dataset-item:hover .dataset-title {
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
  cursor: pointer;
  font-size: 0.8rem;
}

.toggle-link:hover {
  text-decoration: underline;
}

.detail-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-smooth);
}

.dataset-item:hover .detail-label {
  opacity: 1;
  transform: translateX(0);
  color: var(--primary-color);
}

.dataset-item:hover {
  border-color: var(--primary-color);
  background-color: #fffaf0;
  box-shadow: 0 10px 30px -10px rgba(217, 119, 6, 0.15);
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
