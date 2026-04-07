<template>
  <div class="jd-chart-view">
    <p class="small text-muted mb-3 mb-md-4">
      Sumbu X: periode waktu (tahun/bulan/triwulan/dll) · Sumbu Y: nilai indikator · Satu garis per wilayah (kolom pertama).
      Gunakan scroll pada grafik untuk zoom; geser untuk geser sumbu X.
    </p>

    <div v-if="chartReady" class="jd-chart-toolbar d-flex flex-wrap align-items-center gap-2 mb-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary rounded-pill px-3"
        @click="resetZoom"
        aria-label="Reset zoom grafik"
      >
        <i class="bi bi-arrows-fullscreen me-1"></i> Reset zoom
      </button>
      <span class="small text-muted">Zoom: roda mouse / pinch · Pan: seret (drag)</span>
    </div>

    <div v-if="chartReady" class="jd-canvas-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
    <div v-else class="text-center text-muted py-4">
      <i class="bi bi-graph-up" style="font-size: 2rem; opacity: 0.3"></i>
      <p class="small mt-2 mb-0">
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { buildLineChartData } from '@/utils/jsonDatasetChart'

Chart.register(...registerables, zoomPlugin)

const props = defineProps({
  tableData: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] }
})

const chartRef = ref(null)
let chartInstance = null

const chartPayload = computed(() => buildLineChartData(props.tableData, props.columns))

const chartReady = computed(() => {
  const p = chartPayload.value
  return !!(p && p.labels.length && p.datasets.length)
})

const emptyMessage = computed(() => {
  if (!props.tableData.length) return 'Belum ada data.'
  return 'Format data tidak memiliki kolom periode/nilai yang dapat divisualisasikan sebagai garis per wilayah.'
})

const resetZoom = () => {
  if (chartInstance && typeof chartInstance.resetZoom === 'function') {
    chartInstance.resetZoom()
  }
}

const renderChart = () => {
  if (!chartRef.value) return
  const payload = chartPayload.value
  if (!payload || !payload.labels.length || !payload.datasets.length) {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    return
  }

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: payload.labels,
      datasets: payload.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 11 } }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            modifierKey: null
          },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
            drag: {
              enabled: false
            }
          },
          limits: {
            x: { min: 'original', max: 'original', minRange: 1 }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Periode' },
          ticks: { maxRotation: 45, maxTicksLimit: 48, autoSkip: true }
        },
        y: {
          title: { display: true, text: 'Nilai indikator' },
          beginAtZero: false
        }
      }
    }
  })
}

watch(
  () => [props.tableData, props.columns],
  () => nextTick(() => renderChart()),
  { deep: true }
)

watch(chartReady, (ready) => {
  if (ready) nextTick(() => renderChart())
})

onMounted(() => nextTick(() => renderChart()))

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.jd-chart-toolbar {
  padding-left: 2px;
}
.jd-canvas-wrapper {
  position: relative;
  height: 400px;
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
}
@media (max-width: 768px) {
  .jd-canvas-wrapper {
    height: 280px;
  }
}
</style>
