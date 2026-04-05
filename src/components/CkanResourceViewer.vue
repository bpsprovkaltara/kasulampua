<template>
  <div class="resource-viewer mt-3">
    <div v-if="loading" class="text-center py-5">
      <div class="rv-spinner mx-auto mb-3"></div>
      <p class="text-muted small">Memuat data resource...</p>
    </div>

    <div v-else-if="error" class="alert alert-warning d-flex align-items-start gap-2">
      <i class="bi bi-exclamation-triangle mt-1 flex-shrink-0"></i>
      <div>
        {{ error }}
        <div class="mt-2" v-if="resource.url && resource.url !== '-'">
          <a :href="resource.url" target="_blank" class="btn btn-sm btn-outline-secondary rounded-pill">
            <i class="bi bi-download me-1"></i> Unduh File Langsung
          </a>
        </div>
      </div>
    </div>

    <div v-else-if="tableData.length">
      <!-- Toolbar -->
      <div class="rv-toolbar d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="rv-info-badge">
            <i class="bi bi-table me-1"></i>{{ tableData.length }} baris
          </span>
          <span class="rv-info-badge">
            <i class="bi bi-columns me-1"></i>{{ columns.length }} kolom
          </span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <a
            v-if="resource.url && resource.url !== '-'"
            :href="resource.url"
            target="_blank"
            class="btn btn-sm btn-outline-secondary rounded-pill px-3"
          >
            <i class="bi bi-filetype-csv me-1"></i> Unduh CSV
          </a>
          <button
            class="btn btn-sm btn-success rounded-pill px-3"
            @click="downloadExcel"
          >
            <i class="bi bi-filetype-xlsx me-1"></i> Unduh Excel
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="rv-tabs mb-4">
        <button
          class="rv-tab"
          :class="{ active: activeTab === 'table' }"
          @click="activeTab = 'table'"
        >
          <i class="bi bi-table me-1"></i> Tabel
        </button>
        <button
          class="rv-tab"
          :class="{ active: activeTab === 'chart' }"
          @click="setChartTab"
        >
          <i class="bi bi-bar-chart me-1"></i> Grafik
        </button>
      </div>

      <!-- Tabel -->
      <div v-show="activeTab === 'table'" class="rv-table-container">
        <div class="table-responsive">
          <table class="table table-sm table-hover mb-0">
            <thead>
              <tr>
                <th class="rv-th text-center" style="width:48px">#</th>
                <th v-for="col in columns" :key="col" class="rv-th">{{ formatHeader(col) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in paginatedData" :key="idx">
                <td class="text-center text-muted small rv-td">{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
                <td v-for="col in columns" :key="col" class="rv-td">{{ row[col] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rv-table-footer d-flex align-items-center justify-content-between mt-3 px-1" v-if="totalPages > 1">
          <span class="text-muted small">Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-secondary px-2" :disabled="currentPage <= 1" @click="currentPage--">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary px-2" :disabled="currentPage >= totalPages" @click="currentPage++">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Grafik -->
      <div v-show="activeTab === 'chart'">
        <div v-if="numericColumns.length" class="mb-3 d-flex align-items-center gap-2 flex-wrap">
          <span class="small fw-bold text-muted">Tipe:</span>
          <button
            class="btn btn-sm rounded-pill px-3"
            :class="chartType === 'bar' ? 'btn-amber' : 'btn-outline-secondary'"
            @click="switchChart('bar')"
          >
            <i class="bi bi-bar-chart me-1"></i> Bar
          </button>
          <button
            class="btn btn-sm rounded-pill px-3"
            :class="chartType === 'line' ? 'btn-amber' : 'btn-outline-secondary'"
            @click="switchChart('line')"
          >
            <i class="bi bi-graph-up me-1"></i> Line
          </button>
          <span class="ms-2 small text-muted" v-if="tableData.length > 50">
            Grafik menampilkan 50 baris pertama
          </span>
        </div>
        <div v-if="numericColumns.length" class="rv-canvas-wrapper">
          <canvas ref="chartRef"></canvas>
        </div>
        <div v-else class="text-center text-muted py-4">
          <i class="bi bi-bar-chart" style="font-size:2rem; opacity:0.3"></i>
          <p class="small mt-2">Tidak ada kolom numerik untuk divisualisasikan.</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-4">
      <i class="bi bi-inbox" style="font-size:2rem; opacity:0.2"></i>
      <p class="small mt-2">Data kosong atau format tidak didukung untuk pratinjau.</p>
      <a v-if="resource.url && resource.url !== '-'" :href="resource.url" target="_blank" class="btn btn-sm btn-outline-secondary rounded-pill mt-1">
        <i class="bi bi-download me-1"></i> Unduh File
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { CKAN_FILE_BASE_URL } from '@/config/api'

Chart.register(...registerables)

const props = defineProps({
  resource: { type: Object, required: true }
})

const CKAN_ORIGIN = 'https://data.kasulampua.id'

const tableData = ref([])
const columns = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('table')
const chartType = ref('bar')
const currentPage = ref(1)
const pageSize = 50
const chartRef = ref(null)
let chartInstance = null

const totalPages = computed(() => Math.ceil(tableData.value.length / pageSize))
const paginatedData = computed(() =>
  tableData.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

const numericColumns = computed(() => {
  if (!tableData.value.length || !columns.value.length) return []
  const sample = tableData.value.slice(0, 20)
  return columns.value.filter(col =>
    sample.some(row => {
      const v = row[col]
      return v !== null && v !== '' && v !== undefined && !isNaN(Number(String(v).replace(/,/g, '')))
    })
  )
})

const labelColumn = computed(() =>
  columns.value.find(col => !numericColumns.value.includes(col)) || columns.value[0]
)

const formatHeader = (col) =>
  col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

const getProxyUrl = (originalUrl) => {
  if (!originalUrl) return ''
  if (CKAN_FILE_BASE_URL && originalUrl.startsWith(CKAN_ORIGIN)) {
    return originalUrl.replace(CKAN_ORIGIN, CKAN_FILE_BASE_URL)
  }
  return originalUrl
}

// Parse standard CSV
const parseCsv = (text) => {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return { cols: [], rows: [] }
  const cols = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    // Simple CSV split (handles quoted fields too)
    const values = []
    let inQuote = false
    let current = ''
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci]
      if (ch === '"') { inQuote = !inQuote }
      else if (ch === ',' && !inQuote) { values.push(current.trim()); current = '' }
      else { current += ch }
    }
    values.push(current.trim())
    if (values.length >= cols.length) {
      const row = {}
      cols.forEach((col, j) => { row[col] = values[j] ?? '' })
      rows.push(row)
    }
  }
  return { cols, rows }
}

// Parse BPS harvested JSON format: { records: [{vervar_label, tahun, nilai, ...}] }
const parseBpsJson = (json) => {
  // Format 1: flat records array (harvested BPS)
  if (Array.isArray(json.records) && json.records.length) {
    const allCols = Object.keys(json.records[0])
    // Show meaningful columns, exclude internal _id fields
    const cols = allCols.filter(c => !c.endsWith('_id'))
    return { cols, rows: json.records.map(r => {
      const row = {}
      cols.forEach(c => { row[c] = r[c] })
      return row
    })}
  }

  // Format 2: { data: {vervarVal: {yearVal: value}}, dimensions: {...} }
  if (json.dimensions && json.data) {
    const vervarLabel = json.dimensions.label_vervar || 'Wilayah'
    const vervars = json.dimensions.vertical_variables || []
    const years = json.dimensions.periods || json.dimensions.years || []
    if (!vervars.length) return { cols: [], rows: [] }

    if (years.length) {
      const cols = [vervarLabel, ...years.map(y => String(y.label))]
      const rows = vervars.map(vv => {
        const row = { [vervarLabel]: vv.label }
        years.forEach(yr => {
          row[String(yr.label)] = json.data?.[vv.val]?.[yr.val] ?? '-'
        })
        return row
      })
      return { cols, rows }
    }
    const cols = [vervarLabel, 'Nilai']
    return {
      cols,
      rows: vervars.map(vv => ({
        [vervarLabel]: vv.label,
        'Nilai': json.data?.[vv.val] ?? '-'
      }))
    }
  }

  return { cols: [], rows: [] }
}

const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    const url = getProxyUrl(props.resource.url)
    if (!url) throw new Error('URL resource tidak tersedia')

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)

    const format = (props.resource.format || '').toLowerCase()

    if (format === 'csv') {
      const text = await res.text()
      const { cols, rows } = parseCsv(text)
      columns.value = cols
      tableData.value = rows
    } else if (format === 'json') {
      const json = await res.json()
      if (Array.isArray(json)) {
        // Plain array
        if (json.length) {
          columns.value = Object.keys(json[0])
          tableData.value = json
        }
      } else {
        // Try BPS format
        const { cols, rows } = parseBpsJson(json)
        columns.value = cols
        tableData.value = rows
        if (!rows.length) throw new Error('Format JSON tidak dikenali')
      }
    } else {
      error.value = `Format "${(props.resource.format || 'tidak diketahui').toUpperCase()}" belum didukung untuk pratinjau.`
    }
  } catch (err) {
    console.error('Gagal memuat resource data:', err)
    error.value = 'Gagal memuat data: ' + (err.message || 'Kesalahan tidak diketahui')
  } finally {
    loading.value = false
  }
}

