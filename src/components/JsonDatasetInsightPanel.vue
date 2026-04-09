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
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary rounded-pill"
            @click="openResourceJsonInNewTab"
          >
            <i class="bi bi-filetype-json me-1"></i> Buka JSON
          </button>
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
            title="Buka data JSON (sesuai filter) di tab baru"
            @click="openJsonInNewTab"
          >
            <i class="bi bi-filetype-json me-1"></i> Buka JSON
          </button>
        </div>
      </div>


      <div class="rv-tabs mb-4">
        <button
          type="button"
          class="rv-tab"
          :class="{ active: activeTab === 'chart' }"
          @click="setChartTab"
        >
          <i class="bi bi-graph-up me-1"></i> Grafik
        </button>
        <button
          type="button"
          class="rv-tab"
          :class="{ active: activeTab === 'table' }"
          @click="activeTab = 'table'"
        >
          <i class="bi bi-table me-1"></i> Tabel
        </button>
        
      </div>

      <JsonDatasetTableCard
        v-if="activeTab === 'table'"
        :table-data="filteredData"
        :columns="visibleCols"
        :column-labels="columnLabels"
      />

      <div v-else-if="activeTab === 'chart'" class="jd-chart-layout">
        <div class="jd-chart-filters-bar mb-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div class="d-flex align-items-center gap-3 flex-wrap">
              <div v-if="vervalFilterKey" class="jd-filter-dropdown">
                <label class="jd-filter-label-sm">{{ vervalFilterLabel }}</label>
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill px-3"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="bi bi-patch-check me-1"></i>
                    {{ selectedVerval.length === vervalOptions.length ? 'Semua ' + vervalFilterLabel : selectedVerval.length + ' Terpilih' }}
                  </button>
                  <div class="dropdown-menu p-3 shadow-sm border-0 rounded-4" style="min-width: 240px;">
                    <div class="jd-check-item mb-2 border-bottom pb-2">
                      <input
                        id="jd-verval-all"
                        type="checkbox"
                        class="jd-check-input"
                        :checked="allVervalSelected"
                        @change="toggleAllVerval($event.target.checked)"
                      />
                      <label class="jd-check-label fw-bold" for="jd-verval-all">Pilih semua</label>
                    </div>
                    <div class="jd-filter-scroll custom-scrollbar" style="max-height: 200px; overflow-y: auto;">
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
                        <label class="jd-check-label" :for="'jd-verval-' + idx">{{ opt }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="showTurvarFilter" class="jd-filter-dropdown">
                <label class="jd-filter-label-sm">{{ turvarFilterLabel }}</label>
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill px-3"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="bi bi-layers me-1"></i>
                    {{ selectedTurvar || 'Pilih ' + turvarFilterLabel }}
                  </button>
                  <div class="dropdown-menu p-2 shadow-sm border-0 rounded-4" style="min-width: 200px;">
                    <div class="jd-filter-scroll custom-scrollbar" style="max-height: 200px; overflow-y: auto;">
                      <div
                        v-for="(opt, idx) in turvarOptions"
                        :key="'t-' + idx + '-' + opt"
                        class="jd-check-item"
                        @click="toggleTurvar(opt)"
                      >
                        <input
                          :id="'jd-turvar-' + idx"
                          type="radio"
                          name="jd-turvar"
                          class="jd-check-input"
                          :checked="selectedTurvar === opt"
                          @click.stop
                          @change="toggleTurvar(opt)"
                        />
                        <label class="jd-check-label" :for="'jd-turvar-' + idx">{{ opt }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="showTurtahunFilter" class="jd-filter-dropdown">
                <label class="jd-filter-label-sm">Turtahun</label>
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill px-3"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="bi bi-calendar3 me-1"></i>
                    {{ selectedTurtahun.length === turtahunOptions.length ? 'Semua Tahun' : selectedTurtahun.length + ' Terpilih' }}
                  </button>
                  <div class="dropdown-menu p-3 shadow-sm border-0 rounded-4" style="min-width: 200px;">
                    <div class="jd-filter-scroll custom-scrollbar" style="max-height: 200px; overflow-y: auto;">
                      <div
                        v-for="(opt, idx) in turtahunOptions"
                        :key="'tt-' + idx + '-' + opt"
                        class="jd-check-item"
                      >
                        <input
                          :id="'jd-turtahun-' + idx"
                          type="checkbox"
                          class="jd-check-input"
                          :checked="selectedTurtahun.includes(opt)"
                          @change="toggleTurtahun(opt, $event.target.checked)"
                        />
                        <label class="jd-check-label" :for="'jd-turtahun-' + idx">{{ opt }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-sm btn-link text-decoration-none text-muted p-0"
              @click="initChartFilterSelections"
            >
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filter
            </button>
          </div>
        </div>

        <div class="jd-chart-main-container">
          <JsonDatasetChartCard
            :table-data="chartFilteredData"
            :columns="visibleCols"
            :column-labels="columnLabels"
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
const activeTab = ref('chart')
/** Label kolom dari root JSON hasil fetch (column_labels / label_overrides) */
const columnLabelsFromJson = ref({})

function columnLabelsFromCkanResource(resource) {
  if (!resource) return {}
  let raw = resource.column_labels
  if (raw === undefined && Array.isArray(resource.extras)) {
    const entry = resource.extras.find((e) => e.key === 'column_labels')
    if (entry) raw = entry.value
  }
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      const o = JSON.parse(raw)
      return typeof o === 'object' && o && !Array.isArray(o) ? o : {}
    } catch {
      return {}
    }
  }
  return typeof raw === 'object' && !Array.isArray(raw) ? { ...raw } : {}
}

/** JSON file mengalahkan metadata resource CKAN bila keduanya ada */
const columnLabels = computed(() => ({
  ...columnLabelsFromCkanResource(props.resource),
  ...columnLabelsFromJson.value
}))

const filteredData = computed(() => tableData.value)

/** @type {import('vue').Ref<string[]>} */
const selectedVerval = ref([])
/** @type {import('vue').Ref<string>} */
const selectedTurvar = ref('')
/** @type {import('vue').Ref<string[]>} */
const selectedTurtahun = ref([])
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
const allVervalSelected = computed(
  () => !!vervalOptions.value.length && selectedVerval.value.length === vervalOptions.value.length
)

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

const showTurtahunFilter = computed(() => {
  const key = hiddenInfo.value.turtahunKey
  if (!key || !tableData.value.length) return false
  const meaningful = new Set()
  for (const row of tableData.value) {
    const s = cellStr(row[key])
    if (!s) continue
    if (s.toLowerCase() === 'tahunan') continue
    meaningful.add(s)
  }
  return meaningful.size > 1
})

const turtahunOptions = computed(() => {
  const key = hiddenInfo.value.turtahunKey
  if (!key || !tableData.value.length) return []
  const uniq = new Set()
  for (const row of tableData.value) {
    const s = cellStr(row[key])
    if (!s) continue
    uniq.add(s)
  }
  return [...uniq].sort((a, b) => a.localeCompare(b, 'id'))
})

function formatColumnLabel(key) {
  if (!key) return ''
  if (columnLabels.value?.[key]) return columnLabels.value[key]
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const vervalFilterLabel = computed(() => formatColumnLabel(hiddenInfo.value.vervalKey) || 'Verval')
const turvarFilterLabel = computed(() => formatColumnLabel(hiddenInfo.value.turvarKey) || 'Turvar')

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
  if (tk && selectedTurvar.value) {
    rows = rows.filter((r) => cellStr(r[tk]) === selectedTurvar.value)
  }

  const ttk = hi.turtahunKey
  if (ttk && selectedTurtahun.value.length) {
    const allow = new Set(selectedTurtahun.value)
    rows = rows.filter((r) => allow.has(cellStr(r[ttk])))
  }

  return rows
})

