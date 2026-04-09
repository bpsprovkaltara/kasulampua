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
            REGIONAL INSIGHT
          </div>

          <h1 class="hero-v2-title">
            Regional <br />
            <em>Insight</em>
          </h1>

          <p class="hero-v2-subtitle">
            Eksplorasi dinamika sosial ekonomi <strong>Kasulampua</strong> melalui visualisasi interaktif yang mendalam
            untuk mendukung pengambilan keputusan.
          </p>
        </div>
      </div>
    </div>
  </header>

  <main class="visualisasi-wrapper py-5">
    <div class="container container-viz">
      <div class="viz-main">
        <div class="top-filter-container mb-4">
          <div class="glass-filter-card">
            <div class="filter-fields">
              <div class="filter-group region-filter">
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

              <div class="filter-group dataset-filter">
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

              <div class="filter-group chart-type-filter">
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
        </div>

        <div class="chart-container-card fade-in-up">
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
              <div class="ds-loading-spinner"></div>
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

        <div class="insight-news-section mt-5 fade-in-up" style="animation-delay: 0.2s">
          <div class="section-header mb-4">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h2 class="section-title">Analisis Terkait</h2>
                <p class="text-muted small">Informasi terkini seputar dinamika regional di Kasulampua</p>
              </div>
            </div>
          </div>

          <div class="row g-4 row-equal-height">
            <div v-for="item in displayAnalisis" :key="item.slug" class="col-12 col-md-6 col-lg-4">
              <div class="news-mini-card" @click="router.push('/regional_insight/' + item.slug)">
                <div class="nm-img-wrapper">
                  <img 
                    v-if="item.images && item.images[0]" 
                    :src="item.images[0]" 
                    :alt="item.title" 
                    class="nm-img" 
                  />
                  <img 
                    v-else-if="item.image" 
                    :src="item.image" 
                    :alt="item.title" 
                    class="nm-img" 
                  />
                  <div v-else class="nm-placeholder">
                    <i class="bi bi-file-earmark-bar-graph"></i>
                  </div>
                  <div class="nm-date-badge">{{ formatLongDate(item.created_at) }}</div>
                  <div v-if="item.images && item.images.length > 1" class="page-count-badge">
                    <i class="bi bi-layers-fill me-1"></i> {{ item.images.length }} Halaman
                  </div>
                </div>
                <div class="nm-content">
                  <h4 class="nm-title line-clamp-2">{{ item.title }}</h4>
                  <p class="nm-excerpt line-clamp-3">{{ stripHTMLText(item.content) }}</p>
                  <div class="nm-footer">
                    <span class="detail-label">Lihat Analisis <i class="bi bi-arrow-right ms-2 transition-smooth"></i></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Modal for analysis images gallery (commented out as per request)
  <div class="modal fade" id="analysisModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
        <div class="modal-header border-0 bg-light p-4">
          <div class="modal-header-text">
            <h5 class="modal-title fw-bold text-dark mb-1">{{ selectedAnalisis?.title }}</h5>
            <div class="text-muted small">Diterbitkan pada {{ formatLongDate(selectedAnalisis?.created_at) }}</div>
          </div>
          <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0 bg-dark">
          <div v-if="selectedAnalisis" id="analysisCarousel" class="carousel slide" data-bs-ride="false">
            <div class="carousel-inner">
              <div v-for="(img, idx) in selectedAnalisis.images" :key="idx" :class="['carousel-item', { active: idx === 0 }]">
                <div class="d-flex align-items-center justify-content-center bg-dark" style="min-height: 60vh; max-height: 80vh;">
                  <img :src="img" class="d-block img-fluid analysis-img" alt="Analysis slide">
                </div>
              </div>
            </div>
            
            <template v-if="selectedAnalisis.images.length > 1">
              <button class="carousel-control-prev" type="button" data-bs-target="#analysisCarousel" data-bs-slide="prev">
                <span class="carousel-control-icon"><i class="bi bi-chevron-left"></i></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#analysisCarousel" data-bs-slide="next">
                <span class="carousel-control-icon"><i class="bi bi-chevron-right"></i></span>
              </button>
              
              <div class="carousel-indicators-custom">
                {{ currentSlideIndex + 1 }} / {{ selectedAnalisis.images.length }}
              </div>
            </template>
          </div>
        </div>
        <div class="modal-footer border-0 p-3 bg-light d-flex justify-content-between">
          <div class="modal-info-meta text-muted small">
             <i class="bi bi-info-circle me-1"></i> Klik panah atau gunakan keyboard untuk navigasi halaman
          </div>
          <div class="modal-actions">
            <a :href="selectedAnalisis?.images[currentSlideIndex]" :download="`analisis-${selectedAnalisis?.slug}-page-${currentSlideIndex+1}.jpg`" class="btn btn-primary btn-sm px-4 rounded-pill fw-bold" target="_blank">
              <i class="bi bi-download me-2"></i> Unduh Gambar
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  -->

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
import { formatLongDate } from '../utils/dates'

const selectedRegion = ref('kasulampua')
const selectedData = ref('')
const dataOptions = ref([])
const chartRef = ref(null)
let chartInstance = null
const route = useRoute()
const router = useRouter()
const loading = ref(true)

