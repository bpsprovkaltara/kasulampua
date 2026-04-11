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
            <!-- Row 1: Regional Filter -->
            <div class="filter-row">
              <div class="filter-row-label">
                <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
                <span>Wilayah</span>
              </div>
              <div class="region-tabs" role="group" aria-label="Pilih wilayah regional">
                <button
                  v-for="region in opsiWilayah"
                  :key="region.val"
                  type="button"
                  :class="['region-tab', { active: selectedRegion === region.val }]"
                  :style="{ '--region-color': region.color }"
                  :aria-pressed="selectedRegion === region.val"
                  @click="selectedRegion = region.val"
                >
                  <span class="tab-name">{{ region.label }}</span>
                </button>
              </div>
            </div>

            <div class="filter-divider"></div>

            <!-- Row 2: Dataset + Chart Type -->
            <div class="filter-row bottom-row">
              <div class="bottom-field-label">
                <i class="bi bi-database-fill" aria-hidden="true"></i>
                <span>Dataset</span>
              </div>
              <div class="dataset-field">
                <Multiselect
                  v-model="selectedData"
                  :options="dataOptions"
                  :search="true"
                  label="label"
                  track-by="value"
                  placeholder="Pilih Dataset"
                  append-to-body
                  close-on-scroll
                  :classes="regionalInsightMultiselectClasses"
                  class="custom-multiselect"
                />
              </div>

              <div class="bottom-field-sep" aria-hidden="true"></div>

              <div class="bottom-field-label">
                <i class="bi bi-bar-chart-fill" aria-hidden="true"></i>
                <span>Tipe Grafik</span>
              </div>
              <div class="charttype-field">
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
                    <span class="type-btn-label">{{ type.label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <template v-if="showTurvarFilter || periodOptions.length > 1">
              <div class="filter-divider"></div>
              <div class="filter-row bottom-row filter-row-dimensions">
                <template v-if="showTurvarFilter">
                  <div class="bottom-field-label">
                    <i class="bi bi-layers-fill" aria-hidden="true"></i>
                    <span>Turvar</span>
                  </div>
                  <div class="turvar-field">
                    <select
                      v-model="selectedTurvar"
                      class="form-select form-select-sm turvar-select"
                      aria-label="Pilih turvar"
                    >
                      <option v-for="opt in turvarOptions" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                  </div>
                  <div class="bottom-field-sep" aria-hidden="true"></div>
                </template>

                <template v-if="periodOptions.length > 1">
                  <div class="bottom-field-label">
                    <i class="bi bi-calendar3-fill" aria-hidden="true"></i>
                    <span>Periode</span>
                  </div>
                  <div class="tahun-slider-field">
                    <button
                      type="button"
                      class="play-btn"
                      :class="{ active: isPlaying }"
                      :aria-label="isPlaying ? 'Jeda animasi periode' : 'Putar animasi periode'"
                      :title="isPlaying ? 'Jeda' : 'Putar'"
                      @click="togglePlay"
                    >
                      <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'" aria-hidden="true"></i>
                    </button>
                    <input
                      v-model.number="selectedPeriodIndex"
                      type="range"
                      class="tahun-range form-range"
                      :min="0"
                      :max="Math.max(0, periodOptions.length - 1)"
                      :aria-valuemin="0"
                      :aria-valuemax="Math.max(0, periodOptions.length - 1)"
                      :aria-valuenow="selectedPeriodIndex"
                      :aria-valuetext="selectedPeriod?.label || ''"
                      aria-label="Pilih periode"
                    />
                    <span class="tahun-label text-truncate">{{ selectedPeriod?.label || '—' }}</span>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>

        <div class="chart-container-card fade-in-up">
          <div class="chart-header-row">
            <div class="chart-header-text">
              <h3 class="chart-title">{{ chartTitleDisplay }}</h3>
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
                 :title="chartTitleDisplay"
                 :region="selectedRegion"
              />
            </div>
          </div>
        </div>

        <!-- ANALISIS SECTION LAMA (DISEMBUNYIKAN — jangan hapus)
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
        -->

        <div class="insight-news-section mt-5 fade-in-up" style="animation-delay: 0.2s">
          <div class="section-header mb-4">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h2 class="section-title">Analisis Terkait</h2>
                <p class="text-muted small mb-0">
                  Dokumen analisis PDRB Kasulampua dan infografis wilayah
                </p>
              </div>
            </div>
          </div>

          <div class="row g-4 align-items-stretch analisis-terkait-split">
            <div class="col-12 col-lg-7 analisis-pdf-column">
              <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 analisis-pdf-card">
                <div class="card-body p-4 d-flex flex-column flex-grow-1 analisis-pdf-card-body">
                  <div class="d-flex align-items-center gap-2 mb-3 flex-shrink-0">
                    <i class="bi bi-file-earmark-pdf text-danger fs-4" aria-hidden="true"></i>
                    <h3 class="h5 mb-0 fw-bold">Dokumen Analisis</h3>
                  </div>
                  <p class="text-muted small mb-3 flex-shrink-0">
                    Analisis PDRB KASULAMPUA (PDF). Gunakan pratinjau di bawah atau unduh untuk dibaca penuh.
                  </p>
                  <div class="analisis-pdf-frame mb-3">
                    <iframe
                      :src="analisisPdfEmbedSrc"
                      class="analisis-pdf-iframe rounded-3 bg-light"
                      title="Analisis PDRB KASULAMPUA"
                    />
                  </div>
                  <a
                    :href="analisisPdfUrl"
                    class="btn btn-outline-primary rounded-pill align-self-start flex-shrink-0"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i class="bi bi-download me-2" aria-hidden="true"></i>
                    Unduh dokumen
                  </a>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-5">
              <div class="d-flex flex-column h-100">
                <div class="mb-3">
                  <h3 class="h5 fw-bold mb-1">Infografis</h3>
                  <p class="text-muted small mb-0">Klik kartu untuk memperbesar</p>
                </div>
                <div class="row g-3 flex-grow-1 analisis-infografis-grid">
                  <div
                    v-for="item in analisisInfografisItems"
                    :key="item.id"
                    class="col-12 col-sm-6"
                  >
                    <button
                      type="button"
                      class="btn p-0 border-0 bg-transparent w-100 text-start analisis-infografis-card"
                      @click="openInfografisLightbox(item)"
                    >
                      <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div class="ratio ratio-4x3 bg-light">
                          <img
                            :src="item.src"
                            :alt="item.alt"
                            class="object-fit-cover w-100 h-100"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div class="card-body py-3 px-3">
                          <span class="fw-semibold">{{ item.title }}</span>
                          <span class="detail-label small d-block mt-1">
                            Perbesar <i class="bi bi-arrows-fullscreen ms-1" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="analisisInfografisModal"
          tabindex="-1"
          aria-labelledby="analisisInfografisModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-sm-down">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div class="modal-header border-0">
                <h5 id="analisisInfografisModalLabel" class="modal-title fw-bold">
                  {{ infografisLightbox.title }}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Tutup"
                ></button>
              </div>
              <div class="modal-body p-0 bg-dark">
                <img
                  v-if="infografisLightbox.src"
                  :src="infografisLightbox.src"
                  :alt="infografisLightbox.alt"
                  class="img-fluid w-100 d-block"
                />
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
import { onMounted, onBeforeUnmount, ref, reactive, watch, computed, nextTick } from 'vue'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import MapVisualisasi from '../components/MapVisualisasi.vue'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { Chart } from 'chart.js/auto'
import { Modal } from 'bootstrap'
import { CKAN_FILE_BASE_URL, CKAN_ACTION_API } from '@/config/api'
import { useDatasetStore } from '@/composables/useDatasetStore'
import { parseJsonResource } from '@/utils/parseCkanResourceJson'
import { buildOrganizationFilterQuery } from '@/utils/ckanPackageSearchFilters'
import { parsePeriodSortKey } from '@/utils/jsonDatasetChart'

/** Dropdown di-teleport ke `body`; kelas ini distyling lewat blok CSS non-scoped di bawah. */
const regionalInsightMultiselectClasses = {
  dropdown: 'multiselect-dropdown regional-insight-ms-dropdown',
}

// ─── Dataset store (organisasi CKAN) ────────────────────────────────────────
const store = useDatasetStore()

const selectedRegion = ref('kasulampua')
const selectedData = ref('')
const dataOptions = ref([])
const allDatasetOptions = ref([])
const chartRef = ref(null)
let chartInstance = null
let playTimer = null

const route = useRoute()
const router = useRouter()
const loading = ref(true)

/** URL statis PDF analisis (file di `public/assets/`) — tanpa hash, untuk unduh / tab baru */
const analisisPdfUrl = encodeURI('/assets/Analisis PDRB KASULAMPUA.docx.pdf')

/**
 * Embed: toolbar/nav pane disembunyikan bila viewer mendukung PDF Open Parameters.
 * `view=FitH,0` = zoom mengikuti lebar penuh iframe; koordinat atas0 = jendela tampilan
 * mulai dari puncak halaman (scroll vertikal default ke atas).
 */
const analisisPdfEmbedSrc = `${analisisPdfUrl}#toolbar=0&navpanes=0&scrollbar=1&page=1&view=FitH%2C0`

/** Empat wilayah KASULAMPUA — ganti file MALUKU/PAPUA jika infografis final sudah ada */
const analisisInfografisItems = [
  {
    id: 'kalimantan',
    title: 'Kalimantan',
    src: '/assets/images/insight/KALIMANTAN.png',
    alt: 'Infografis analisis Kalimantan',
  },
  {
    id: 'sulawesi',
    title: 'Sulawesi',
    src: '/assets/images/insight/SULAWESI.png',
    alt: 'Infografis analisis Sulawesi',
  },
  {
    id: 'maluku',
    title: 'Maluku',
    src: '/assets/images/insight/MALUKU.png',
    alt: 'Infografis analisis Maluku',
  },
  {
    id: 'papua',
    title: 'Papua',
    src: '/assets/images/insight/PAPUA.png',
    alt: 'Infografis analisis Papua',
  },
]

const infografisLightbox = ref({ title: '', src: '', alt: '' })
let infografisBsModal = null

async function openInfografisLightbox(item) {
  infografisLightbox.value = { title: item.title, src: item.src, alt: item.alt }
  await nextTick()
  const el = document.getElementById('analisisInfografisModal')
  if (!el) return
  if (!infografisBsModal) infografisBsModal = Modal.getOrCreateInstance(el)
  infografisBsModal.show()
}

/* Dipakai kembali saat section analisis card diaktifkan (template HTML di atas masih ada).
 * Tambahkan kembali: import { formatLongDate } from '../utils/dates'
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
function stripHTMLText(htmlStr) {
  if (!htmlStr) return ''
  let text = htmlStr.replace(/<br\s*\/?>/gi, ' ').replace(/<\/p>/gi, ' ')
  text = text.replace(/<[^>]*>?/gm, '')
  text = text.replace(/&nbsp;/g, ' ')
  return text.trim().replace(/\s+/g, ' ')
}
*/

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
  // { id: 'line', label: 'Garis', icon: 'bi bi-graph-up' },
  { id: 'map', label: 'Peta', icon: 'bi bi-globe-asia-australia' },
  { id: 'doughnut', label: 'Lingkaran', icon: 'bi bi-pie-chart-fill' },
]

const opsiWilayah = ref([
  { val: 'kasulampua', label: 'Kasulampua', color: '#d97706' },
  { val: 'kalimantan',  label: 'Kalimantan',  color: '#16a34a' },
  { val: 'sulawesi',   label: 'Sulawesi',    color: '#dc2626' },
  { val: 'maluku',     label: 'Maluku',      color: '#2563eb' },
  { val: 'papua',      label: 'Papua',       color: '#ca8a04' },
])

/** Kode wilayah BPS provinsi per tab (filter klien pada vervar setelah data Kasulampua dimuat). */
const PROVINCE_IDS_BY_REGION = {
  kasulampua: [
    6100, 6200, 6300, 6400, 6500, 7100, 7200, 7300, 7400, 7500, 7600, 8100, 8200, 9100, 9200, 9300, 9400, 9500,
    9600,
  ],
  kalimantan: [6100, 6200, 6300, 6400, 6500],
  sulawesi: [7100, 7200, 7300, 7400, 7500, 7600],
  maluku: [8100, 8200],
  papua: [9100, 9200, 9300, 9400, 9500, 9600],
}

function getAllowedProvinceIdsForRegion(regionVal) {
  return PROVINCE_IDS_BY_REGION[regionVal] || PROVINCE_IDS_BY_REGION.kasulampua
}

/**
 * Petakan entri `wilayahRegions` ke tab agregat (hanya dipakai untuk mengenali org Kasulampua di CKAN).
 */
function regionalTabForWilayahEntry(w) {
  const label = String(w.label || '').trim()
  if (!label) return ''
  if (label === 'Kasulampua') return 'kasulampua'
  if (label.startsWith('Kalimantan')) return 'kalimantan'
  if (label.startsWith('Sulawesi') || label === 'Gorontalo') return 'sulawesi'
  if (label.startsWith('Maluku')) return 'maluku'
  if (label.includes('Papua')) return 'papua'
  return ''
}

/** Slug organization CKAN untuk dataset pusat / agregat Kasulampua saja. */
function getKasulampuaOrganizationSlugs() {
  return (store.wilayahRegions.value || [])
    .filter((w) => regionalTabForWilayahEntry(w) === 'kasulampua')
    .map((w) => w.id)
}

/** Dataset mentah setelah fetch (filter Kasulampua); dimensi turvar/periode diolah di updateData */
const rawDataset = ref(null)

const selectedTurvar = ref('')
const selectedPeriodIndex = ref(0)
const isPlaying = ref(false)

const state = reactive({
  satuan: '',
  labels: [],
  dataValues: [],
  judul: '',
})

/** Huruf pertama tiap kata (setelah awal string, spasi, atau tanda pemisah umum) jadi huruf besar. */
function capitalizeChartTitle(text) {
  if (text == null || text === '') return ''
  return String(text).replace(/(^|[\s\u2013\u2014–—\-/()])(\S)/g, (_, sep, ch) => sep + ch.toLocaleUpperCase('id-ID'))
}

const chartTitleDisplay = computed(() => capitalizeChartTitle(state.judul || 'Tidak tersedia'))

function buildCompositePeriodLabel(tahunVal, subYearVal) {
  const tahun = String(tahunVal ?? '').trim()
  const sub = String(subYearVal ?? '').trim()
  if (!sub) return tahun
  if (!tahun) return sub
  if (/\d{4}/.test(sub)) return sub
  return `${sub} ${tahun}`
}

const turvarOptions = computed(() => {
  const ds = rawDataset.value
  if (!ds?.turvarKey || !ds.allRows?.length) return []
  const key = ds.turvarKey
  const uniq = new Set()
  for (const row of ds.allRows) {
    const s = String(row[key] ?? '').trim()
    if (s && s.toLowerCase() !== 'tidak ada') uniq.add(s)
  }
  return [...uniq].sort((a, b) => a.localeCompare(b, 'id'))
})

const showTurvarFilter = computed(() => turvarOptions.value.length > 1)

const periodOptions = computed(() => {
  const ds = rawDataset.value
  if (!ds?.allRows?.length) return []

  const { allRows, tahunKey, turtahunKey, periodSingleKey } = ds

  if (tahunKey && turtahunKey) {
    const uniq = new Map()
    for (const row of allRows) {
      const tv = String(row[tahunKey] ?? '').trim()
      const tt = String(row[turtahunKey] ?? '').trim()
      if (!tv && !tt) continue
      const label = buildCompositePeriodLabel(tv, tt)
      const key = `${tv}\t${tt}`
      if (!uniq.has(key)) uniq.set(key, { tahunVal: tv, turtahunVal: tt, label })
    }
    const arr = [...uniq.values()]
    arr.sort((a, b) => {
      const skA = parsePeriodSortKey(a.label)
      const skB = parsePeriodSortKey(b.label)
      const fa = Number.isFinite(skA) && !Number.isNaN(skA)
      const fb = Number.isFinite(skB) && !Number.isNaN(skB)
      if (fa && fb && skA !== skB) return skA - skB
      if (fa && !fb) return -1
      if (!fa && fb) return 1
      return a.label.localeCompare(b.label, 'id')
    })
    return arr
  }

  if (tahunKey) {
    const uniq = new Set()
    for (const row of allRows) {
      const tv = String(row[tahunKey] ?? '').trim()
      if (tv) uniq.add(tv)
    }
    return [...uniq]
      .sort((a, b) => {
        const skA = parsePeriodSortKey(a)
        const skB = parsePeriodSortKey(b)
        const fa = Number.isFinite(skA) && !Number.isNaN(skA)
        const fb = Number.isFinite(skB) && !Number.isNaN(skB)
        if (fa && fb && skA !== skB) return skA - skB
        if (fa && !fb) return -1
        if (!fa && fb) return 1
        return a.localeCompare(b, 'id')
      })
      .map((tv) => ({ tahunVal: tv, turtahunVal: '', label: tv }))
  }

  if (turtahunKey) {
    const uniq = new Set()
    for (const row of allRows) {
      const tt = String(row[turtahunKey] ?? '').trim()
      if (tt) uniq.add(tt)
    }
    return [...uniq]
      .sort((a, b) => a.localeCompare(b, 'id'))
      .map((tt) => ({ tahunVal: '', turtahunVal: tt, label: tt }))
  }

  if (periodSingleKey) {
    const uniq = new Set()
    for (const row of allRows) {
      const p = String(row[periodSingleKey] ?? '').trim()
      if (p) uniq.add(p)
    }
    return [...uniq]
      .sort((a, b) => {
        const skA = parsePeriodSortKey(a)
        const skB = parsePeriodSortKey(b)
        const fa = Number.isFinite(skA) && !Number.isNaN(skA)
        const fb = Number.isFinite(skB) && !Number.isNaN(skB)
        if (fa && fb && skA !== skB) return skA - skB
        if (fa && !fb) return -1
        if (!fa && fb) return 1
        return a.localeCompare(b, 'id')
      })
      .map((label) => ({ tahunVal: '', turtahunVal: '', label, singleVal: label }))
  }

  return []
})

const selectedPeriod = computed(() => {
  const opts = periodOptions.value
  const i = selectedPeriodIndex.value
  if (!opts.length || i < 0 || i >= opts.length) return null
  return opts[i]
})

function stopPlay() {
  isPlaying.value = false
  if (playTimer != null) {
    clearInterval(playTimer)
    playTimer = null
  }
}

function togglePlay() {
  if (periodOptions.value.length <= 1) return
  if (isPlaying.value) {
    stopPlay()
    return
  }
  stopPlay()
  isPlaying.value = true
  playTimer = setInterval(() => {
    const n = periodOptions.value.length
    if (n <= 1) {
      stopPlay()
      return
    }
    if (selectedPeriodIndex.value < n - 1) {
      selectedPeriodIndex.value++
    } else {
      selectedPeriodIndex.value = 0
    }
  }, 800)
}

/**
 * Fetch dataset JSON dari CKAN — selalu organisasi Kasulampua (pusat), bukan per tab regional.
 */
const fetchDataset = async () => {
  try {
    const params = new URLSearchParams()
    params.set('rows', '100')
    params.set('q', '*:*')

    const orgSlugs = getKasulampuaOrganizationSlugs()
    const orgFq = buildOrganizationFilterQuery(orgSlugs)
    if (!orgFq) {
      console.warn('RegionalInsight: tidak ada organization CKAN untuk Kasulampua (pusat)')
      allDatasetOptions.value = []
      dataOptions.value = []
      selectedData.value = ''
      return
    }

    params.set('fq', ['res_format:JSON', orgFq].join(' AND '))

    const res = await fetch(`${CKAN_ACTION_API.PACKAGE_SEARCH}?${params.toString()}`)
    const data = await res.json()

    if (data.success && data.result?.results) {
      const seen = new Set()
      allDatasetOptions.value = data.result.results
        .map((pkg) => {
          const jsonRes = (pkg.resources || []).find(
            (r) => String(r.format || '').toLowerCase() === 'json'
          )
          return {
            value: jsonRes ? jsonRes.id : pkg.id,
            label: pkg.title || pkg.name || 'Dataset tanpa judul',
            orgSlug: pkg.organization?.name || '',
          }
        })
        .filter((d) => {
          if (!d.value || seen.has(d.value)) return false
          seen.add(d.value)
          return true
        })
    } else {
      allDatasetOptions.value = []
    }

    // Isi dataOptions langsung dari allDatasetOptions (sudah terfilter server-side)
    dataOptions.value = allDatasetOptions.value.map((d) => ({
      value: d.value,
      label: d.label,
    }))

    const stillValid = dataOptions.value.some((opt) => opt.value === selectedData.value)
    if (!stillValid) {
      selectedData.value = dataOptions.value[0]?.value || ''
    }
  } catch (error) {
    console.error('Gagal mengambil dataset regional:', error)
    allDatasetOptions.value = []
    dataOptions.value = []
    selectedData.value = ''
  }
}

const fetchData = async () => {
  if (!selectedData.value) return

  stopPlay()
  loading.value = true
  try {
    const resourceId = selectedData.value
    let url = `${CKAN_FILE_BASE_URL}/resource/${resourceId}/download/data.json`

    try {
      const resInfo = await fetch(`${CKAN_ACTION_API.RESOURCE_SHOW}?id=${resourceId}`).then((r) => r.json())
      if (resInfo.success && resInfo.result?.url) {
        url = resInfo.result.url
        if (url.includes('data.kasulampua.id')) {
          url = url.replace(/https?:\/\/data\.kasulampua\.id/g, CKAN_FILE_BASE_URL)
        }
      }
    } catch (e) {
      console.warn('Gagal mengambil info resource, menggunakan fallback URL', e)
    }

    const res = await fetch(url)
    if (!res.ok) throw new Error('Gagal mengunduh data dataset')

    const json = await res.json()
    const { cols, rows } = parseJsonResource(json)

    if (!rows.length || !cols.length) {
      throw new Error('Format dataset tidak didukung atau data kosong')
    }

    const regionCol =
      cols.find((c) => String(c).toLowerCase() === 'vervar_label') || cols[0]
    const valueCol =
      cols.find((c) => {
        const low = String(c).toLowerCase()
        return (
          low === 'nilai' ||
          low === 'value' ||
          low === 'jumlah' ||
          low.includes('produksi') ||
          low.includes('persentase')
        )
      }) || cols[cols.length - 1]

    const turvarKey = cols.find((c) => String(c).toLowerCase() === 'turvar_label') || null
    const tahunKey =
      cols.find((c) => {
        const l = String(c).toLowerCase()
        return l === 'tahun' || l === 'th'
      }) || null
    const turtahunKey =
      cols.find((c) => {
        const l = String(c).toLowerCase()
        return ['turtahun', 'bulan', 'triwulan', 'semester'].includes(l)
      }) || null

    let periodSingleKey = null
    if (!tahunKey && !turtahunKey) {
      periodSingleKey =
        cols.find((c) => {
          const l = String(c).toLowerCase()
          return (l === 'periode' || l === 'turtahun') && c !== regionCol && c !== valueCol && c !== turvarKey
        }) || null
    }

    const KASULAMPUA_MAP = {
      'KALIMANTAN BARAT': 6100,
      'KALIMANTAN TENGAH': 6200,
      'KALIMANTAN SELATAN': 6300,
      'KALIMANTAN TIMUR': 6400,
      'KALIMANTAN UTARA': 6500,
      'SULAWESI UTARA': 7100,
      'SULAWESI TENGAH': 7200,
      'SULAWESI SELATAN': 7300,
      'SULAWESI TENGGARA': 7400,
      GORONTALO: 7500,
      'SULAWESI BARAT': 7600,
      MALUKU: 8100,
      'MALUKU UTARA': 8200,
      'PAPUA BARAT': 9100,
      PAPUA: 9200,
      'PAPUA TENGAH': 9300,
      'PAPUA PEGUNUNGAN': 9400,
      'PAPUA SELATAN': 9500,
      'PAPUA BARAT DAYA': 9600,
    }

    const KASULAMPUA_IDS = Object.values(KASULAMPUA_MAP)

    const filteredRows = rows.filter((row) => {
      const regionVal = String(row[regionCol] || '')
        .trim()
        .toUpperCase()
      const regionId = parseInt(regionVal, 10)

      if (!Number.isNaN(regionId)) {
        if (KASULAMPUA_IDS.includes(regionId)) return true
        if (KASULAMPUA_IDS.includes(regionId * 100)) return true
        if (KASULAMPUA_IDS.includes(Math.floor(regionId / 100) * 100)) return true
      }

      if (KASULAMPUA_MAP[regionVal]) return true

      return Object.keys(KASULAMPUA_MAP).some(
        (pName) => pName.includes(regionVal) || regionVal.includes(pName)
      )
    })

    if (!filteredRows.length) {
      throw new Error('Data wilayah Kasulampua tidak ditemukan di dataset ini')
    }

    const title = json.variable?.title || json.metadata?.label || 'Visualisasi Data'
    const unit = json.variable?.unit || json.metadata?.unit || 'Satuan'

    rawDataset.value = {
      allRows: filteredRows,
      regionCol,
      valueCol,
      turvarKey,
      tahunKey,
      turtahunKey,
      periodSingleKey,
      title,
      unit,
      KASULAMPUA_MAP,
    }

    await nextTick()
    selectedTurvar.value = turvarOptions.value[0] ?? ''
    selectedPeriodIndex.value = Math.max(0, periodOptions.value.length - 1)

    await updateData()
  } catch (err) {
    console.error(`Gagal mengambil data real: ${err}`)
    rawDataset.value = null
    state.judul = 'Dataset tidak kompatibel atau Wilayah tidak cocok'
    state.labels = []
    state.dataValues = []
    loading.value = false
  }
}

const updateData = async () => {
  if (!rawDataset.value) return

  await nextTick()

  const ds = rawDataset.value
  const {
    allRows,
    regionCol,
    valueCol,
    turvarKey,
    tahunKey,
    turtahunKey,
    periodSingleKey,
    title,
    unit,
    KASULAMPUA_MAP,
  } = ds

  let rows = allRows

  if (turvarKey && selectedTurvar.value) {
    rows = rows.filter((r) => String(r[turvarKey] ?? '').trim() === selectedTurvar.value)
  }

  const period = selectedPeriod.value
  if (period && tahunKey) {
    if (turtahunKey) {
      rows = rows.filter(
        (r) =>
          String(r[tahunKey] ?? '').trim() === period.tahunVal &&
          String(r[turtahunKey] ?? '').trim() === period.turtahunVal
      )
    } else {
      rows = rows.filter((r) => String(r[tahunKey] ?? '').trim() === period.tahunVal)
    }
  } else if (period && turtahunKey && !tahunKey) {
    rows = rows.filter((r) => String(r[turtahunKey] ?? '').trim() === period.turtahunVal)
  } else if (period && periodSingleKey) {
    rows = rows.filter((r) => String(r[periodSingleKey] ?? '').trim() === period.label)
  }

  const KASULAMPUA_IDS = Object.values(KASULAMPUA_MAP)
  const allowedIds = getAllowedProvinceIdsForRegion(selectedRegion.value)
  const allowedSet = new Set(allowedIds)

  const normalizedVervars = []
  const dataValues = []
  const processedProvs = new Set()

  for (const row of rows) {
    const regionVal = String(row[regionCol]).trim().toUpperCase()
    let regionId = parseInt(regionVal, 10)

    if (Number.isNaN(regionId) || !KASULAMPUA_IDS.includes(regionId * (regionId < 100 ? 100 : 1))) {
      regionId =
        KASULAMPUA_MAP[regionVal] ||
        Object.keys(KASULAMPUA_MAP).find((k) => regionVal.includes(k) || k.includes(regionVal))
      if (typeof regionId === 'string') regionId = KASULAMPUA_MAP[regionId]
    } else {
      if (regionId < 100) regionId *= 100
      else if (regionId > 10000) regionId = Math.floor(regionId / 100) * 100
    }

    if (!regionId || !allowedSet.has(regionId)) continue

    if (!processedProvs.has(regionId)) {
      processedProvs.add(regionId)
      normalizedVervars.push({ val: regionId, label: row[regionCol] })
      const rawVal = row[valueCol]
      let num = parseFloat(rawVal)
      if (Number.isNaN(num) && rawVal != null && String(rawVal).includes(',')) {
        num = parseFloat(String(rawVal).replace(/\./g, '').replace(',', '.')) || 0
      }
      dataValues.push(Number.isFinite(num) ? num : 0)
    }
  }

  state.satuan = unit
  const periodLabel = period?.label
  const baseTitle = periodLabel ? `${title} — ${periodLabel}` : title

  if (!normalizedVervars.length) {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    state.labels = []
    state.dataValues = []
    state.judul = `${baseTitle} — Tidak ada data provinsi untuk wilayah ini pada filter terpilih`
    loading.value = false
    await nextTick()
    return
  }

  state.labels = normalizedVervars.map((v) => v.label)
  state.dataValues = dataValues
  state.judul = baseTitle

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
  syncFromRoute()
  await store.fetchAllData()
  await fetchDataset()
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
    await fetchDataset()
    if (selectedData.value) {
      loading.value = true
      await fetchData()
    }
  },
  { deep: true }
)

