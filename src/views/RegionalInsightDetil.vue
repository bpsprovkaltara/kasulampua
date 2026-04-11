<template>
  <Navbar />

  <div
    class="insight-hero"
    :style="state.insight?.image ? `background-image: url('${imgUrl(state.insight.image)}')` : ''"
  >
    <div class="insight-hero-overlay"></div>
    <div class="container insight-hero-content">
      <nav class="insight-breadcrumb mb-4">
        <router-link to="/" class="bc-link">Beranda</router-link>
        <span class="bc-sep"><i class="bi bi-chevron-right"></i></span>
        <router-link to="/regional_insight" class="bc-link">Regional Insight</router-link>
        <span class="bc-sep"><i class="bi bi-chevron-right"></i></span>
        <span class="bc-current">Detail</span>
      </nav>

      <div class="d-flex flex-wrap gap-2 mb-3" v-if="state.insight">
        <span class="insight-tag-pill badge-pill" v-if="state.insight.badge">
          <i class="bi bi-patch-check-fill me-1"></i>{{ state.insight.badge }}
        </span>
        <span class="insight-tag-pill topic" v-if="state.insight.topic">
          <i class="bi bi-tag me-1"></i>{{ state.insight.topic }}
        </span>
        <span class="insight-tag-pill region" v-if="state.insight.region_name">
          <i class="bi bi-geo-alt me-1"></i>{{ state.insight.region_name }}
        </span>
      </div>

      <h1 class="insight-hero-title">
        {{ state.insight?.title || 'Tidak tersedia' }}
      </h1>
      <div class="insight-hero-meta mt-4" v-if="state.insight">
        <span class="meta-chip">
          <i class="bi bi-calendar3"></i>
          {{ formatLongDate(state.insight.created_at) }}
        </span>
        <span class="meta-chip" v-if="state.insight.author">
          <i class="bi bi-person"></i>
          {{ state.insight.author }}
        </span>
        <span class="meta-chip">
          <i class="bi bi-eye"></i>
          {{ Number(state.insight?.views ?? 0) + 1 }} Views
        </span>
        <span class="meta-chip updated" v-if="state.insight.updated_at">
          <i class="bi bi-arrow-clockwise"></i>
          Diperbarui {{ formatLongDate(state.insight.updated_at) }}
        </span>
      </div>
    </div>
  </div>

  <section class="insight-content-section">
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="insight-spinner mx-auto mb-3"></div>
        <p class="text-muted small">Memuat insight...</p>
      </div>

      <div v-else-if="error" class="text-center py-5">
        <div class="mb-4">
          <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>
        </div>
        <h4 class="fw-bold mb-3">{{ error }}</h4>
        <p class="text-muted mb-4">Kami tidak dapat menemukan data yang Anda cari.</p>
        <router-link to="/regional_insight" class="btn btn-outline-amber rounded-pill px-4">
          Kembali ke Daftar Insight
        </router-link>
      </div>

      <template v-else-if="state.insight">
        <div class="row g-5">
          <div class="col-lg-8">
          
            <div class="insight-viz-card mb-5" v-if="state.insight?.chart_data">
              <div class="viz-card-header">
                <div class="header-main">
                  <div class="viz-icon-box">
                    <i class="bi bi-graph-up-arrow"></i>
                  </div>
                  <div>
                    <h6 class="viz-card-title mb-0">Dashboard Visualisasi</h6>
                    <p class="viz-card-subtitle mb-0">Analisis Mendalam Berbasis Dataset Regional</p>
                  </div>
                </div>
                <div class="viz-chart-toggles">
                  <button 
                    v-for="btn in [
                      { type: 'bar', label: 'Batang', icon: 'bi-bar-chart-fill' },
                      { type: 'line', label: 'Garis', icon: 'bi-graph-up' },
                      { type: 'doughnut', label: 'Lingkaran', icon: 'bi-pie-chart-fill' }
                    ]" 
                    :key="btn.type"
                    class="toggle-btn" 
                    :class="{ active: activeChartType === btn.type }"
                    @click="updateChartType(btn.type)"
                    :aria-label="`Tampilkan grafik ${btn.label}`"
                    :aria-pressed="activeChartType === btn.type"
                  >
                    <i :class="btn.icon" class="me-2" aria-hidden="true"></i>
                    <span>{{ btn.label }}</span>
                  </button>
                </div>
              </div>
              
              <div class="viz-card-body">
                <div class="chart-wrapper">
                  <canvas ref="chartRef"></canvas>
                </div>
              </div>
              
              <div class="viz-card-footer">
                <div class="row g-3">
                  <div class="col-sm-4" v-for="(ds, idx) in state.insight.chart_data.datasets" :key="idx">
                    <div class="stat-mini-card">
                      <div class="stat-label">{{ ds.label }}</div>
                      <div class="stat-value">{{ Math.max(...ds.data).toLocaleString() }}{{ ds.label.includes('%') ? '%' : '' }}</div>
                      <div class="stat-trend text-success"><i class="bi bi-caret-up-fill"></i> Tertinggi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="insight-desc-card mb-5">
              <div class="desc-eyebrow"><span class="eyebrow-dot"></span> RINGKASAN INSIGHT</div>
              <p class="desc-body">{{ state.insight.description || 'Tidak tersedia' }}</p>
            </div>

            <!-- TABLE DATA (EXCEL STYLE) - Commented out as per request
            <div class="insight-table-card mb-5" v-if="state.insight.table_data">
              <div class="table-card-header">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-table text-amber"></i>
                  <h6 class="mb-0 fw-bold">Dataset Pendukung (Tabel Data)</h6>
                </div>
                <div class="table-actions">
                  <button class="btn-table-action" title="Download Excel" aria-label="Unduh tabel dalam format Excel"><i class="bi bi-file-earmark-excel" aria-hidden="true"></i></button>
                  <button class="btn-table-action" title="Copy Data" aria-label="Salin data"><i class="bi bi-copy" aria-hidden="true"></i></button>
                </div>
              </div>
              <div class="table-responsive excel-style-wrapper">
                <table class="table table-hover table-bordered excel-table mb-0">
                  <thead>
                    <tr>
                      <th v-for="(val, key) in state.insight.table_data[0]" :key="key" class="text-capitalize">
                        {{ key.replace('_', ' ') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in state.insight.table_data" :key="i">
                      <td v-for="(val, key) in row" :key="key">
                        {{ val }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="table-card-footer">
                <p class="small text-muted mb-0">Sumber: BPS Kasulampua (Dummy Data for Presentation)</p>
              </div>
            </div>
            -->

            <div class="insight-share-bar">
              <span class="share-label">Bagikan:</span>
              <div class="share-buttons">
                <a
                  :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(state.insight.title)}&url=${pageUrl}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="share-btn twitter"
                  title="Twitter/X"
                  aria-label="Bagikan ke Twitter/X"
                >
                  <i class="bi bi-twitter-x" aria-hidden="true"></i>
                </a>
                <a
                  :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="share-btn facebook"
                  title="Facebook"
                  aria-label="Bagikan ke Facebook"
                >
                  <i class="bi bi-facebook" aria-hidden="true"></i>
                </a>
                <a
                  :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(state.insight.title + ' ' + pageUrl)}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="share-btn whatsapp"
                  title="WhatsApp"
                  aria-label="Bagikan via WhatsApp"
                >
                  <i class="bi bi-whatsapp" aria-hidden="true"></i>
                </a>
                <button
                  class="share-btn copy"
                  @click="copyLink"
                  :title="copied ? 'Tersalin!' : 'Salin tautan'"
                  :aria-label="copied ? 'Tersalin!' : 'Salin tautan ke clipboard'"
                >
                  <i :class="copied ? 'bi bi-check2' : 'bi bi-link-45deg'" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="sidebar-sticky">
              <div class="sidebar-card mb-4">
                <h6 class="sidebar-title">Informasi Insight</h6>
                <div class="meta-stack">
                  <div class="meta-row">
                    <div class="meta-icon-box amber">
                      <i class="bi bi-journal-text"></i>
                    </div>
                    <div>
                      <div class="meta-row-label">Topik</div>
                      <div class="meta-row-value">{{ state.insight.topic || 'Tidak tersedia' }}</div>
                    </div>
                  </div>
                  <div class="meta-row">
                    <div class="meta-icon-box stone">
                      <i class="bi bi-building"></i>
                    </div>
                    <div>
                      <div class="meta-row-label">Regional</div>
                      <div class="meta-row-value text-capitalize">{{ state.insight.region || 'Tidak tersedia' }}</div>
                    </div>
                  </div>
                  <div class="meta-row">
                    <div class="meta-icon-box amber">
                      <i class="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <div class="meta-row-label">Wilayah</div>
                      <div class="meta-row-value">{{ state.insight.region_name || 'Tidak tersedia' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sidebar-card" v-if="state.dataset?.length">
                <h6 class="sidebar-title">Dataset Terkait</h6>
                <div class="dataset-list">
                  <a
                    v-for="(ds, i) in state.dataset"
                    :key="i"
                    :href="ds.url"
                    target="_blank"
                    class="dataset-item"
                  >
                    <span class="ds-icon">
                      <i class="bi bi-file-earmark-bar-graph-fill"></i>
                    </span>
                    <span class="ds-title">{{ ds.title }}</span>
                    <i class="bi bi-arrow-up-right ds-arrow ms-auto"></i>
                  </a>
                </div>
              </div>
              <div class="sidebar-card empty-datasets" v-else>
                <i class="bi bi-database-slash empty-icon d-block text-center mb-2"></i>
                <p class="text-center text-muted small mb-0">Tidak ada dataset terkait.</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>

  <Footer />
</template>

<script setup>
import { onMounted, reactive, ref, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import { formatLongDate } from '@/utils/dates'
import { DUMMY_INSIGHTS } from '@/utils/dummyInsights'
import { Chart } from 'chart.js/auto'
import { useMeta } from '@/composables/useMeta'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const { updateMeta } = useMeta()
const { error: toastError } = useToast()
const copied = ref(false)
const pageUrl = computed(() => window.location.href)

const state = reactive({
  insight: null,
  dataset: [],
})

const loading = ref(true)
const error = ref(null)

watch(() => state.insight, (newInsight) => {
  if (newInsight) {
    updateMeta({
      title: newInsight.title,
      description: newInsight.description?.slice(0, 160) || '',
      image: imgUrl(newInsight.image)
    })
  }
})

const chartRef = ref(null)
const activeChartType = ref('bar')
let chartInstance = null

const CHART_PALETTE = [
  'rgba(217, 119, 6, 0.8)',   // Amber
  'rgba(20, 184, 166, 0.8)',  // Teal
  'rgba(56, 189, 248, 0.8)',  // Sky
  'rgba(244, 63, 94, 0.8)',   // Rose
  'rgba(139, 92, 246, 0.8)',  // Violet
  'rgba(249, 115, 22, 0.8)',  // Orange
  'rgba(16, 185, 129, 0.8)',  // Emerald
  'rgba(99, 102, 241, 0.8)',  // Indigo
  'rgba(236, 72, 153, 0.8)'   // Pink
]

watch(chartRef, (newVal) => {
  if (newVal) {
    initChart()
  }
})

const initChart = async () => {
  if (!state.insight?.chart_data || !chartRef.value) return
  
  await nextTick()
  
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const chartData = JSON.parse(JSON.stringify(state.insight.chart_data))
  
  if (activeChartType.value === 'doughnut') {
    chartData.datasets.forEach(dataset => {
      if (dataset.data.length > 1) {
        dataset.backgroundColor = CHART_PALETTE.slice(0, dataset.data.length)
        dataset.hoverBackgroundColor = CHART_PALETTE.slice(0, dataset.data.length)
        dataset.borderColor = '#ffffff'
        dataset.borderWidth = 2
      }
    })
  }

  const ctx = chartRef.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: activeChartType.value,
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 25,
            font: {
              size: 13,
              weight: '600',
              family: "'Inter', sans-serif"
            },
            color: '#64748b'
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 10,
          displayColors: true,
          usePointStyle: true
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: activeChartType.value !== 'doughnut' ? {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            font: { size: 11, weight: '500' },
            color: '#94a3b8'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 11, weight: '500' },
            color: '#94a3b8'
          }
        }
      } : {}
    }
  })
}

