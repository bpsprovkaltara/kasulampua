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
      <div class="jd-toolbar d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
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
          <a
            v-if="resource.url && resource.url !== '-'"
            :href="resource.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm btn-outline-secondary rounded-pill px-3"
          >
            <i class="bi bi-filetype-json me-1"></i> Unduh JSON
          </a>
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
        :table-data="tableData"
        :columns="visibleCols"
      />

      <JsonDatasetChartCard
        v-else-if="activeTab === 'chart'"
        :table-data="tableData"
        :columns="visibleCols"
      />
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

const hiddenInfo = computed(() => computeHiddenColumns(tableData.value, allColumns.value))

const visibleCols = computed(() =>
  visibleColumnsList(allColumns.value, hiddenInfo.value.hiddenKeys)
)

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
    const { cols, rows } = parseJsonResource(json)
    if (!rows.length) throw new Error('Format JSON tidak dikenali atau data kosong')

    allColumns.value = cols
    tableData.value = rows
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
.rv-tab:hover {
  color: #1e293b;
}
.rv-tab.active {
  background: white;
  color: #d97706;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