watch(periodOptions, (opts) => {
  if (selectedPeriodIndex.value >= opts.length) {
    selectedPeriodIndex.value = Math.max(0, opts.length - 1)
  }
})

watch([selectedTurvar, selectedPeriodIndex], () => {
  if (isBootstrapping) return
  updateData()
})

watch(selectedRegion, () => {
  if (isBootstrapping) return
  updateData()
  pushQueryFromState()
})

watch(selectedChartType, () => {
  if (isBootstrapping) return
  updateData()
  pushQueryFromState()
})

watch([selectedData], () => {
  if (isBootstrapping) return
  stopPlay()
  loading.value = true
  fetchData()
  pushQueryFromState()
})

onBeforeUnmount(() => {
  stopPlay()
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

/* Dokumen PDF: tinggi mengisi sisa viewport hingga bawah; iframe mengisi kontainer */
.analisis-pdf-card-body {
  min-height: 0;
}

.analisis-pdf-frame {
  position: relative;
  flex: 1 1 auto;
  min-height: 280px;
  width: 100%;
}

.analisis-pdf-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

@media (min-width: 992px) {
  .analisis-terkait-split .analisis-pdf-card {
    min-height: calc(100svh - 9rem);
  }

  .analisis-terkait-split .analisis-pdf-card-body {
    flex: 1 1 auto;
    min-height: 0;
  }

  .analisis-terkait-split .analisis-pdf-frame {
    min-height: 0;
    flex: 1 1 0;
  }
}

@media (max-width: 991.98px) {
  .analisis-pdf-frame {
    min-height: 72vh;
  }
}

.top-filter-container {
  position: relative;
  z-index: 1000;
}

.glass-filter-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(217, 119, 6, 0.18);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px -4px rgba(217, 119, 6, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* ── Filter Rows ── */
.filter-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.5rem;
  flex-wrap: wrap;
}

.filter-row.bottom-row {
  align-items: center;
  gap: 0.75rem;
  flex-wrap: nowrap;
}

.bottom-field-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.63rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.bottom-field-sep {
  width: 1px;
  height: 28px;
  background: #e2e8f0;
  flex-shrink: 0;
}

.filter-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(217, 119, 6, 0.12), transparent);
  margin: 0 1.5rem;
}

