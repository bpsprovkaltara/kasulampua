<template>
  <Navbar />

  <header class="hero-v2">
    <div class="hero-v2-glow" aria-hidden="true"></div>
    <div class="hero-v2-dots" aria-hidden="true"></div>

    <div class="container position-relative" style="z-index: 10">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="hero-v2-badge">
            <span class="badge-dot"></span>
            DATA ANALYTICS
          </div>

          <h1 class="hero-v2-title">
            Data <br />
            <em>Insight</em>
          </h1>

          <p class="hero-v2-subtitle">
            Eksplorasi data <strong>Kasulampua</strong> melalui visualisasi interaktif yang mendalam
            untuk mendukung pengambilan keputusan.
          </p>
        </div>
      </div>
    </div>
  </header>

  <main class="visualisasi-wrapper py-5">
    <div class="container">
      <div class="glass-filter-card mb-4 fade-in-up">
        <div class="row g-4 align-items-end">
          <div class="col-lg-4 col-md-6">
            <label class="filter-label mb-2"
              ><i class="bi bi-geo-alt-fill me-2"></i>Pilih Regional</label
            >
            <Multiselect
              v-model="selectedRegion"
              :options="regionOptions"
              track-by="value"
              :search="true"
              label="label"
              placeholder="Pilih Regional"
              class="custom-multiselect"
            />
          </div>

          <div class="col-lg-5 col-md-6">
            <label class="filter-label mb-2"
              ><i class="bi bi-database-fill me-2"></i>Pilih Dataset</label
            >
            <Multiselect
              v-model="selectedData"
              :options="dataOptions"
              :search="true"
              label="label"
              track-by="value"
              placeholder="Pilih Dataset"
              class="custom-multiselect"
            />
          </div>

          <div class="col-lg-3 col-md-12">
            <label class="filter-label mb-2"
              ><i class="bi bi-palette-fill me-2"></i>Tipe Visualisasi</label
            >
            <div class="chart-type-toggle">
              <button
                v-for="type in chartTypes"
                :key="type.id"
                @click="selectedChartType = type.id"
                :class="['type-btn', { active: selectedChartType === type.id }]"
                :title="type.label"
              >
                <i :class="type.icon"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="chart-container-card fade-in-up" style="animation-delay: 0.2s">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div class="flex-grow-1">
                <h3 class="chart-title mb-1">{{ state.judul }}</h3>
                <div class="badge-satuan">Satuan: {{ state.satuan }}</div>
              </div>
              <button @click="downloadChart" class="btn-download-chart">
                <i class="bi bi-download me-2"></i>Unduh PNG
              </button>
            </div>

            <div class="chart-body">
              <div v-if="loading" class="chart-loading-overlay">
                <div class="loading-spinner"></div>
                <p class="mt-3 text-muted fw-medium">Menyiapkan visualisasi...</p>
              </div>
              <div class="chart-canvas-wrapper" :class="{ faded: loading }">
                <canvas ref="chartRef"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>
<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, reactive, watch, nextTick } from 'vue'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
// import { DATAHUB_ENDPOINTS, API_ENDPOINTS } from '../config/api'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { Chart } from 'chart.js/auto'

const selectedRegion = ref('kasulampua')
const selectedData = ref('')
const dataOptions = ref([])
const chartRef = ref(null)
let chartInstance = null
const route = useRoute()
const loading = ref(true)
const selectedChartType = ref('bar')

const chartTypes = [
  { id: 'bar', label: 'Batang', icon: 'bi bi-bar-chart-fill' },
  { id: 'line', label: 'Garis', icon: 'bi bi-graph-up' },
  { id: 'doughnut', label: 'Lingkaran', icon: 'bi bi-pie-chart-fill' },
]

