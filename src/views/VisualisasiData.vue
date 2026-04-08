<template>
  <Navbar />

  <header class="hero-v2 hero-v2-sm">
    <div class="hero-v2-glow" aria-hidden="true"></div>
    <div class="hero-v2-dots" aria-hidden="true"></div>

    <div class="container position-relative" style="z-index: 10">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="hero-v2-badge">
            <span class="badge-dot"></span>
            VISUALISASI DATA
          </div>

          <h1 class="hero-v2-title">
            Grafik <br />
            <em>&amp; Peta</em>
          </h1>

          <p class="hero-v2-subtitle">
            Eksplorasi data <strong>Kasulampua</strong> melalui visualisasi interaktif yang mendalam
            untuk mendukung pengambilan keputusan.
          </p>
        </div>
      </div>
    </div>
  </header>

  <main class="visualisasi-wrapper py-4">
    <div class="container container-viz">
      <aside class="viz-sidebar">
        <div class="glass-filter-card">
          <div class="filter-fields">
            <div class="filter-group">
              <label class="filter-label"
                ><i class="bi bi-geo-alt-fill me-2"></i>Regional</label
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

            <div class="filter-group">
              <label class="filter-label"
                ><i class="bi bi-database-fill me-2"></i>Dataset</label
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

            <div class="filter-group">
              <label class="filter-label"
                ><i class="bi bi-palette-fill me-2"></i>Tipe Grafik</label
              >
              <div class="chart-type-toggle">
                <button
                  v-for="type in chartTypes"
                  :key="type.id"
                  @click="selectedChartType = type.id"
                  :class="['type-btn', { active: selectedChartType === type.id }]"
                  :title="type.label"
                  :aria-label="`Tipe grafik: ${type.label}`"
                  :aria-pressed="selectedChartType === type.id"
                >
                  <i :class="type.icon" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div class="viz-main">
        <div class="chart-container-card">
          <div class="chart-header-row">
            <div class="chart-header-text">
              <h3 class="chart-title">{{ state.judul || 'Tidak tersedia' }}</h3>
              <div class="badge-satuan">Satuan: {{ state.satuan || 'Tidak tersedia' }}</div>
            </div>
            <button @click="downloadChart" class="btn-download-chart" aria-label="Unduh grafik sebagai gambar PNG">
              <i class="bi bi-download me-2" aria-hidden="true"></i>Unduh PNG
            </button>
          </div>

          <div class="chart-body">
            <div v-if="loading" class="chart-loading-overlay">
              <div class="loading-spinner"></div>
              <p class="mt-3 text-muted fw-medium">Menyiapkan visualisasi...</p>
            </div>
            <div class="chart-canvas-wrapper" :class="{ faded: loading }">
              <canvas v-if="selectedChartType !== 'map'" ref="chartRef"></canvas>
              <MapVisualisasi 
                 v-if="selectedChartType === 'map'"
                 :labels="state.labels"
                 :dataValues="state.dataValues"
                 :unit="state.satuan"
                 :title="state.judul"
                 :region="selectedRegion"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, reactive, watch, nextTick } from 'vue'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import MapVisualisasi from '../components/MapVisualisasi.vue'
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
const router = useRouter()
const loading = ref(true)

function pickQueryStr(val) {
  if (val == null || val === '') return ''
  if (Array.isArray(val)) return String(val[0] ?? '')
  return String(val)
}

function cleanQuery(q) {
  const out = {}
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === '') continue
    out[k] = v
  }
  return out
}

const CHART_IDS = ['bar', 'line', 'map', 'doughnut']

const selectedChartType = ref('bar')

let skipRouteQueryFetch = false
let isBootstrapping = true

const syncFromRoute = () => {
  const r = pickQueryStr(route.query.region)
  if (r) selectedRegion.value = r
  const d = pickQueryStr(route.query.data)
  if (d) selectedData.value = d
  const c = pickQueryStr(route.query.chart)
  if (c && CHART_IDS.includes(c)) selectedChartType.value = c
}

const pushQueryFromState = () => {
  const next = cleanQuery({
    region: selectedRegion.value || undefined,
    data: selectedData.value || undefined,
    chart: selectedChartType.value && selectedChartType.value !== 'bar' ? selectedChartType.value : undefined,
  })
  const cur = cleanQuery(route.query)
  if (JSON.stringify(next) === JSON.stringify(cur)) return
  skipRouteQueryFetch = true
  router.replace({ path: '/visualisasi_data', query: next })
}