const displayAnalisis = ref([
  {
    title: 'Tantangan Ekonomi di Wilayah Perbatasan Kalimantan',
    slug: 'tantangan-ekonomi-kalimantan',
    content: 'Tinjauan mendalam mengenai dinamika ekonomi di wilayah perbatasan Kalimantan Utara. Analisis ini menyoroti ketergantungan pada perdagangan lintas batas.',
    images: ['https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2671&auto=format&fit=crop'],
    created_at: '2024-02-15'
  },
  {
    title: 'Potensi Wisata Bahari Sulawesi Selatan',
    slug: 'wisata-bahari-sulawesi',
    content: 'Sulawesi Selatan memiliki garis pantai yang panjang dengan kekayaan hayati laut yang luar biasa. Analisis ini memetakan titik-titik potensial wisata bahari.',
    images: ['https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=2670&auto=format&fit=crop'],
    created_at: '2024-02-10'
  },
  {
    title: 'Distribusi Pangan di Kepulauan Maluku',
    slug: 'pangan-maluku',
    content: 'Analisis logistik dan rantai pasok pangan di wilayah Kepulauan Maluku. Fokus pada kestabilan harga kebutuhan pokok antar pulau.',
    images: ['https://images.unsplash.com/photo-1495539406979-bf61750d38ad?q=80&w=2670&auto=format&fit=crop'],
    created_at: '2024-02-05'
  }
])

// const selectedAnalisis = ref(null)
// const currentSlideIndex = ref(0)
// let analysisBsModal = null

/*
const openAnalysisModal = async (item) => {
  selectedAnalisis.value = item
  currentSlideIndex.value = 0
  
  await nextTick()
  
  if (!analysisBsModal) {
    const modalEl = document.getElementById('analysisModal')
    if (modalEl) analysisBsModal = new Modal(modalEl)
  }
  
  const carouselEl = document.getElementById('analysisCarousel')
  if (carouselEl) {
    let bsCarousel = Carousel.getInstance(carouselEl)
    if (!bsCarousel) {
      bsCarousel = new Carousel(carouselEl, {
        interval: false,
        ride: false
      })
      
      carouselEl.addEventListener('slid.bs.carousel', event => {
        currentSlideIndex.value = event.to
      })
    } else {
      bsCarousel.to(0)
    }
  }
  
  if (analysisBsModal) analysisBsModal.show()
}
*/

function stripHTMLText(htmlStr) {
  if (!htmlStr) return ''
  let text = htmlStr.replace(/<br\s*\/?>/gi, ' ').replace(/<\/p>/gi, ' ')
  text = text.replace(/<[^>]*>?/gm, '')
  text = text.replace(/&nbsp;/g, ' ')
  return text.trim().replace(/\s+/g, ' ')
}

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
  router.replace({ path: '/regional_insight', query: next })
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
  link.download = `regional-insight-${selectedData.value}.png`
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
  display: block;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.viz-sidebar {
  display: none;
}

.viz-main {
  min-width: 0;
}

.top-filter-container {
  position: relative;
  z-index: 1000;
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
  flex-direction: row;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.region-filter {
  flex: 1;
  min-width: 200px;
}

.dataset-filter {
  flex: 2;
  min-width: 300px;
}

.chart-type-filter {
  flex-shrink: 0;
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
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 0.5rem;
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
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 6px;
    background: white;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    width: fit-content;
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
  height: 500px;
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
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* NEWS SECTION */
.section-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.btn-link-all {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-link-all:hover {
  color: var(--primary-hover);
  transform: translateX(4px);
}

.news-mini-card {
  background: white;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  cursor: pointer;
}

.news-mini-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
  box-shadow: 0 20px 40px -10px rgba(217, 119, 6, 0.15);
}

.nm-img-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nm-placeholder {
  font-size: 3rem;
  color: #d97706;
  opacity: 0.3;
}

.nm-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.news-mini-card:hover .nm-img {
  transform: scale(1.05);
}

.nm-date-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 100px;
}

.nm-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.nm-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.45;
  transition: color 0.2s ease;
}

.news-mini-card:hover .nm-title {
  color: var(--primary-color);
}

.nm-excerpt {
  font-size: 0.925rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nm-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.news-mini-card:hover .detail-label {
  color: var(--primary-hover);
}

.news-mini-card:hover .bi-arrow-right {
  transform: translateX(5px);
}

.page-count-badge {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-control-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  transition: all 0.2s ease;
}

.carousel-control-prev:hover .carousel-control-icon,
.carousel-control-next:hover .carousel-control-icon {
  background: var(--primary-color);
  transform: scale(1.1);
}

.carousel-indicators-custom {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 16px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  z-index: 10;
}

.analysis-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
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
  .filter-fields {
    gap: 1rem;
  }

  .region-filter, .dataset-filter {
    flex: 1 1 100%;
    min-width: 100%;
  }

  .chart-type-filter {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
  }

  .chart-type-toggle {
    width: 100%;
    justify-content: space-between;
  }

  .type-btn {
    flex: 1;
  }
}


@media (max-width: 768px) {
  .hero-v2-title {
    font-size: 2.25rem;
    line-height: 1.2;
    margin-bottom: 0.75rem !important;
  }
  .hero-v2-subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.5rem !important;
    line-height: 1.5;
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
    gap: 1rem;
  }
  .filter-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .filter-group:last-child {
    grid-column: 1;
  }
  .chart-type-toggle {
    display: flex !important;
    flex-wrap: nowrap !important;
    gap: 6px;
    padding: 4px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    width: fit-content;
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
    padding: 1.25rem 1rem;
    border-radius: 16px;
  }
  .chart-title {
    font-size: 1.25rem;
    line-height: 1.4;
    word-break: break-word;
  }
  .chart-body {
    min-height: 360px;
    padding: 10px 5px;
  }
  .chart-canvas-wrapper {
    height: 360px;
  }
  .btn-download-chart {
    width: 100%;
    justify-content: center;
    padding: 10px 16px !important;
    font-size: 0.75rem;
    border-radius: 10px;
  }
  .badge-satuan {
    display: inline-block;
    width: auto;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .hero-v2-title {
    font-size: 2rem;
  }
  .glass-filter-card {
    padding: 1.25rem 1rem;
  }
}
</style>