const CHART_COLORS = [
  '#d97706', '#0ea5e9', '#16a34a', '#8b5cf6', '#dc2626',
  '#06b6d4', '#f59e0b', '#ec4899', '#14b8a6', '#6366f1'
]

const renderChart = () => {
  if (!chartRef.value || !numericColumns.value.length || !tableData.value.length) return

  if (chartInstance) { chartInstance.destroy(); chartInstance = null }

  const data = tableData.value.slice(0, 50)
  const labels = data.map(row => String(row[labelColumn.value] ?? ''))

  const datasets = numericColumns.value.slice(0, 5).map((col, i) => ({
    label: formatHeader(col),
    data: data.map(row => { const v = Number(row[col]); return isNaN(v) ? 0 : v }),
    backgroundColor: CHART_COLORS[i % CHART_COLORS.length] + 'bb',
    borderColor: CHART_COLORS[i % CHART_COLORS.length],
    borderWidth: 2,
    tension: 0.3,
    fill: false,
  }))

  chartInstance = new Chart(chartRef.value, {
    type: chartType.value,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { ticks: { maxRotation: 45, maxTicksLimit: 20 } }
      }
    }
  })
}

const setChartTab = () => {
  activeTab.value = 'chart'
  nextTick(() => renderChart())
}

const switchChart = (type) => {
  chartType.value = type
  nextTick(() => renderChart())
}

