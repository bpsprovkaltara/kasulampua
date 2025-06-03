<template>
  <div class="list-group">
    <div v-for="(dataset, index) in props.datasets" :key="dataset.id || index"
      class="list-group-item list-group-item-action">
      <div class="row align-items-stretch">
        <!-- Kolom kiri -->
        <div class="col-md-11 col-12">
          <h6 class="mb-1">
            <i class="bi bi-archive text-success me-2"></i>
            {{ dataset.title }}
          </h6>
          <small class="text-muted d-block mb-1">
            <i class="bi bi-building-fill text-success me-2"></i>
            {{ dataset.organization?.title || 'Tidak diketahui' }}
          </small>
          <small class="text-muted d-block mb-1">
            <i class="bi bi-archive text-success me-2"></i>
            {{ formatDate(dataset.metadata_created) }}
          </small>

          <div v-if="!expanded[index]">
            <small class="text-muted">
              <i class="bi bi-file-earmark-ppt text-success me-2"></i>
              {{ truncateText(dataset.notes) }}
              <a class="link-ui" href="#" @click.prevent="expanded[index] = true" :id="'link-expand-' + index">
                Selengkapnya
              </a>
            </small>
          </div>
          <div v-else class="mt-2" :id="'deskripsi-' + index">
            <div class="text-muted text-start">
              <i class="bi bi-file-earmark-ppt text-success me-2"></i>
              <div class="text-html" v-html="dataset.notes || 'Tanpa deskripsi.'"></div>
              <a class="link-ui" href="#" @click.prevent="expanded[index] = false">...Tutup</a>
            </div>
          </div>
        </div>

        <!-- Kolom kanan tombol -->
        <div
          class="col-md-1 col-12 d-flex align-items-center justify-content-md-end justify-content-start mt-2 mt-md-0">
          <router-link :to="{ path: `/dataset/${dataset.id}`, query: { from: $route.fullPath } }"
            class="badge bg-success text-white text-decoration-none">
            🔍 Lihat Detail
          </router-link>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps({
  datasets: {
    type: Array,
    required: true,
  },
  index: Number
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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
.description-wrapper {
  position: relative;
}

.collapsed-html {
  max-height: 5em;
  overflow: hidden;
  white-space: normal;
}

.expanded-html .text-html {
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  max-height: 400px;
  overflow: auto;
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
