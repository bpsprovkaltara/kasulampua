<template>
  <div class="json-insight-panel">
    <div v-if="loading" class="text-center py-5">
      <div class="jip-spinner mx-auto mb-3"></div>
      <p class="text-muted small">Memuat data JSON...</p>
    </div>

    <div v-else-if="error" class="alert alert-warning d-flex align-items-start gap-2">
      <i class="bi bi-exclamation-triangle mt-1 flex-shrink-0"></i>
      <div>
        {{ error }}
        <div v-if="resource.url && resource.url !== '-'" class="mt-2">
          <a :href="resource.url" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-secondary rounded-pill">
            <i class="bi bi-download me-1"></i> Unduh file
          </a>
        </div>
      </div>
    </div>

    <div v-else-if="tableData.length" class="jd-view">
      <div class="jd-toolbar d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="jd-badge">
            <i class="bi bi-table me-1"></i>{{ tableData.length }} baris
          </span>
          <span class="jd-badge">
            <i class="bi bi-columns me-1"></i>{{ visibleCols.length }} kolom
          </span>
        </div>
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            class="btn btn-sm btn-success rounded-pill px-3"
            @click="downloadExcel"
          >
            <i class="bi bi-filetype-xlsx me-1"></i> Unduh Excel
          </button>
          <button
            v-if="resource.url && resource.url !== '-'"
            type="button"
            class="btn btn-sm rounded-pill px-3 jd-btn-json"
            @click="downloadJson"
          >
            <i class="bi bi-filetype-json me-1"></i> Unduh JSON
          </button>
        </div>
      </div>

      <div v-if="filterOptions.length > 1" class="jd-filter-bar mb-4">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="filter-icon-box">
              <i class="bi bi-funnel-fill"></i>
            </div>
            <div>
              <h6 class="mb-0 fw-bold text-dark">Saring Data</h6>
              <p class="small text-muted mb-0">Tampilkan data berdasarkan {{ formatHeader(firstCol) }} tertentu</p>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <select v-model="filterValue" class="form-select form-select-sm jd-filter-select-lg">
              <option value="">Semua {{ formatHeader(firstCol) }}</option>
              <option v-for="opt in filterOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <button 
              v-if="filterValue" 
              @click="filterValue = ''" 
              class="btn btn-sm btn-link text-decoration-none text-muted fw-bold px-2"
              title="Bersihkan filter"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="rv-tabs mb-4">
        <button
          type="button"
          class="rv-tab"
          :class="{ active: activeTab === 'table' }"
          @click="activeTab = 'table'"
        >
          <i class="bi bi-table me-1"></i> Tabel
        </button>
        <button
          type="button"
          class="rv-tab"
          :class="{ active: activeTab === 'chart' }"
          @click="setChartTab"
        >
          <i class="bi bi-graph-up me-1"></i> Grafik
        </button>
      </div>

      <JsonDatasetTableCard
        v-if="activeTab === 'table'"
        :table-data="filteredData"
        :columns="visibleCols"
      />

      <div v-else-if="activeTab === 'chart'" class="jd-chart-layout row g-3 align-items-start">
        <aside class="col-12 col-lg-4 col-xl-3 jd-chart-filters">
          <div class="jd-filter-card">
            <h6 class="jd-filter-title mb-3">Filter grafik</h6>

            <div v-if="vervalFilterKey" class="jd-filter-group mb-3">
              <div class="jd-filter-label mb-2">verval_label</div>
              <div class="jd-filter-checklist">
                <div
                  v-for="(opt, idx) in vervalOptions"
                  :key="'v-' + idx + '-' + opt"
                  class="form-check form-check-sm"
                >
                  <input
                    :id="'jd-verval-' + idx"
                    class="form-check-input"
                    type="checkbox"
                    :checked="selectedVerval.includes(opt)"
                    @change="toggleVerval(opt, $event.target.checked)"
                  />
                  <label class="form-check-label small" :for="'jd-verval-' + idx">{{
                    opt
                  }}</label>
                </div>
              </div>
            </div>

            <div v-if="showTurvarFilter" class="jd-filter-group mb-3">
              <div class="jd-filter-label mb-2">turvar_label</div>
              <div class="jd-filter-checklist">
                <div
                  v-for="(opt, idx) in turvarOptions"
                  :key="'t-' + idx + '-' + opt"
                  class="form-check form-check-sm"
                >
                  <input
                    :id="'jd-turvar-' + idx"
                    class="form-check-input"
                    type="checkbox"
                    :checked="selectedTurvar.includes(opt)"
                    @change="toggleTurvar(opt, $event.target.checked)"
                  />
                  <label class="form-check-label small" :for="'jd-turvar-' + idx">{{
                    opt
                  }}</label>
                </div>
              </div>
            </div>

            <div v-if="hiddenInfo.isAggregateKey" class="jd-filter-group mb-0">
              <div class="jd-filter-label mb-2">is_aggregate</div>
              <div class="d-flex flex-column gap-1">
                <div class="form-check form-check-sm">
                  <input
                    id="jd-agg-all"
                    v-model="isAggregateFilter"
                    class="form-check-input"
                    type="radio"
                    value="all"
                  />
                  <label class="form-check-label small" for="jd-agg-all">Semua data</label>
                </div>
                <div class="form-check form-check-sm">
                  <input
                    id="jd-agg-without"
                    v-model="isAggregateFilter"
                    class="form-check-input"
                    type="radio"
                    value="without"
                  />
                  <label class="form-check-label small" for="jd-agg-without"
                    >Tanpa agregat</label
                  >
                </div>
                <div class="form-check form-check-sm">
                  <input
                    id="jd-agg-only"
                    v-model="isAggregateFilter"
                    class="form-check-input"
                    type="radio"
                    value="only"
                  />
                  <label class="form-check-label small" for="jd-agg-only">Hanya agregat</label>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div class="col-12 col-lg col-xl jd-chart-main">
          <JsonDatasetChartCard
            :table-data="chartFilteredData"
            :columns="visibleCols"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { CKAN_FILE_BASE_URL } from '@/config/api'