const updateChartType = (type) => {
  activeChartType.value = type
  initChart()
}

function imgUrl(image) {
  if (!image) return false
  if (image.startsWith('http')) return image
  return image 
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}



const fetchInsight = async () => {
  loading.value = true
  error.value = null
  try {
    // FIND IN DUMMY DATA
    const found = DUMMY_INSIGHTS.find(i => i.slug === route.params.id)
    if (found) {
      state.insight = JSON.parse(JSON.stringify(found)) 
      trackInsight(state.insight?.title)
      
      initChart()
    } else {
      error.value = 'Insight tidak ditemukan'
    }
  } catch (e) {
    console.error('Gagal memuat insight:', e)
    error.value = 'Gagal memuat data insight. Silakan coba lagi nanti.'
    toastError('Gagal memuat data insight. Silakan coba lagi nanti.')
  } finally {
    loading.value = false
  }
}

const fetchRelatedDatasets = async () => {
  try {
    /*
    const res = await fetch(`${API_ENDPOINTS.INSIGHT}/${route.params.id}/related-datasets`)
    state.dataset = await res.json()
    */

    state.dataset = [
      { title: 'Tabel PDRB Perkapita 2023', url: '#' },
      { title: 'Indikator Makro Ekonomi Regional', url: '#' }
    ]
  } catch (e) {
    console.error('Gagal memuat related datasets:', e)
  }
}