const downloadExcel = () => {
  if (!tableData.value.length) return
  const ws = XLSX.utils.json_to_sheet(tableData.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  const name = (props.resource.name || 'data').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50)
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${name}.xlsx`)
}

watch(activeTab, (val) => {
  if (val === 'chart') nextTick(() => renderChart())
})

onMounted(fetchData)

onBeforeUnmount(() => {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null }
})
</script>

<style scoped>
.resource-viewer {
  background: #f8fafc;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  padding: 1.25rem;
}

.rv-spinner {
  width: 40px; height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #d97706;
  border-radius: 50%;
  animation: rv-spin 0.8s linear infinite;
}
@keyframes rv-spin { to { transform: rotate(360deg); } }

.rv-toolbar {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
}

.rv-info-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.rv-tabs {
  display: flex;
  gap: 4px;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 10px;
  width: fit-content;
}
.rv-tab {
  padding: 7px 18px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}
.rv-tab:hover { color: #1e293b; }
.rv-tab.active {
  background: white;
  color: #d97706;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.rv-table-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}
.rv-th {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  background: #f8fafc;
  padding: 0.7rem 1rem !important;
  border-bottom: 2px solid #e2e8f0 !important;
  white-space: nowrap;
}
.rv-td {
  font-size: 0.875rem;
  padding: 0.55rem 1rem !important;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.rv-table-footer { padding: 0 0.25rem; }

.rv-canvas-wrapper {
  position: relative;
  height: 380px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
}

.btn-amber {
  background: #d97706;
  color: white;
  border-color: #d97706;
}
.btn-amber:hover { background: #b45309; border-color: #b45309; color: white; }
.btn-outline-amber {
  color: #d97706;
  border-color: #d97706;
  background: transparent;
}
.btn-outline-amber:hover { background: #d97706; color: white; }

@media (max-width: 768px) {
  .resource-viewer { padding: 0.875rem; }
  .rv-canvas-wrapper { height: 260px; }
}
</style>