import { parseJsonResource } from '@/utils/parseCkanResourceJson'
import { computeHiddenColumns, visibleColumnsList } from '@/utils/jsonDatasetColumns'
import JsonDatasetTableCard from './JsonDatasetTableCard.vue'
import JsonDatasetChartCard from './JsonDatasetChartCard.vue'

const props = defineProps({
  resource: { type: Object, required: true }
})

const CKAN_ORIGIN = 'https://data.kasulampua.id'

const tableData = ref([])
const allColumns = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('table')
const filterValue = ref('')

const firstCol = computed(() => (allColumns.value.length ? allColumns.value[0] : ''))

const filterOptions = computed(() => {
  const col = firstCol.value
  if (!col || !tableData.value.length) return []
  const vals = new Set()
  tableData.value.forEach((row) => {
    if (row[col] !== null && row[col] !== undefined) {
      vals.add(String(row[col]))
    }
  })
  return Array.from(vals).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
})

const filteredData = computed(() => {
  if (!filterValue.value || !firstCol.value) return tableData.value
  const col = firstCol.value
  return tableData.value.filter((row) => String(row[col]) === filterValue.value)
})

const formatHeader = (col) =>
  String(col).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/** @type {import('vue').Ref<string[]>} */
const selectedVerval = ref([])
/** @type {import('vue').Ref<string[]>} */
const selectedTurvar = ref([])
/** 'all' | 'without' | 'only' — default exclude aggregate rows */
const isAggregateFilter = ref('without')

const hiddenInfo = computed(() => computeHiddenColumns(tableData.value, allColumns.value))

const visibleCols = computed(() =>
  visibleColumnsList(allColumns.value, hiddenInfo.value.hiddenKeys)
)

const cellStr = (v) => (v === null || v === undefined ? '' : String(v).trim())

function rowIsAggregateTrue(row, key) {
  if (!key || !(key in row)) return false
  const v = row[key]
  if (v === true || v === 1) return true
  if (typeof v === 'string') {
    const u = v.trim().toLowerCase()
    return u === 'true' || u === '1' || u === 'yes' || u === 'ya'
  }
  return false
}

const vervalFilterKey = computed(() => hiddenInfo.value.vervalKey)

const vervalOptions = computed(() => {
  const key = vervalFilterKey.value
  if (!key || !tableData.value.length) return []
  const uniq = new Set()
  for (const row of tableData.value) {
    const s = cellStr(row[key])
    if (s) uniq.add(s)
  }
  return [...uniq].sort((a, b) => a.localeCompare(b, 'id'))
})

const showTurvarFilter = computed(() => {
  const key = hiddenInfo.value.turvarKey
  if (!key || !tableData.value.length) return false
  const meaningful = new Set()
  for (const row of tableData.value) {
    const s = cellStr(row[key])
    if (!s) continue
    if (s.toLowerCase() === 'tidak ada') continue
    meaningful.add(s)
  }
  return meaningful.size > 1
})

const turvarOptions = computed(() => {
  const key = hiddenInfo.value.turvarKey
  if (!key || !tableData.value.length) return []
  const uniq = new Set()
  for (const row of tableData.value) {
    const s = cellStr(row[key])
    if (s !== '') uniq.add(s)
  }
  return [...uniq].sort((a, b) => a.localeCompare(b, 'id'))
})

const chartFilteredData = computed(() => {
  const hi = hiddenInfo.value
  let rows = filteredData.value

  const aggKey = hi.isAggregateKey
  if (aggKey) {
    if (isAggregateFilter.value === 'without') {
      rows = rows.filter((r) => !rowIsAggregateTrue(r, aggKey))
    } else if (isAggregateFilter.value === 'only') {
      rows = rows.filter((r) => rowIsAggregateTrue(r, aggKey))
    }
  }

  const vk = hi.vervalKey
  if (vk && selectedVerval.value.length) {
    const allow = new Set(selectedVerval.value)
    rows = rows.filter((r) => allow.has(cellStr(r[vk])))
  }

  const tk = hi.turvarKey
  if (tk && selectedTurvar.value.length) {
    const allow = new Set(selectedTurvar.value)
    rows = rows.filter((r) => allow.has(cellStr(r[tk])))
  }

  return rows
})