const trackInsight = (label) => {
  window._paq?.push(['trackEvent', 'Insight', 'ViewInsight', 'Insight-' + label])
}



onMounted(() => {
  fetchInsight()
  fetchRelatedDatasets()
})
</script>

<style scoped>
.insight-hero {
  min-height: 54vh;
  background: linear-gradient(135deg, #0d1b0a 0%, #1a2e15 50%, #0d1b0a 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
}
.insight-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(10, 20, 8, 0.4) 0%, rgba(8, 16, 6, 0.95) 100%);
}
.insight-hero-content {
  position: relative;
  z-index: 10;
  padding-top: 128px;
  padding-bottom: 3.5rem;
}

.insight-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.bc-link {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: color 0.2s;
}
.bc-link:hover {
  color: #86efac;
}
.bc-sep {
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.75rem;
}
.bc-current {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  font-weight: 500;
}

.insight-tag-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 5px 14px;
  border-radius: 100px;
  backdrop-filter: blur(8px);
}
.insight-tag-pill.badge-pill {
  background: rgba(217, 119, 6, 0.15);
  border: 1px solid rgba(217, 119, 6, 0.3);
  color: #fbbf24;
}
.insight-tag-pill.topic {
  background: rgba(134, 239, 172, 0.15);
  border: 1px solid rgba(134, 239, 172, 0.3);
  color: #86efac;
}
.insight-tag-pill.region {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.75);
}

