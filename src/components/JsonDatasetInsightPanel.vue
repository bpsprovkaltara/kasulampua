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
          <div class="jd-filter-container">
            <div class="jd-filter-header-main">
              <i class="bi bi-sliders2-vertical me-2"></i>
              <h6 class="jd-sidebar-main-title">Filter visualisasi</h6>
            </div>

            <div v-if="vervalFilterKey" class="jd-filter-section mb-4">
              <div class="jd-filter-label-header">
                <i class="bi bi-patch-check me-2"></i>
                <span>Verval</span>
              </div>
              <div class="jd-filter-list custom-scrollbar">
                <div
                  v-for="(opt, idx) in vervalOptions"
                  :key="'v-' + idx + '-' + opt"
                  class="jd-check-item"
                >
                  <input
                    :id="'jd-verval-' + idx"
                    type="checkbox"
                    class="jd-check-input"
                    :checked="selectedVerval.includes(opt)"
                    @change="toggleVerval(opt, $event.target.checked)"
                  />
                  <label class="jd-check-label" :for="'jd-verval-' + idx">
                    {{ opt }}
                  </label>
                </div>
              </div>
            </div>

            <div v-if="showTurvarFilter" class="jd-filter-section mb-4">
              <div class="jd-filter-label-header">
                <i class="bi bi-layers me-2"></i>
                <span>Turvar</span>
              </div>
              <div class="jd-filter-list custom-scrollbar">
                <div
                  v-for="(opt, idx) in turvarOptions"
                  :key="'t-' + idx + '-' + opt"
                  class="jd-check-item"
                >
                  <input
                    :id="'jd-turvar-' + idx"
                    type="checkbox"
                    class="jd-check-input"
                    :checked="selectedTurvar.includes(opt)"
                    @change="toggleTurvar(opt, $event.target.checked)"
                  />
                  <label class="jd-check-label" :for="'jd-turvar-' + idx">
                    {{ opt }}
                  </label>
                </div>
              </div>
            </div>

            <div v-if="hiddenInfo.isAggregateKey" class="jd-filter-section mb-0">
              <div class="jd-filter-label-header">
                <i class="bi bi-calculator me-2"></i>
                <span>Agregat</span>
              </div>
              <div class="jd-radio-group">
                <label class="jd-radio-option" :class="{ active: isAggregateFilter === 'all' }">
                  <input type="radio" v-model="isAggregateFilter" value="all" />
                  <span class="option-dot"></span>
                  <span class="option-text">Semua data</span>
                </label>
                <label class="jd-radio-option" :class="{ active: isAggregateFilter === 'without' }">
                  <input type="radio" v-model="isAggregateFilter" value="without" />
                  <span class="option-dot"></span>
                  <span class="option-text">Tanpa agregat</span>
                </label>
                <label class="jd-radio-option" :class="{ active: isAggregateFilter === 'only' }">
                  <input type="radio" v-model="isAggregateFilter" value="only" />
                  <span class="option-dot"></span>
                  <span class="option-text">Hanya agregat</span>
                </label>
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

const firstCol = computed(() => (allColumns.value.length ? allColumns.value[0] : ''))

const filteredData = computed(() => tableData.value)

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
  if (!filteredData.value.length) return
  const dataStr = JSON.stringify(filteredData.value, null, 2)
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

    allColumns.value = cols
    tableData.value = rawRows
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

.jd-filter-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.jd-filter-header-main {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.jd-sidebar-main-title {
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.jd-filter-section {
  display: flex;
  flex-direction: column;
}

.jd-filter-label-header {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  display: flex;
  align-items: center;
}

.jd-filter-list {
  max-height: 240px;
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.jd-check-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  border: 1px solid transparent;
}

.jd-check-item:hover {
  background-color: #f8fafc;
  border-color: #f1f5f9;
}

.jd-check-input {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #d97706;
}

.jd-check-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.jd-check-item:hover .jd-check-label {
  color: #1e293b;
}

.jd-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.jd-radio-option {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.jd-radio-option input {
  position: absolute;
  opacity: 0;
}

.option-dot {
  width: 14px;
  height: 14px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.option-dot::after {
  content: "";
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.2s ease;
}

.option-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
}

.jd-radio-option:hover {
  background: #f1f5f9;
}

.jd-radio-option.active {
  background: #fff7ed;
  border-color: #f59e0b;
}

.jd-radio-option.active .option-dot {
  border-color: #f59e0b;
  background: #f59e0b;
}

.jd-radio-option.active .option-dot::after {
  transform: scale(1);
}

.jd-radio-option.active .option-text {
  color: #d97706;
}

.jd-chart-main {
  min-width: 0;
}
</style>