function initChartFilterSelections() {
  selectedVerval.value = [...vervalOptions.value]
  selectedTurvar.value = [...turvarOptions.value]
}

function toggleVerval(opt, checked) {
  if (checked) {
    if (!selectedVerval.value.includes(opt)) selectedVerval.value = [...selectedVerval.value, opt]
  } else {
    selectedVerval.value = selectedVerval.value.filter((x) => x !== opt)
  }
}

function toggleTurvar(opt, checked) {
  if (checked) {
    if (!selectedTurvar.value.includes(opt)) selectedTurvar.value = [...selectedTurvar.value, opt]
  } else {
    selectedTurvar.value = selectedTurvar.value.filter((x) => x !== opt)
  }
}

watch(turvarOptions, (nextOptions) => {
  if (!nextOptions.length) {
    selectedTurvar.value = []
    return
  }
  const allowed = new Set(nextOptions)
  selectedTurvar.value = selectedTurvar.value.filter((v) => allowed.has(v))
})

const getProxyUrl = (originalUrl) => {
  if (!originalUrl) return ''
  if (CKAN_FILE_BASE_URL && originalUrl.startsWith(CKAN_ORIGIN)) {
    return originalUrl.replace(CKAN_ORIGIN, CKAN_FILE_BASE_URL)
  }
  return originalUrl
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

const downloadJson = () => {
  if (!tableData.value.length) return
  const dataStr = JSON.stringify(tableData.value, null, 2)
  const name = (props.resource.name || 'data').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50)
  saveAs(new Blob([dataStr], { type: 'application/json' }), `${name}.json`)
}

const setChartTab = () => {
  activeTab.value = 'chart'
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  tableData.value = []
  allColumns.value = []

  try {
    const url = getProxyUrl(props.resource.url)
    if (!url) throw new Error('URL resource tidak tersedia')

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)

    const json = await res.json()
    const { cols, rows: rawRows } = parseJsonResource(json)
    if (!rawRows.length) throw new Error('Format JSON tidak dikenali atau data kosong')

    const aggregateKey = cols.find(
      (c) => c.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim() === 'is aggregate'
    )

    let rows = rawRows
    if (aggregateKey) {
      rows = rawRows.filter((r) => {
        const val = r[aggregateKey]
        if (val === true || String(val).toLowerCase() === 'true' || val === 1 || val === '1') {
          return false
        }
        return true
      })
    }

    allColumns.value = cols
    tableData.value = rows
    initChartFilterSelections()
  } catch (err) {
    console.error('Gagal memuat resource JSON:', err)
    error.value = 'Gagal memuat data: ' + (err.message || 'Kesalahan tidak diketahui')
  } finally {
    loading.value = false
  }
}

watch(
  () => props.resource?.id,
  () => {
    activeTab.value = 'table'
    filterValue.value = ''
    isAggregateFilter.value = 'without'
    fetchData()
  },
  { immediate: true }
)
</script>

<style scoped>
.json-insight-panel {
  margin-top: 0;
}
.jip-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #d97706;
  border-radius: 50%;
  animation: jip-spin 0.8s linear infinite;
}
@keyframes jip-spin {
  to {
    transform: rotate(360deg);
  }
}

.jd-toolbar {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
}

.jd-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  background: var(--primary-color, #d97706);
  color: #fff;
  border: 1px solid var(--primary-color, #d97706);
}

.jd-btn-json {
  background: #334155;
  color: #fff;
  border: 1px solid #334155;
  font-weight: 700;
}

.jd-btn-json:hover,
.jd-btn-json:focus-visible {
  background: #475569;
  color: #fff;
  border-color: #475569;
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
.rv-tab:hover {
  color: #1e293b;
}
.rv-tab.active {
  background: white;
  color: #d97706;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.jd-filter-select-lg {
  border-radius: 10px;
  border-color: #e2e8f0;
  font-size: 0.875rem;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  min-width: 240px;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-weight: 500;
}
.jd-filter-select-lg:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.jd-filter-bar {
  background: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.filter-icon-box {
  width: 44px;
  height: 44px;
  background: white;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  font-size: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.jd-chart-layout {
  margin-left: 0;
  margin-right: 0;
}

.jd-chart-filters {
  min-width: 0;
}

@media (min-width: 992px) {
  .jd-chart-filters {
    max-width: 360px;
  }
}

.jd-filter-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 1rem 1.1rem;
}

.jd-filter-title {
  font-size: 0.8125rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin: 0;
}

.jd-filter-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
}

.jd-filter-checklist {
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.jd-chart-main {
  min-width: 0;
}
</style>