.insight-hero-title {
  font-size: clamp(1.5rem, 4vw, 2.75rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.02em;
  max-width: 800px;
}

.insight-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 100px;
}
.meta-chip i {
  color: #86efac;
}
.meta-chip.updated {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.insight-content-section {
  background: var(--bg-color);
  padding: 3.5rem 0 5rem;
}
.insight-desc-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem 2.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border-left: 4px solid #22c55e;
}
.desc-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #16a34a;
  margin-bottom: 0.75rem;
}
.eyebrow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-g 1.8s ease-in-out infinite;
}
@keyframes pulse-g {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}
.desc-body {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 0;
}

.viz-panel {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
}
.viz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
  flex-wrap: wrap;
  gap: 12px;
}
.viz-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.viz-header-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
}
.viz-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--text-primary);
}
.viz-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.viz-open-btn {
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  border: 1.5px solid var(--primary-color);
  padding: 8px 18px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.01em;
}
.viz-open-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -3px rgba(217, 119, 6, 0.35);
}

.viz-frame-wrapper {
  width: 100%;
  min-height: 520px;
  position: relative;
  background: #f8f9fa;
}
.viz-iframe {
  width: 100%;
  min-height: 520px;
  display: block;
  border: none;
}

.insight-share-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.share-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.share-buttons {
  display: flex;
  gap: 8px;
}
.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
}
.share-btn.twitter {
  background: #1a1a1a;
  color: white;
}
.share-btn.facebook {
  background: #1877f2;
  color: white;
}
.share-btn.whatsapp {
  background: #25d366;
  color: white;
}
.share-btn.copy {
  background: var(--bg-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}
.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.btn-back {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  border: 1px solid var(--primary-color);
  padding: 10px 22px;
  border-radius: 100px;
  transition: all 0.25s;
}
.btn-back:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.insight-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #dcfce7;
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.sidebar-sticky {
  position: sticky;
  top: 90px;
}
.sidebar-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.sidebar-title {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.meta-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.meta-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.meta-icon-box.amber {
  background: var(--bg-accent);
  color: var(--primary-color);
  border: 1px solid var(--border-amber-20);
}
.meta-icon-box.stone {
  background: var(--bg-color);
  color: var(--text-secondary);
}
.meta-row-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}
.meta-row-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.dataset-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dataset-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  text-decoration: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.25s;
}
.dataset-item:hover {
  border-color: var(--primary-color);
  background: var(--bg-accent-light);
  color: var(--primary-color);
  transform: translateX(4px);
}
.ds-icon {
  color: var(--primary-color);
  font-size: 1.1rem;
  flex-shrink: 0;
}
.ds-title {
  flex: 1;
  line-height: 1.4;
}
.ds-arrow {
  opacity: 0.4;
  transition: opacity 0.2s;
  font-size: 0.85rem;
}
.dataset-item:hover .ds-arrow {
  opacity: 1;
}

