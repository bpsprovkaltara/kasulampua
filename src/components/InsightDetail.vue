<template>
  <div
    class="flex-wrap justify-content-between align-items-center small mb-4 px-4 py-2 rounded shadow-sm"
    style="background-color: rgba(255, 255, 255, 0.7);"
  >
    <div class="row">
      <div class="border rounded p-3 mb-4 d-flex flex-wrap gap-4">
        <div class="flex-fill">
          <small class="text-muted d-block mb-1">Topik</small>
          <i class="bi bi-journal-text me-1"></i> {{ props.topic }}
        </div>
        <div class="flex-fill">
          <small class="text-muted d-block mb-1">Regional</small>
          <i class="bi bi-building me-1"></i> {{ props.regional }}
        </div>
        <div class="flex-fill">
          <small class="text-muted d-block mb-1">Wilayah</small>
          <i class="bi bi-diagram-3-fill me-1"></i> {{ props.wilayah }}
        </div>
      </div>
    </div>

    <div class="row">
      <div>
        <h5 class="fw-semibold text-start">Dataset Terkait</h5>

        <ul v-if="props.relatedDatasets.length > 0" class="list-unstyled mt-2 text-start">
          <li v-for="(dataset, i) in props.relatedDatasets" :key="i" class="mb-2">
            <a :href="dataset.url" class="text-dark text-decoration-none fw-medium link-ui">
              {{ dataset.title }}
            </a>
          </li>
        </ul>

        <p v-else class="text-muted mt-2 text-start">Dataset tidak tersedia.</p>
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
    default: () => []
  }
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
a:hover {
  text-decoration: underline;
}
</style>
