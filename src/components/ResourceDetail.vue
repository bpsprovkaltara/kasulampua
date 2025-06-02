<template>
  <div class="container my-4">
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-start">
      Gagal memuat data: {{ error }}
    </div>

    <div v-else class="card shadow-sm">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0 text-start">Detail Data</h5>
      </div>
      <div class="card-body text-start">
        <h5 class="card-title">{{ resource.name }}</h5>
        <p class="card-text"><strong>Format:</strong> {{ resource.format }}</p>
        <p class="card-text"><strong>Dibuat:</strong> {{ formatDate(resource.created) }}</p>
        <p class="card-text"><strong>Terakhir Diubah:</strong> {{ formatDate(resource.last_modified) }}</p>
        <p class="card-text"><strong>Deskripsi:</strong></p>
        <p>{{ resource.description }}</p>

        <div class="text-end mt-4">
          <a :href="resource.url" class="btn btn-success" target="_blank">
            <i class="bi bi-download me-1"></i> Unduh File
          </a>
        </div>
      </div>

      <div class="card-header bg-success text-white">
        <h5 class="mb-0 text-start">Preview Data</h5>
      </div>
      <div class="card-body text-start">
        <ExcelPreview :fileUrl="fileUrl" :visible="true" />
      </div>
    </div>



  </div>


</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ExcelPreview from '../components/ExcelPreview.vue'

const route = useRoute()
const resourceId = route.params.id

const resource = ref({})
const loading = ref(true)
const error = ref(null)
const fileUrl = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3500/ckan/resource/${resourceId}`)
    const json = await res.json()
    if (json.result) {
      resource.value = json.result
      fileUrl.value = json.result.url
    } else {
      throw new Error('Data tidak ditemukan')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString()
}
</script>
