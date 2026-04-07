<template>
  <div class="jd-table-view">
    <div v-if="tableData.length && columns.length" class="jd-table-wrap">
      <div class="table-responsive">
        <table class="table table-sm table-hover mb-0">
          <thead>
            <tr>
              <th class="jd-th text-center" style="width: 48px">#</th>
              <th
                v-for="col in columns"
                :key="col"
                class="jd-th"
                :class="{ 'text-end': isNilaiColumn(col) }"
              >
                {{ formatHeader(col) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in paginatedData" :key="idx">
              <td class="text-center text-muted small jd-td">{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
              <td
                v-for="col in columns"
                :key="col"
                class="jd-td"
                :class="{ 'text-end jd-td-nilai': isNilaiColumn(col) }"
              >
                {{ formatCell(col, row[col]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="totalPages > 1"
        class="jd-table-footer d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 px-1"
      >
        <span class="text-muted small">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <div class="pagination-container d-flex gap-1 align-items-center">
          <button
            type="button"
            class="btn btn-pagination"
            :disabled="currentPage <= 1"
            @click="currentPage--"
            aria-label="Previous page"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <template v-for="page in pageNumbers" :key="page">
            <button
              v-if="typeof page === 'number'"
              type="button"
              class="btn btn-pagination"
              :class="{ active: page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <span v-else class="pagination-ellipsis px-1">{{ page }}</span>
          </template>

          <button
            type="button"
            class="btn btn-pagination"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            aria-label="Next page"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-muted small py-3 text-center">Tidak ada data untuk ditampilkan.</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  tableData: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] }
})

const currentPage = ref(1)
const pageSize = 50

const totalPages = computed(() => Math.ceil(props.tableData.length / pageSize))

const pageNumbers = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const pages = []
  const range = 1 

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || 
      i === total || 
      (i >= current - range && i <= current + range) 
    ) {
      pages.push(i)
    } else if (i === current - range - 1 || i === current + range + 1) {
      pages.push('...')
    }
  }
  return pages.filter((item, pos, self) => {
    return typeof item === 'number' || (item === '...' && self[pos - 1] !== '...')
  })
})

const paginatedData = computed(() =>
  props.tableData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

watch(
  () => props.tableData.length,
  () => {
    currentPage.value = 1
  }
)

const formatHeader = (col) =>
  String(col).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const isNilaiColumn = (col) => String(col).toLowerCase() === 'nilai'

function parseLocaleNumber(raw) {
  if (raw === null || raw === undefined) return null
  const s = String(raw).trim()
  if (s === '' || s === '-' || s === '—') return null
  const normalized = s.replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

function formatCell(col, raw) {
  if (!isNilaiColumn(col)) return raw === null || raw === undefined ? '' : raw
  const n = parseLocaleNumber(raw)
  if (n === null || !Number.isFinite(n)) return raw === null || raw === undefined ? '' : raw
  if (Math.abs(n) <= 999) return String(raw).trim()
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 20 }).format(n)
}
</script>

<style scoped>
.jd-table-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: white;
}
.jd-th {
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
.jd-td {
  font-size: 0.875rem;
  padding: 0.55rem 1rem !important;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.jd-td-nilai {
  font-variant-numeric: tabular-nums;
}
.jd-table-footer {
  padding: 0 0.25rem;
}

.btn-pagination {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-pagination:hover:not(:disabled) {
  border-color: #d97706;
  color: #d97706;
  background: #fffbeb;
}

.btn-pagination.active {
  background: #d97706;
  color: white;
  border-color: #d97706;
  box-shadow: 0 2px 4px rgba(217, 119, 6, 0.2);
}

.btn-pagination:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-ellipsis {
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