const opsiWilayah = ref([
  {
    val: 'kasulampua',
    label: 'Kasulampua',
    filter: [
      6100, 6200, 6300, 6400, 6500, 7100, 7200, 7300, 7400, 7500, 7600, 8100, 8200, 9100, 9200,
      9400, 9500, 9600, 9700,
    ],
  },
  { val: 'kalimantan', label: 'Kalimantan', filter: [6100, 6200, 6300, 6400, 6500] },
  { val: 'sulawesi', label: 'Sulawesi', filter: [7100, 7200, 7300, 7400, 7500, 7600] },
  { val: 'maluku', label: 'Maluku', filter: [8100, 8200] },
  { val: 'papua', label: 'Papua', filter: [9100, 9200, 9400, 9500, 9600, 9700] },
])

const regionOptions = opsiWilayah.value.map((item) => ({ value: item.val, label: item.label }))
const dataResponse = ref(null)

const state = reactive({
  satuan: '',
  labels: [],
  dataValues: [],
  judul: '',
})

const fetchDataset = async () => {
  try {
    /*
    const res = await fetch(API_ENDPOINTS.LISTDATASET)
    const data = await res.json()
    dataOptions.value = data.filter(item => item.visualisasi === "1").map(item => ({
      value: item.ckan_resource_id,
      label: item.judul
    }))
    */

    // DUMMY DATA 
    dataOptions.value = [
      { value: 'pdrb-kab-2023', label: 'PDRB Menurut Kabupaten/Kota 2023' },
      { value: 'ipm-regional-2023', label: 'Indeks Pembangunan Manusia Regional' },
      { value: 'inflasi-bulanan', label: 'Tingkat Inflasi Bulanan' },
    ]


    if (!route.query.data && !selectedData.value) {
      selectedData.value = dataOptions.value[0]?.value || ''
    }
  } catch (error) {
    console.error('Gagal mengambil dataset:', error)
  }
}

const fetchData = async () => {
  if (!selectedData.value) return

  try {
    /*
    const res = await fetch(`${DATAHUB_ENDPOINTS.RESBPS}/${selectedData.value}`)
    const json = await res.json()
    dataResponse.value = json
    */

    // MOCK RESPONSES FOR DIFFERENT DATASETS
    const baseData = {
      'pdrb-kab-2023': {
        title: 'PDRB Menurut Kabupaten/Kota',
        unit: 'Miliar Rupiah',
        values: {
          6100: 15000,
          6200: 18000,
          6300: 16500,
          6400: 45000,
          6500: 12000,
          7100: 14000,
          7200: 22000,
          7300: 35000,
          7400: 19000,
          7500: 9000,
          7600: 11000,
          8100: 13000,
          8200: 15500,
          9100: 10500,
          9200: 11200,
          9400: 12800,
          9500: 8500,
          9600: 9800,
          9700: 10100,
        },
      },
      'ipm-regional-2023': {
        title: 'Indeks Pembangunan Manusia',
        unit: 'Poin',
        values: {
          6100: 69.5,
          6200: 72.1,
          6300: 71.8,
          6400: 77.2,
          6500: 71.4,
          7100: 73.5,
          7200: 70.1,
          7300: 72.9,
          7400: 71.2,
          7500: 69.3,
          7600: 68.0,
          8100: 71.3,
          8200: 69.5,
          9100: 65.9,
          9200: 66.2,
          9400: 61.8,
          9500: 50.5,
          9600: 55.8,
          9700: 60.1,
        },
      },
      'inflasi-bulanan': {
        title: 'Tingkat Inflasi Bulanan',
        unit: 'Persen (%)',
        values: {
          6100: 2.5,
          6200: 3.1,
          6300: 2.8,
          6400: 3.2,
          6500: 2.4,
          7100: 3.5,
          7200: 2.1,
          7300: 2.9,
          7400: 3.2,
          7500: 2.3,
          7600: 3.0,
          8100: 3.3,
          8200: 4.5,
          9100: 2.9,
          9200: 3.2,
          9400: 3.8,
          9500: 2.5,
          9600: 2.8,
          9700: 3.1,
        },
      },
    }

    const currentMock = baseData[selectedData.value] || baseData['pdrb-kab-2023']

    dataResponse.value = {
      vervar: [
        // Kalimantan
        { val: 6100, label: 'Provinsi Kalimantan Barat' },
        { val: 6200, label: 'Provinsi Kalimantan Tengah' },
        { val: 6300, label: 'Provinsi Kalimantan Selatan' },
        { val: 6400, label: 'Provinsi Kalimantan Timur' },
        { val: 6500, label: 'Provinsi Kalimantan Utara' },
        // Sulawesi
        { val: 7100, label: 'Provinsi Sulawesi Utara' },
        { val: 7200, label: 'Provinsi Sulawesi Tengah' },
        { val: 7300, label: 'Provinsi Sulawesi Selatan' },
        { val: 7400, label: 'Provinsi Sulawesi Tenggara' },
        { val: 7500, label: 'Provinsi Gorontalo' },
        { val: 7600, label: 'Provinsi Sulawesi Barat' },
        // Maluku
        { val: 8100, label: 'Provinsi Maluku' },
        { val: 8200, label: 'Provinsi Maluku Utara' },
        // Papua
        { val: 9100, label: 'Provinsi Papua Barat' },
        { val: 9200, label: 'Provinsi Papua Barat Daya' },
        { val: 9400, label: 'Provinsi Papua' },
        { val: 9500, label: 'Provinsi Papua Pegunungan' },
        { val: 9600, label: 'Provinsi Papua Tengah' },
        { val: 9700, label: 'Provinsi Papua Selatan' },
      ],
      var: [{ label: currentMock.title, unit: currentMock.unit }],
      tahun: [{ val: 2023, label: '2023' }],
      datacontent: currentMock.values,
    }

    updateData()
  } catch (err) {
    console.error(`Gagal mengambil data: ${err}`)
    loading.value = false
  }
}