.empty-datasets {
  border: 1px dashed var(--border-color) !important;
}
.empty-icon {
  font-size: 2.5rem;
  color: var(--text-secondary);
  opacity: 0.3;
}

.insight-table-card {
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.table-card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafaf9;
}
.text-amber {
  color: var(--primary-color) !important;
}
.btn-table-action {
  background: white;
  border: 1px solid var(--border-color);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s;
  margin-left: 6px;
}
.btn-table-action:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.excel-style-wrapper {
  max-height: 400px;
  overflow: auto;
}
.excel-table {
  font-size: 0.875rem;
}
.excel-table thead th {
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1;
}
.excel-table tbody td {
  padding: 12px 16px;
  color: #1e293b;
  font-weight: 500;
  border-bottom: 1px solid #f1f5f9;
}
.excel-table tbody tr:hover td {
  background-color: #fffbeb;
}

.table-card-footer {
  padding: 0.75rem 1.5rem;
  background: #fafaf9;
  border-top: 1px solid var(--border-color);
}

.insight-viz-card {
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
}
.viz-card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  flex-wrap: wrap;
  gap: 1rem;
}
.header-main {
  display: flex;
  align-items: center;
  gap: 14px;
}
.viz-icon-box {
  width: 48px;
  height: 48px;
  background: var(--bg-accent);
  color: var(--primary-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.viz-card-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
}
.viz-card-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.viz-chart-toggles {
  display: flex;
  background: #f1f5f9;
  padding: 5px;
  border-radius: 12px;
  gap: 5px;
}
.toggle-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.8rem;
  font-weight: 700;
}
.toggle-btn i {
  font-size: 1rem;
}
.toggle-btn span {
  white-space: nowrap;
}
.toggle-btn.active {
  background: white;
  color: var(--amber-600);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.toggle-btn:hover:not(.active) {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.5);
}

.viz-card-body {
  padding: 1.5rem;
}
.chart-wrapper {
  height: 320px;
  position: relative;
}

.viz-card-footer {
  padding: 1.5rem;
  background: #fafaf9;
  border-top: 1px solid var(--border-color);
}
.stat-mini-card {
  background: white;
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.3s;
}
.stat-mini-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary-color);
}
.stat-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
}
.stat-trend {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 2px;
}

@media (max-width: 991px) {
  .insight-hero-content {
    padding-top: 98px;
    padding-bottom: 2.5rem;
  }
  .sidebar-sticky {
    position: static;
  }
  .viz-frame-wrapper,
  .viz-iframe {
    min-height: 380px;
  }
}

@media (max-width: 576px) {
  .viz-card-header {
    padding: 1.25rem 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
  .header-main {
    width: 100%;
  }
  .viz-icon-box {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  .viz-chart-toggles {
    width: 100%;
    padding: 4px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }
  .toggle-btn {
    flex: 1;
    padding: 10px 5px;
  }
  .toggle-btn span {
    display: none;
  }
  .toggle-btn i {
    margin-right: 0 !important;
    font-size: 1.1rem;
  }
  .chart-wrapper {
    height: 280px;
  }
  .viz-card-body {
    padding: 1rem;
  }
  .viz-card-footer {
    padding: 1rem;
  }
  .stat-mini-card {
    padding: 10px 12px;
  }
  .stat-value {
    font-size: 1.125rem;
  }
}
</style>
