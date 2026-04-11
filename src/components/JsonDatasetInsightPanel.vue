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

      <div class="jdf-bar mb-4">
        <div class="jdf-left">
          <span class="jdf-label"><i class="bi bi-sliders2"></i></span>

          <!-- Verval dropdown -->
          <div v-if="vervalFilterKey" class="jdf-dropdown">
            <button
              type="button"
              class="jdf-pill"
              :class="{ 'jdf-pill--active': !allVervalSelected }"
              @click.stop="toggleDropdown('verval')"
            >
              <i class="bi bi-patch-check jdf-pill-icon"></i>
              <span class="jdf-pill-label">{{ vervalFilterLabel }}</span>
              <span v-if="!allVervalSelected" class="jdf-pill-count">{{ selectedVerval.length }}</span>
              <i class="bi bi-chevron-down jdf-pill-chevron" :class="{ 'jdf-pill-chevron--open': openDropdown === 'verval' }"></i>
            </button>
            <div v-if="openDropdown === 'verval'" class="jdf-panel">
              <div class="jdf-panel-search">
                <i class="bi bi-search jdf-search-icon"></i>
                <input
                  v-model="vervalSearch"
                  type="text"
                  class="jdf-search-input"
                  placeholder="Cari..."
                  @click.stop
                />
              </div>
              <div class="jdf-panel-actions">
                <button type="button" class="jdf-action-link" @click.stop="toggleAllVerval(true)">Pilih semua</button>
                <span class="jdf-action-sep">·</span>
                <button type="button" class="jdf-action-link" @click.stop="toggleAllVerval(false)">Hapus semua</button>
                <span class="jdf-action-count">{{ selectedVerval.length }}/{{ vervalOptions.length }}</span>
              </div>
              <div class="jdf-panel-list">
                <p v-if="!filteredVervalOptions.length" class="jdf-no-result">Tidak ditemukan</p>
                <label
                  v-for="(opt, idx) in filteredVervalOptions"
                  :key="'v-' + idx"
                  class="jdf-list-item"
                  @click.stop
                >
                  <input
                    type="checkbox"
                    class="jdf-checkbox"
                    :checked="selectedVerval.includes(opt)"
                    @change="toggleVerval(opt, $event.target.checked)"
                  />
                  <span class="jdf-item-text">{{ opt }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Turvar dropdown -->
          <div v-if="showTurvarFilter" class="jdf-dropdown">
            <button
              type="button"
              class="jdf-pill"
              :class="{ 'jdf-pill--active': true }"
              @click.stop="toggleDropdown('turvar')"
            >
              <i class="bi bi-layers jdf-pill-icon"></i>
              <span class="jdf-pill-label">{{ turvarFilterLabel }}</span>
              <span class="jdf-pill-value">{{ selectedTurvar }}</span>
              <i class="bi bi-chevron-down jdf-pill-chevron" :class="{ 'jdf-pill-chevron--open': openDropdown === 'turvar' }"></i>
            </button>
            <div v-if="openDropdown === 'turvar'" class="jdf-panel">
              <div class="jdf-panel-list">
                <label
                  v-for="(opt, idx) in turvarOptions"
                  :key="'t-' + idx"
                  class="jdf-list-item"
                  @click.stop
                >
                  <input
                    type="radio"
                    name="jdf-turvar"
                    class="jdf-radio"
                    :checked="selectedTurvar === opt"
                    @change="toggleTurvar(opt)"
                  />
                  <span class="jdf-item-text">{{ opt }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Turtahun dropdown -->
          <div v-if="showTurtahunFilter" class="jdf-dropdown">
            <button
              type="button"
              class="jdf-pill"
              :class="{ 'jdf-pill--active': selectedTurtahun.length < turtahunOptions.length }"
              @click.stop="toggleDropdown('turtahun')"
            >
              <i class="bi bi-calendar3 jdf-pill-icon"></i>
              <span class="jdf-pill-label">Turtahun</span>
              <!-- <span v-if="selectedTurtahun.length < turtahunOptions.length" class="jdf-pill-count">{{ selectedTurtahun.length }}</span> -->
              <i class="bi bi-chevron-down jdf-pill-chevron" :class="{ 'jdf-pill-chevron--open': openDropdown === 'turtahun' }"></i>
            </button>
            <div v-if="openDropdown === 'turtahun'" class="jdf-panel">
              <div v-if="turtahunOptions.length > 6" class="jdf-panel-search">
                <i class="bi bi-search jdf-search-icon"></i>
                <input
                  v-model="turtahunSearch"
                  type="text"
                  class="jdf-search-input"
                  placeholder="Cari tahun..."
                  @click.stop
                />
              </div>
              <div class="jdf-panel-actions">
                <button type="button" class="jdf-action-link" @click.stop="selectedTurtahun = [...turtahunOptions]">Pilih semua</button>
                <span class="jdf-action-sep">·</span>
                <button type="button" class="jdf-action-link" @click.stop="selectedTurtahun = []">Hapus semua</button>
                <span class="jdf-action-count">{{ selectedTurtahun.length }}/{{ turtahunOptions.length }}</span>
              </div>
              <div class="jdf-panel-list">
                <p v-if="!filteredTurtahunOptions.length" class="jdf-no-result">Tidak ditemukan</p>
                <label
                  v-for="(opt, idx) in filteredTurtahunOptions"
                  :key="'tt-' + idx"
                  class="jdf-list-item"
                  @click.stop
                >
                  <input
                    type="checkbox"
                    class="jdf-checkbox"
                    :checked="selectedTurtahun.includes(opt)"
                    @change="toggleTurtahun(opt, $event.target.checked)"
                  />
                  <span class="jdf-item-text">{{ opt }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Aggregate dropdown -->
          <div v-if="hiddenInfo.isAggregateKey" class="jdf-dropdown">
            <button
              type="button"
              class="jdf-pill"
              :class="{ 'jdf-pill--active': isAggregateFilter !== 'all' }"
              @click.stop="toggleDropdown('aggregate')"
            >
              <i class="bi bi-calculator jdf-pill-icon"></i>
              <span class="jdf-pill-label">Agregat</span>
              <i class="bi bi-chevron-down jdf-pill-chevron" :class="{ 'jdf-pill-chevron--open': openDropdown === 'aggregate' }"></i>
            </button>
            <div v-if="openDropdown === 'aggregate'" class="jdf-panel jdf-panel--sm">
              <div class="jdf-panel-list">
                <label class="jdf-list-item" @click.stop>
                  <input type="radio" name="jdf-agg" class="jdf-radio" :checked="isAggregateFilter === 'all'" @change="isAggregateFilter = 'all'" />
                  <span class="jdf-item-text">Semua data</span>
                </label>
                <label class="jdf-list-item" @click.stop>
                  <input type="radio" name="jdf-agg" class="jdf-radio" :checked="isAggregateFilter === 'without'" @change="isAggregateFilter = 'without'" />
                  <span class="jdf-item-text">Tanpa agregat</span>
                </label>
                <label class="jdf-list-item" @click.stop>
                  <input type="radio" name="jdf-agg" class="jdf-radio" :checked="isAggregateFilter === 'only'" @change="isAggregateFilter = 'only'" />
                  <span class="jdf-item-text">Hanya agregat</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="jdf-right">
          <span class="jdf-summary">
            <span class="jdf-summary-num">{{ displayData.length }}</span>
            <span class="jdf-summary-total">/{{ tableData.length }} baris</span>
          </span>
          <button
            v-if="activeFilterCount > 0"
            type="button"
            class="jdf-reset-btn"
            @click="initChartFilterSelections"
          >
            <i class="bi bi-x-lg"></i> Reset
          </button>
        </div>
      </div>

      <div class="jd-view-panel">
        <JsonDatasetTableCard
          v-if="activeTab === 'table'"
          :table-data="displayData"
          :columns="visibleCols"
          :column-labels="columnLabels"
        />

        <JsonDatasetChartCard
          v-else-if="activeTab === 'chart'"
          :table-data="displayData"
          :columns="visibleCols"
          :column-labels="columnLabels"
          :all-entities="vervalOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
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

/** Dropdown filter state */
const openDropdown = ref(null)
const vervalSearch = ref('')
const turtahunSearch = ref('')

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? null : name
  if (openDropdown.value !== 'verval') vervalSearch.value = ''
  if (openDropdown.value !== 'turtahun') turtahunSearch.value = ''
}

function handleDocumentClick(e) {
  if (!e.target.closest('.jdf-dropdown')) {
    openDropdown.value = null
    vervalSearch.value = ''
    turtahunSearch.value = ''
  }
}

onMounted(() => document.addEventListener('mousedown', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleDocumentClick))

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

/** @type {import('vue').Ref<string[]>} */
const selectedVerval = ref([])
/** @type {import('vue').Ref<string>} */
const selectedTurvar = ref('')
/** @type {import('vue').Ref<string[]>} */
const selectedTurtahun = ref([])
/** 'all' | 'without' | 'only' — default show all rows */
const isAggregateFilter = ref('all')

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

const filteredVervalOptions = computed(() => {
  const q = vervalSearch.value.trim().toLowerCase()
  if (!q) return vervalOptions.value
  return vervalOptions.value.filter((o) => o.toLowerCase().includes(q))
})

const filteredTurtahunOptions = computed(() => {
  const q = turtahunSearch.value.trim().toLowerCase()
  if (!q) return turtahunOptions.value
  return turtahunOptions.value.filter((o) => o.toLowerCase().includes(q))
})

const activeFilterCount = computed(() => {
  let count = 0
  if (vervalFilterKey.value && !allVervalSelected.value) count++
  if (showTurtahunFilter.value && selectedTurtahun.value.length < turtahunOptions.value.length) count++
  if (hiddenInfo.value.isAggregateKey && isAggregateFilter.value !== 'all') count++
  return count
})

const displayData = computed(() => {
  const hi = hiddenInfo.value
  let rows = tableData.value

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
  if (!displayData.value.length) return
  const dataStr = JSON.stringify(displayData.value, null, 2)
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
    isAggregateFilter.value = 'all'
    fetchData()
  },
  { immediate: true }
)
</script>

<style scoped>
.json-insight-panel { margin-top: 0; }

.jip-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #d97706;
  border-radius: 50%;
  animation: jip-spin 0.8s linear infinite;
}
@keyframes jip-spin { to { transform: rotate(360deg); } }

/* ── Toolbar ── */
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

/* ── Tabs ── */
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* ════════════════════════════════
   Filter Bar
   ════════════════════════════════ */
.jdf-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.jdf-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.jdf-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.jdf-label {
  font-size: 0.8rem;
  color: #94a3b8;
  padding: 0 2px;
}

/* ── Pill trigger button ── */
.jdf-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.775rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  white-space: nowrap;
  line-height: 1;
}
.jdf-pill:hover {
  border-color: #fbbf24;
  background: #fffbf0;
  color: #92400e;
}
.jdf-pill--active {
  border-color: #f59e0b;
  background: #fff7ed;
  color: #b45309;
}
.jdf-pill--active:hover {
  border-color: #d97706;
  background: #fef3c7;
}