.filter-row-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 5.5rem;
}

.dataset-field {
  flex: 1 1 0;
  min-width: 0;
}

.charttype-field {
  flex-shrink: 0;
}

.filter-row-dimensions {
  flex-wrap: wrap;
  gap: 0.75rem;
}

.turvar-field {
  flex: 0 1 14rem;
  min-width: 8rem;
}

.turvar-select {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  font-size: 0.85rem;
  max-width: 100%;
}

.tahun-slider-field {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 0;
  min-width: 0;
}

.play-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-btn:hover,
.play-btn.active {
  background: white;
  color: var(--primary-color);
  border-color: var(--amber-600, #d97706);
}

.tahun-range {
  flex: 1 1 0;
  min-width: 4rem;
  accent-color: var(--primary-color, #d97706);
}

.tahun-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
  max-width: 12rem;
  flex-shrink: 0;
}

/* ── Region Tabs ── */
.region-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}

.region-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  user-select: none;
  line-height: 1;
}

.region-tab:hover:not(.active) {
  background: color-mix(in srgb, var(--region-color) 10%, white);
  border-color: color-mix(in srgb, var(--region-color) 40%, transparent);
  color: var(--region-color);
  transform: translateY(-1px);
}

.region-tab.active {
  background: var(--region-color);
  border-color: var(--region-color);
  color: white;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--region-color) 30%, transparent);
}