const updateData = async () => {
  if (!dataResponse.value) return

  loading.value = true
  await nextTick()

  const mock = dataResponse.value
  const currentRegion = opsiWilayah.value.find((o) => o.val === selectedRegion.value)
  const allowedIds = currentRegion ? currentRegion.filter : []

  const filteredVervar =
    selectedRegion.value === 'kasulampua'
      ? mock.vervar
      : mock.vervar.filter((v) => allowedIds.includes(v.val))

  state.labels = filteredVervar.map((v) => v.label)
  state.dataValues = filteredVervar.map((v) => mock.datacontent[v.val] || 0)
  state.satuan = mock.var[0].unit
  state.judul = mock.var[0].label + ' Tahun ' + mock.tahun[0].label

  loading.value = false
  await nextTick()
  renderChart()
}

watch(chartRef, (newVal) => {
  if (newVal && state.labels.length > 0) renderChart()
})

const downloadChart = () => {
  if (!chartRef.value) return
  const link = document.createElement('a')
  link.download = `viz-kasulampua-${selectedData.value}.png`
  link.href = chartRef.value.toDataURL('image/png')
  link.click()
}

const renderChart = () => {
  if (!chartRef.value || state.labels.length === 0) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const isBar = selectedChartType.value === 'bar'
  const isLine = selectedChartType.value === 'line'

  const colors = [
    '#f59e0b', // Amber 500
    '#10b981', // Emerald 500
    '#6366f1', // Indigo 500
    '#f43f5e', // Rose 500
    '#0ea5e9', // Sky 500
    '#8b5cf6', // Violet 500
  ]

  const ctx = chartRef.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: selectedChartType.value,
    data: {
      labels: state.labels,
      datasets: [
        {
          label: state.satuan,
          data: state.dataValues,
          backgroundColor: selectedChartType.value === 'doughnut' ? colors : colors[0],
          borderColor: isLine ? colors[0] : 'transparent',
          borderWidth: isLine ? 3 : 0,
          tension: 0.4,
          borderRadius: isBar ? 8 : 0,
          fill: isLine
            ? {
                target: 'origin',
                above: 'rgba(245, 158, 11, 0.1)',
              }
            : false,
          barThickness: isBar ? 32 : undefined,
          maxBarThickness: 45,
        },
      ],
    },
    options: {
      indexAxis: isBar ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
      },
      scales:
        selectedChartType.value === 'doughnut'
          ? {}
          : {
              x: {
                beginAtZero: true,
                grid: {
                  display: !isBar,
                  color: 'rgba(0,0,0,0.05)',
                  drawBorder: false,
                },
                ticks: {
                  font: { family: "'Inter', sans-serif", size: 11 },
                  color: '#64748b',
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: isBar,
                  color: 'rgba(0,0,0,0.05)',
                  drawBorder: false,
                },
                ticks: {
                  font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
                  color: '#1e293b',
                },
              },
            },
      plugins: {
        legend: { display: selectedChartType.value === 'doughnut' },
        tooltip: {
          backgroundColor: '#1e293b',
          titleFont: { family: "'Inter', sans-serif", size: 14, weight: 'bold' },
          bodyFont: { family: "'Inter', sans-serif", size: 13 },
          padding: 12,
          cornerRadius: 8,
          displayColors: selectedChartType.value === 'doughnut',
        },
      },
    },
  })
}