.jdf-pill-icon {
  font-size: 0.75rem;
  opacity: 0.7;
}
.jdf-pill-label {
  font-weight: 700;
}
.jdf-pill-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 100px;
  background: #d97706;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
}
.jdf-pill-value {
  font-size: 0.7rem;
  font-weight: 500;
  color: #92400e;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jdf-pill-chevron {
  font-size: 0.65rem;
  color: #94a3b8;
  transition: transform 0.18s ease;
}
.jdf-pill-chevron--open {
  transform: rotate(180deg);
}

/* ── Dropdown wrapper (relative anchor) ── */
.jdf-dropdown {
  position: relative;
}

/* ── Floating panel ── */
.jdf-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 200;
  width: 240px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  overflow: hidden;
}
.jdf-panel--sm { width: 180px; }

/* Search row */
.jdf-panel-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid #f1f5f9;
}
.jdf-search-icon {
  font-size: 0.75rem;
  color: #94a3b8;
  flex-shrink: 0;
}
.jdf-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.8rem;
  color: #1e293b;
}
.jdf-search-input::placeholder { color: #cbd5e1; }

/* Actions row */
.jdf-panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}
.jdf-action-link {
  border: none;
  background: none;
  padding: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: color 0.15s;
}
.jdf-action-link:hover { color: #d97706; }
.jdf-action-sep { font-size: 0.72rem; color: #cbd5e1; }
.jdf-action-count {
  margin-left: auto;
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
}

/* List */
.jdf-panel-list {
  max-height: 220px;
  overflow-y: auto;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.jdf-panel-list::-webkit-scrollbar { width: 4px; }
.jdf-panel-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

.jdf-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.1s;
  user-select: none;
}
.jdf-list-item:hover { background: #f8fafc; }

.jdf-checkbox,
.jdf-radio {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  accent-color: #d97706;
  cursor: pointer;
}
.jdf-item-text {
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jdf-list-item:hover .jdf-item-text { color: #1e293b; }

.jdf-no-result {
  margin: 0;
  padding: 10px 12px;
  font-size: 0.78rem;
  color: #94a3b8;
  text-align: center;
}

/* ── Right side summary + reset ── */
.jdf-summary {
  font-size: 0.75rem;
  white-space: nowrap;
}
.jdf-summary-num {
  font-weight: 700;
  color: #d97706;
}
.jdf-summary-total {
  color: #94a3b8;
}

.jdf-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1.5px solid #fca5a5;
  border-radius: 8px;
  background: #fff;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.jdf-reset-btn:hover {
  background: #fef2f2;
  border-color: #ef4444;
}
</style>
