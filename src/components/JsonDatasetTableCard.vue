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
                class="jd-th jd-sortable-th"
                :class="{ 'text-end': isNilaiColumn(col) }"
                @click="toggleSort(col)"
              >
                <span class="d-inline-flex align-items-center gap-1">
                  {{ formatHeader(col) }}
                  <i
                    class="bi"
                    :class="sortIconClass(col)"
                    aria-hidden="true"
                  ></i>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in paginatedData"
              :key="idx"
              :class="{ 'row-aggregate': isAggregateRow(row) }"
            >
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
        class="jd-table-footer"
      >
        <span class="jd-page-info">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <PaginationControl :current-page="currentPage" :total-pages="totalPages" @change="setPage" />
      </div>
    </div>
    <div v-else class="text-muted small py-3 text-center">Tidak ada data untuk ditampilkan.</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PaginationControl from './PaginationControl.vue'

const props = defineProps({
  tableData: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  columnLabels: { type: Object, default: () => ({}) }
})

const currentPage = ref(1)
const pageSize = 50
const sortKey = ref('')
const sortDirection = ref('asc')

const sortedData = computed(() => {
  if (!sortKey.value) return props.tableData
  const col = sortKey.value
  const dir = sortDirection.value === 'desc' ? -1 : 1
  return [...props.tableData].sort((a, b) => compareRows(col, a[col], b[col]) * dir)
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / pageSize))
const paginatedData = computed(() =>
  sortedData.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

watch(
  () => props.tableData.length,
  () => {
    currentPage.value = 1
  }
)

const formatHeader = (col) => {
  if (props.columnLabels?.[col]) return props.columnLabels[col]
  return String(col).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const isNilaiColumn = (col) => String(col).toLowerCase() === 'nilai'

function toggleSort(col) {
  if (sortKey.value !== col) {
    sortKey.value = col
    sortDirection.value = 'asc'
  } else {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }
  currentPage.value = 1
}

function sortIconClass(col) {
  if (sortKey.value !== col) return 'bi-arrow-down-up jd-sort-icon'
  return sortDirection.value === 'asc'
    ? 'bi-sort-down-alt jd-sort-icon-active'
    : 'bi-sort-up jd-sort-icon-active'
}

function setPage(page) {
  currentPage.value = page
}

/** Angka CKAN (titik = desimal) atau id-ID (titik ribuan, koma desimal) → Number; null jika bukan angka */
function parseLocaleNumber(raw) {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null
  const s = String(raw).trim()
  if (s === '' || s === '-' || s === '—') return null
  if (s.includes(',')) {
    const normalized = s.replace(/\./g, '').replace(',', '.')
    const n = Number(normalized)
    return Number.isFinite(n) ? n : null
  }
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : null
}

/**
 * Kolom nilai: selalu format id-ID (ribuan titik, desimal koma); CKAN mentah memakai titik desimal.
 */
function formatCell(col, raw) {
  if (!isNilaiColumn(col)) return raw === null || raw === undefined ? '' : raw
  const n = parseLocaleNumber(raw)
  if (n === null || !Number.isFinite(n)) return raw === null || raw === undefined ? '' : raw
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 20 }).format(n)
}

function compareRows(col, aRaw, bRaw) {
  const aNilai = isNilaiColumn(col) ? parseLocaleNumber(aRaw) : null
  const bNilai = isNilaiColumn(col) ? parseLocaleNumber(bRaw) : null
  if (aNilai !== null && bNilai !== null) return aNilai - bNilai

  const aEmpty = aRaw === null || aRaw === undefined || String(aRaw).trim() === ''
  const bEmpty = bRaw === null || bRaw === undefined || String(bRaw).trim() === ''
  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1

  const aNum = parseLocaleNumber(aRaw)
  const bNum = parseLocaleNumber(bRaw)
  if (aNum !== null && bNum !== null) return aNum - bNum

  const aStr = String(aRaw).trim()
  const bStr = String(bRaw).trim()
  return aStr.localeCompare(bStr, 'id', { numeric: true, sensitivity: 'base' })
}

function isAggregateRow(row) {
  if (!row || !('is_aggregate' in row)) return false
  const v = row['is_aggregate']
  if (v === true || v === 1) return true
  if (typeof v === 'string') {
    const u = v.trim().toLowerCase()
    return u === 'true' || u === '1' || u === 'yes' || u === 'ya'
  }
  return false
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
.jd-sortable-th {
  cursor: pointer;
  user-select: none;
}
.jd-sort-icon {
  font-size: 0.75rem;
  color: #94a3b8;
}
.jd-sort-icon-active {
  font-size: 0.75rem;
  color: var(--primary-color, #d97706);
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
.row-aggregate td {
  background-color: #fffbeb !important;
  font-weight: 600;
  color: #92400e;
}

.jd-table-footer {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.jd-page-info {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

@media (max-width: 768px) {
  .jd-table-footer {
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
  }
  .jd-page-info {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
}
</style>
