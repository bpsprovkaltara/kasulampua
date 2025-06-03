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
        <DynamicTabelStatistik
          v-if="statistikData.length"
          :data="statistikData"
          :index="0"
          :yearRange="'2000-2023'"
        />
      </div>
    </div>



  </div>


</template>


<script setup>
import { ref } from 'vue'
//import { useRoute } from 'vue-router'
//import ExcelPreview from '../components/ExcelPreview.vue'
//import { DATAHUB_ENDPOINTS } from '@/config/api'
import DynamicTabelStatistik from '../components/DynamicTabelStatistik.vue'

//const route = useRoute()
//const resourceId = route.params.id

 const resource = ref({
  name:'',
  description:'',
  format:'',
  created:'',
  last_modified:''
 })
// const loading = ref(true)
// const error = ref(null)
//const fileUrl = ref('')
const statistikData = ref([
  {"status":"OK","data-availability":"available","last_update":"2022-11-25 02:42:42","subject":[{"val":536,"label":"Harga-Harga"}],"var":[{"val":218,"label":"2- Inflasi Tahun Kalender (y-to-d) Kota Ambon, dan Kota Tual","unit":"Persen","subj":"Inflasi","def":"","decimal":2,"note":"BRS, BPS Provinsi Maluku"}],"turvar":[{"val":"0","label":"Tidak ada"}],"labelvervar":"Kota","vervar":[{"val":1,"label":"Ambon"},{"val":2,"label":"Tual"}],"tahun":[{"val":117,"label":"2017"},{"val":119,"label":"2019"},{"val":122,"label":"2022"}],"turtahun":[{"val":1,"label":"Januari"},{"val":2,"label":"Februari"},{"val":3,"label":"Maret"},{"val":4,"label":"April"},{"val":5,"label":"Mei"},{"val":6,"label":"Juni"},{"val":7,"label":"Juli"},{"val":8,"label":"Agustus"},{"val":9,"label":"September"},{"val":10,"label":"Oktober"},{"val":11,"label":"November"},{"val":12,"label":"Desember"},{"val":13,"label":"Tahunan"}],"datacontent":{"121801171":0.28,"121801172":-0.47,"121801173":0.65,"121801174":-0.11,"121801175":0.09,"121801176":3,"121801177":3.89,"121801178":1.73,"121801179":1.5,"1218011710":0.21,"1218011711":-0.38,"1218011712":-0.05,"1218011713":-0.05,"121801191":0.48,"121801192":0.62,"121801193":1.49,"121801194":1.33,"121801195":2.81,"121801221":0.34,"121801222":-0.11,"121801223":0.37,"121801224":5.04,"121801225":1.79,"121801226":1.88,"121801227":3.58,"121801228":4.43,"121801229":4.74,"1218012210":4.61,"221801171":0.1,"221801172":1.13,"221801173":1.93,"221801174":2.09,"221801175":3.08,"221801176":7.69,"221801177":10.16,"221801178":7.91,"221801179":9.63,"2218011710":10.78,"2218011711":7.75,"2218011712":9.41,"2218011713":9.41,"221801191":-0.87,"221801192":2.09,"221801193":-1,"221801194":-0.82,"221801195":2.06,"221801221":0.2,"221801222":-0.92,"221801223":-1.2,"221801224":3.36,"221801225":1.75,"221801226":2.41,"221801227":4.11,"221801228":3.17,"221801229":4.22,"2218012210":2.82},"related":{"1":{"id":"MzMwIzI=","title":"3- Inflasi Tahun ke Tahun (y-on-y) Kota Ambon, dan Kota Tual","tablesource":2,"last_update":"2023-02-13","link":"/2/MzMwIzI=/3--inflasi-tahun-ke-tahun--y-on-y--kota-ambon--dan-kota-tual.html"},"2":{"id":"MzU2IzI=","title":"Inflasi Bulanan (m-to-m) Kota Tual","tablesource":2,"last_update":"2025-05-02","link":"/2/MzU2IzI=/inflasi-bulanan--m-to-m--kota-tual.html"},"3":{"id":"MzUxIzI=","title":"Inflasi Bulanan (m-to-m) Kota Ambon","tablesource":2,"last_update":"2025-05-02","link":"/2/MzUxIzI=/inflasi-bulanan--m-to-m--kota-ambon.html"}},"idkat":"17156455886642ac942bdbb6.15215138","judul":"Inflasi ","kategori":"5","namakat":"ekonomi"}
])

// onMounted(async () => {
//   try {
//     const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_RESOURCE_DETAIL}/${resourceId}`)
//     const json = await res.json()
//     if (json.result) {
//       resource.value = json.result
//       fileUrl.value = json.result.url
//     } else {
//       throw new Error('Data tidak ditemukan')
//     }
//   } catch (err) {
//     error.value = err.message
//   } finally {
//     loading.value = false
//   }
// })

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString()
}
</script>