function initChartFilterSelections() {
  selectedVerval.value = [...vervalOptions.value]
  selectedTurvar.value = turvarOptions.value[0] ?? ''
  selectedTurtahun.value = [...turtahunOptions.value]
}

function toggleVerval(opt, checked) {
  if (checked) {
    if (!selectedVerval.value.includes(opt)) selectedVerval.value = [...selectedVerval.value, opt]
  } else {
    selectedVerval.value = selectedVerval.value.filter((x) => x !== opt)
  }
}

function toggleAllVerval(checked) {
  if (checked) {
    selectedVerval.value = [...vervalOptions.value]
  } else {
    selectedVerval.value = []
  }
}

function toggleTurvar(opt) {
  selectedTurvar.value = opt
}

function toggleTurtahun(opt, checked) {
  if (checked) {
    if (!selectedTurtahun.value.includes(opt)) {
      selectedTurtahun.value = [...selectedTurtahun.value, opt]
    }
  } else {
    selectedTurtahun.value = selectedTurtahun.value.filter((x) => x !== opt)
  }
}

watch(turvarOptions, (nextOptions) => {
  if (!nextOptions.length) {
    selectedTurvar.value = ''
    return
  }
  if (!nextOptions.includes(selectedTurvar.value)) {
    selectedTurvar.value = nextOptions[0] ?? ''
  }
})

