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

        <ExcelPreview
        v-if="(isExcelPreview || !statistikData.length) && fileUrl"
        :fileUrl="fileUrl"
        :visible="true"
      />


        <DynamicTabelStatistik
          v-else
          :data="statistikData"
          :index="0"
          :yearRange="'2000-2025'"
        />

      </div>
    </div>



  </div>


</template>


<script setup>
import { ref,computed,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ExcelPreview from '../components/ExcelPreview.vue'
import { DATAHUB_ENDPOINTS } from '@/config/api'
import DynamicTabelStatistik from '../components/DynamicTabelStatistik.vue'

const route = useRoute()
const resourceId = route.params.id

 const resource = ref({
  name:'',
  description:'',
  format:'',
  created:'',
  last_modified:'',
  url:''
 })
 const loading = ref(true)
 const error = ref(null)
const fileUrl = ref('')
const statistikData = ref([
  ])


const isResoff = computed(() => resourceId?.startsWith('resoff-'))
const isResbps = computed(() => resourceId?.startsWith('resbps-'))
const isExcelPreview = computed(() => isResoff.value || isResbps.value)


onMounted(async () => {
  if (isResoff.value) {
   try {
      const res = await fetch(`${DATAHUB_ENDPOINTS.RESOFF}/${resourceId}`)
      const json = await res.json()
      if (json && json.url) {
        fileUrl.value = json.url
        resource.value = {
          name:json.judul,
          description:'-',
          format:'-',
          created:json.date,
          last_modified:json.date,
          url:json.url
        }

      } else {
        throw new Error('Data tidak ditemukan')
      }
    } catch (error) {
      error.value = error.message
    } finally {
      loading.value = false
    }
  } else if (isResbps.value) {
    try {
      const res = await fetch(`${DATAHUB_ENDPOINTS.RESBPS}/${resourceId}`);

      if (!res.ok) {
        throw new Error(`Gagal fetch data: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      statistikData.value = [json];

      resource.value = {
          name:json.var[0].label,
          description:json.var[0].note,
          format:'-',
          created:json.last_update,
          last_modified:json.last_update,
          url:json.url || '-'
        }

      fileUrl.value = ''
    } catch (err) {
      error.value = err.message || 'Terjadi kesalahan saat mengambil data';
    } finally {
      loading.value = false;
    }
  } else {
    try {
      const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_RESOURCE_DETAIL}/${resourceId}`)
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
  }
})



const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString()
}
</script>

