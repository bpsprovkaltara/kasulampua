<template>
  <div class="jd-chart-view">
    <p class="small text-muted mb-3 mb-md-4">
      Sumbu X: periode waktu (tahun/bulan/triwulan/dll) · Sumbu Y: nilai indikator · Satu garis per wilayah (kolom pertama).
      Gunakan scroll pada grafik untuk zoom; geser untuk geser sumbu X.
    </p>

    <div v-if="chartReady" class="jd-chart-toolbar d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <div class="d-flex align-items-center gap-2">
        <div class="btn-group btn-group-sm p-1 bg-light rounded-pill">
          <button
            type="button"
            class="btn rounded-pill px-3"
            :class="chartType === 'line' ? 'btn-white shadow-sm' : 'btn-light border-0'"
            @click="chartType = 'line'"
          >
            <i class="bi bi-graph-up me-1"></i> Garis
          </button>
          <button
            type="button"
            class="btn rounded-pill px-3"
            :class="chartType === 'bar' ? 'btn-white shadow-sm' : 'btn-light border-0'"
            @click="chartType = 'bar'"
          >
            <i class="bi bi-bar-chart me-1"></i> Batang
          </button>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary rounded-pill px-3"
          @click="resetZoom"
          aria-label="Reset zoom grafik"
        >
          <i class="bi bi-arrows-fullscreen me-1"></i> Reset zoom
        </button>
      </div>
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
  columns: { type: Array, default: () => [] },
  columnLabels: { type: Object, default: () => ({}) }
})

const chartRef = ref(null)
const chartType = ref('line')
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
    type: chartType.value,
    data: {
      labels: payload.labels,
      datasets: payload.datasets.map((ds) => ({
        ...ds,
        type: chartType.value,
        fill: chartType.value === 'line' ? false : true,
        tension: 0.4,
        borderWidth: chartType.value === 'line' ? 3 : 1,
        pointRadius: chartType.value === 'line' ? 4 : 0,
        pointHoverRadius: 6,
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: 'easeInOutQuart'
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: { size: 12, weight: '500' }
          }
        },
        tooltip: {
          enabled: true,
          position: 'nearest',
          xAlign: 'left',
          yAlign: 'center',
          caretPadding: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1e293b',
          bodyColor: '#475569',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('id-ID').format(context.parsed.y);
              }
              return label;
            }
          },
          itemSort: (a, b) => (b.parsed.y ?? -Infinity) - (a.parsed.y ?? -Infinity)
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
          },
          limits: {
            x: { min: 'original', max: 'original', minRange: 1 }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: { size: 11 },
            color: '#64748b'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            font: { size: 11 },
            color: '#64748b',
            callback: function(value) {
              return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);
            }
          }
        }
      }
    }
  })
}

watch(
  () => [props.tableData, props.columns, chartType.value],
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
  padding: 0 4px;
}
.btn-white {
  background: white;
  border: 1px solid #e2e8f0;
  color: #d97706;
}
.jd-canvas-wrapper {
  position: relative;
  height: 450px;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
}
@media (max-width: 991px) {
  .jd-canvas-wrapper {
    height: 380px;
  }
}
@media (max-width: 768px) {
  .jd-canvas-wrapper {
    height: 320px;
    padding: 0.25rem;
  }
  .jd-chart-toolbar {
    flex-direction: column;
    align-items: stretch !important;
  }
  .btn-group {
    width: 100%;
  }
  .btn-group .btn {
    flex: 1;
  }
}
@media (max-width: 768px) {
  .jd-canvas-wrapper {
    height: 280px;
  }
}
</style>
