<template>
  <Navbar />
  <div class="header_insight">
    <div class="container mt-5 mt-md-0">
      <div class="text-center">
        <h1 class="fw-bold">VISUALISASI <em>DATA</em></h1>
        <p class="text-muted">
          Menjelajahi data Regional Kalimantan, Sulawesi, Maluku, dan Papua...
        </p>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <Multiselect v-model="selectedRegion" :options="regionOptions" track-by="value" :search="true" label="label"
            placeholder="Pilih Regional" class="form-control" />
        </div>

        <div class="col-md-6">
          <Multiselect v-model="selectedData" :options="dataOptions" :search="true" label="label" track-by="value"
            placeholder="Pilih Dataset" class="form-control" />
        </div>
      </div>

      <div class="row">
        <div class="card card-default">
          <div class="card-heading text-center">
            <strong>{{ state.judul }}</strong>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center my-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else>
              <canvas ref="chartRef" height="600"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>
<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, reactive, watch,nextTick  } from 'vue'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import { DATAHUB_ENDPOINTS, API_ENDPOINTS } from '../config/api'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { Chart } from 'chart.js/auto'

const selectedRegion = ref('kasulampua')
const selectedData = ref('')
const dataOptions = ref([])
const chartRef = ref(null)
const chartInstance = ref(null)
const route = useRoute()
const loading = ref(true)

const opsiWilayah = ref([
  { val: 'kasulampua', label: 'Kasulampua', filter: [6100, 6200, 6300, 6400, 6500, 7100, 7200, 7300, 7400, 7500, 7600, 8100, 8200, 9100, 9200, 9400, 9500, 9600, 9700] },
  { val: 'kalimantan', label: 'Kalimantan', filter: [6100, 6200, 6300, 6400, 6500] },
  { val: 'sulawesi', label: 'Sulawesi', filter: [7100, 7200, 7300, 7400, 7500, 7600] },
  { val: 'maluku', label: 'Maluku', filter: [8100, 8200] },
  { val: 'papua', label: 'Papua', filter: [9100, 9200, 9400, 9500, 9600, 9700] }
])

const regionOptions = opsiWilayah.value.map(item => ({ value: item.val, label: item.label }))
const dataResponse = ref(null)

const state = reactive({
  satuan: '',
  labels: [],
  dataValues: [],
  judul: ''
})

// Fetch list dataset
const fetchDataset = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.LISTDATASET)
    const data = await res.json()
    dataOptions.value = data.filter(item => item.visualisasi === "1").map(item => ({
      value: item.ckan_resource_id,
      label: item.judul
    }))
    selectedData.value = dataOptions.value[0]?.value || ''
  } catch (error) {
    console.error('Gagal mengambil dataset:', error)
  }
}

// Fetch data dan siapkan label & data
const fetchData = async () => {
  if (!selectedData.value) return

  try {
    const res = await fetch(`${DATAHUB_ENDPOINTS.RESBPS}/${selectedData.value}`)
    const json = await res.json()
    dataResponse.value = json

    updateData()
  } catch (err) {
    console.error(`Gagal mengambil data: ${err}`)
  }
}

const updateData = async () =>{

    loading.value = true

    let json = dataResponse.value
    const wilayahFilter = opsiWilayah.value.find(w => w.val === selectedRegion.value)?.filter || []
    const filtered = json.vervar.filter(v => wilayahFilter.includes(v.val))

    state.labels = filtered.map(item => item.label)

    const tahunValid = []
    const dataValid = []

    const tahunTerbaru = json.tahun.reduce((max, curr) => curr.val > max.val ? curr : max)

    tahunValid.push(tahunTerbaru)

    const varval = json.var?.[0]?.val ?? ''
    const turvarval = json.turvar?.[0]?.val ?? ''
    const turtahunval = json.turtahun?.[0]?.val ?? ''


    filtered.forEach(vervar => {
      tahunValid.forEach(tahun => {
        const key = `${vervar.val}${varval}${turvarval}${tahun.val}${turtahunval}`
        dataValid.push(json.datacontent[key])
      })
    })

    state.dataValues = dataValid

    state.satuan = json.var?.[0]?.unit
    state.judul = json.var?.[0]?.label+' Tahun '+tahunTerbaru.label

    loading.value = false
    await nextTick()
    renderChart()
}

// Render atau update Chart
const renderChart = () => {
  if (!chartRef.value) return

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  chartInstance.value = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: state.labels,
      datasets: [{
        label: state.satuan,
        data: state.dataValues,
        backgroundColor: 'rgba(0, 123, 255, 0.7)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: state.satuan
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  })
}

onMounted(() => {
  fetchDataset()
  if (route.query.region) selectedRegion.value = route.query.region
  if (route.query.data) selectedData.value = route.query.data
})


watch([selectedRegion], () => {
  updateData()
})

watch([selectedData], () => {
  loading.value = true
  fetchData()
})
</script>