const chartTypes = [
  { id: 'bar', label: 'Batang', icon: 'bi bi-bar-chart-fill' },
  { id: 'line', label: 'Garis', icon: 'bi bi-graph-up' },
  { id: 'map', label: 'Peta', icon: 'bi bi-globe-asia-australia' },
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

onMounted(async () => {
  await fetchDataset()
  syncFromRoute()
  if (selectedData.value) {
    loading.value = true
    await fetchData()
  }
  pushQueryFromState()
  isBootstrapping = false
})

watch(
  () => route.query,
  async () => {
    if (skipRouteQueryFetch) {
      skipRouteQueryFetch = false
      return
    }
    syncFromRoute()
    if (selectedData.value) {
      loading.value = true
      await fetchData()
    }
  },
  { deep: true }
)

watch([selectedRegion, selectedChartType], () => {
  if (isBootstrapping) return
  updateData()
  pushQueryFromState()
})

watch([selectedData], () => {
  if (isBootstrapping) return
  loading.value = true
  fetchData()
  pushQueryFromState()
})
</script>

<style scoped>
.visualisasi-wrapper {
  background-color: var(--bg-color);
  min-height: 80vh;
}

.container-viz {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  align-items: start;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.viz-sidebar {
  position: sticky;
  top: 80px;
  z-index: 100;
}

.viz-main {
  min-width: 0;
}

.glass-filter-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(217, 119, 6, 0.2);
  border-radius: 20px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 8px 32px -4px rgba(217, 119, 6, 0.12);
}

.filter-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero-v2-sm {
  min-height: auto !important;
  padding: 2rem 0 !important;
}

.filter-label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  display: block;
}

.chart-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.chart-header-text {
  flex: 1;
  min-width: 0;
}

.chart-title {
  color: var(--text-primary);
  font-weight: 800;
  font-size: 1.35rem;
  margin: 0 0 4px 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.badge-satuan {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
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
  flex-shrink: 0;
}

.btn-download-chart:hover {
  background: #f8fafc;
  border-color: var(--amber-600);
  color: var(--amber-600);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.1);
  transform: translateY(-1px);
}

.chart-type-toggle {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  background: white;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.type-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-height: 44px;
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
  background: var(--amber-600);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.chart-container-card {
  background: white;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 20px 40px -20px rgba(0, 0, 0, 0.05);
}

.chart-body {
  position: relative;
  min-height: 380px;
}

.chart-canvas-wrapper {
  height: 380px;
  overflow: hidden;
  position: relative;
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
  --ms-py: 10px;
  --ms-font-size: 0.9rem;
  --ms-ring-color: rgba(217, 119, 6, 0.1);
  --ms-option-bg-selected: var(--primary-color);
  --ms-option-bg-selected-pointed: var(--primary-hover);
}

:deep(.custom-multiselect.is-active) {
  border-color: var(--primary-color);
}

@media (max-width: 991px) {
  .container-viz {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .viz-sidebar {
    position: sticky;
    top: 72px;
  }

  .glass-filter-card {
    padding: 1rem 1.25rem;
  }

  .filter-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .filter-group:last-child {
    grid-column: 1 / -1;
  }

  .chart-type-toggle {
    display: flex;
    gap: 6px;
    width: fit-content;
  }
}

@media (max-width: 768px) {
  .hero-v2-title {
    font-size: clamp(2rem, 7vw, 3.5rem);
  }
  .hero-v2-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.5rem !important;
  }
  .hero-v2-sm {
    padding: 1.5rem 0 !important;
  }
  .visualisasi-wrapper {
    padding-top: 0.5rem !important;
  }
  .container-viz {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .filter-fields {
    grid-template-columns: 1fr;
  }
  .filter-group:last-child {
    grid-column: 1;
  }
  .chart-type-toggle {
    display: flex !important;
    flex-wrap: nowrap !important;
    gap: 8px;
    padding: 5px;
    width: fit-content;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    margin: 0;
  }
  .type-btn {
    width: 38px !important;
    height: 38px !important;
    flex: 0 0 38px !important;
    min-height: 38px !important;
    font-size: 0.95rem;
    border-radius: 8px;
    padding: 0 !important;
  }
  .chart-container-card {
    padding: 1rem;
    border-radius: 16px;
  }
  .chart-title {
    font-size: 1.15rem;
    margin-bottom: 6px;
  }
  .chart-body {
    min-height: 300px;
  }
  .chart-canvas-wrapper {
    height: 300px;
  }
  .btn-download-chart {
    width: 100%;
    justify-content: center;
    font-size: 0.725rem;
    padding: 8px 16px;
    border-radius: 10px;
  }
  .badge-satuan {
    display: inline-block;
    margin-top: 4px;
  }
}
</style>