onMounted(() => {
  fetchDataset()
  if (route.query.region) selectedRegion.value = route.query.region
  if (route.query.data) selectedData.value = route.query.data
})

watch([selectedRegion, selectedChartType], () => {
  updateData()
})

watch([selectedData], () => {
  loading.value = true
  fetchData()
})
</script>

<style scoped>
.visualisasi-wrapper {
  background-color: var(--bg-color);
  min-height: 80vh;
}

.glass-filter-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(217, 119, 6, 0.15);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px -4px rgba(217, 119, 6, 0.08);
  position: relative;
  z-index: 100;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  display: block;
}

.chart-title {
  color: var(--text-primary);
  font-weight: 800;
  font-size: 1.5rem;
  margin: 0;
  text-align: left;
}

.badge-satuan {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  margin-top: 4px;
}

.btn-download-chart {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
}

.btn-download-chart:hover {
  background: #f8fafc;
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.1);
  transform: translateY(-1px);
}

.chart-type-toggle {
  display: flex;
  background: white;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  gap: 4px;
}

.type-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.type-btn:hover {
  background: var(--bg-color);
  color: var(--primary-color);
}

.type-btn.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.chart-container-card {
  background: white;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  padding: 3rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 20px 40px -20px rgba(0, 0, 0, 0.05);
}

.chart-title {
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.chart-body {
  position: relative;
  min-height: 500px;
}

.chart-canvas-wrapper {
  height: 600px;
  transition: opacity 0.3s ease;
}

.chart-canvas-wrapper.faded {
  opacity: 0.3;
}


.chart-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--secondary-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.custom-multiselect) {
  --ms-border-color: var(--border-color);
  --ms-radius: 12px;
  --ms-dropdown-radius: 12px;
  --ms-py: 12px;
  --ms-font-size: 0.9375rem;
  --ms-ring-color: rgba(217, 119, 6, 0.1);
  --ms-option-bg-selected: var(--primary-color);
  --ms-option-bg-selected-pointed: var(--primary-hover);
}

:deep(.custom-multiselect.is-active) {
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .hero-v2-title {
    font-size: clamp(2.5rem, 8vw, 4rem);
  }
  .hero-v2-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem !important;
  }
  .chart-container-card {
    padding: 1.5rem;
  }
  .chart-title {
    font-size: 1.25rem;
  }
  .chart-canvas-wrapper {
    height: 400px;
  }
  .glass-filter-card {
    padding: 1.5rem;
  }
  .btn-download-chart {
    width: 100%;
    margin-top: 10px;
    justify-content: center;
  }
  .badge-satuan {
    display: block;
    width: fit-content;
    margin-top: 8px;
  }
}
</style>