.tab-name {
  font-weight: 700;
}

/* ── Chart Type Toggle ── */
.chart-type-toggle {
  display: flex;
  flex-wrap: nowrap;
  gap: 3px;
  padding: 4px;
  background: #f1f5f9;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1;
}

.type-btn-label {
  font-size: 0.78rem;
}

.type-btn:hover:not(.active) {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.type-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.15);
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
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
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
  --ms-max-height: min(55vh, 18rem);
  --ms-ring-color: rgba(217, 119, 6, 0.1);
  --ms-option-bg-selected: var(--primary-color);
  --ms-option-bg-selected-pointed: var(--primary-hover);
}

:deep(.custom-multiselect.is-active) {
  border-color: var(--primary-color);
}

@media (max-width: 991px) {
  .filter-row {
    padding: 1rem;
    gap: 0.75rem;
  }

  .filter-row.bottom-row {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .bottom-field-sep {
    display: none;
  }

  .bottom-field-label {
    flex-basis: 100%;
    margin-bottom: -4px;
  }

  .region-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }

  .region-tabs::-webkit-scrollbar {
    display: none;
  }

  .dataset-field {
    flex: 1 1 100%;
  }

  .filter-row-dimensions .turvar-field {
    flex: 1 1 100%;
  }

  .filter-row-dimensions .tahun-slider-field {
    flex: 1 1 100%;
  }

  .tahun-label {
    max-width: 100%;
  }

  .charttype-field {
    flex: 1 1 100%;
  }

  .chart-type-toggle {
    width: 100%;
  }

  .type-btn {
    flex: 1;
    justify-content: center;
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
  .filter-row {
    padding: 0.875rem 1rem;
    gap: 0.625rem;
  }
  .region-tabs {
    width: 100%;
  }
  .type-btn-label {
    display: none;
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
}
</style>

<style>
/**
 * Dataset Multiselect — daftar opsi di-teleport ke body (append-to-body).
 * Scoped CSS tidak berlaku di sini; pertahankan token visual selaras dengan .custom-multiselect.
 */
.regional-insight-ms-dropdown.multiselect-dropdown:not(.is-hidden) {
  z-index: 5000;
  --ms-dropdown-bg: #fff;
  --ms-dropdown-border-color: var(--border-color, #e2e8f0);
  --ms-dropdown-radius: 12px;
  --ms-max-height: min(55vh, 18rem);
  --ms-font-size: 0.9rem;
  --ms-option-bg-selected: var(--primary-color, #d97706);
  --ms-option-bg-selected-pointed: var(--primary-hover, #b45309);
  --ms-option-bg-pointed: #f8fafc;
  --ms-empty-color: #64748b;
  box-shadow:
    0 18px 48px -12px rgba(15, 23, 42, 0.18),
    0 8px 20px -8px rgba(217, 119, 6, 0.12);
  border-color: rgba(217, 119, 6, 0.2);
}
</style>