watch(turtahunOptions, (nextOptions) => {
  if (!nextOptions.length) {
    selectedTurtahun.value = []
    return
  }
  const allowed = new Set(nextOptions)
  selectedTurtahun.value = selectedTurtahun.value.filter((v) => allowed.has(v))
  if (!selectedTurtahun.value.length) {
    selectedTurtahun.value = [...nextOptions]
  }
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

const openJsonTextInNewTab = (jsonText) => {
  const opened = window.open('', '_blank')
  if (!opened) return false
  opened.opener = null
  const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  opened.location.href = objectUrl
  setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000)
  return true
}

const openJsonInNewTab = () => {
  if (!filteredData.value.length) return
  const dataStr = JSON.stringify(filteredData.value, null, 2)
  openJsonTextInNewTab(dataStr)
}

const openResourceJsonInNewTab = async () => {
  const url = getProxyUrl(props.resource?.url)
  if (!url) return

  const opened = window.open('', '_blank')
  if (!opened) return
  opened.opener = null

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
    const text = await res.text()
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
    const objectUrl = URL.createObjectURL(blob)
    opened.location.href = objectUrl
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000)
  } catch (err) {
    opened.document.title = 'Gagal membuka JSON'
    opened.document.body.innerHTML = `
      <pre style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; padding: 16px;">
Gagal membuka JSON:
${(err && err.message) || 'Kesalahan tidak diketahui'}
      </pre>
    `
  }
}

const setChartTab = () => {
  activeTab.value = 'chart'
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  tableData.value = []
  allColumns.value = []
  columnLabelsFromJson.value = {}

  try {
    const url = getProxyUrl(props.resource.url)
    if (!url) throw new Error('URL resource tidak tersedia')

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)

    const json = await res.json()
    const { cols, rows: rawRows, columnLabels: parsedLabels = {} } = parseJsonResource(json)
    if (!rawRows.length) throw new Error('Format JSON tidak dikenali atau data kosong')

    columnLabelsFromJson.value = parsedLabels
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
    activeTab.value = 'chart'
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

.jd-split-layout {
  margin-top: 0.5rem;
}

.jd-panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
  height: 100%;
}

.jd-panel-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #334155;
  display: inline-flex;
  align-items: center;
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
  margin-top: 0.5rem;
}

.jd-chart-filters-bar {
  background: #f8fafc;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}

.jd-filter-dropdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.jd-filter-label-sm {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 4px;
}

.jd-chart-main-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

@media (max-width: 1199px) {
  .jd-chart-panel {
    order: 1;
  }
  .jd-table-panel {
    order: 2;
  }
}

.dropdown-toggle::after {
  margin-left: 0.5em;
  vertical-align: 0.15em;
  border-top: 0.35em solid;
  border-right: 0.35em solid transparent;
  border-bottom: 0;
  border-left: 0.35em solid transparent;
  opacity: 0.5;
}

.dropdown-menu {
  z-index: 1050;
}

.jd-check-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.jd-check-item:hover {
  background-color: #f8fafc;
}

.jd-check-input {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #d97706;
}

.jd-check-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  margin: 0;
  flex: 1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
