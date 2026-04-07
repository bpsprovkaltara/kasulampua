/**
 * Build Chart.js line datasets: x = periode (tahun/bulan/triwulan/dll), y = nilai, satu garis per entitas (kolom pertama).
 */

const normalizeCell = (v) => (v === null || v === undefined ? '' : String(v).trim())

function parseNumber(v) {
  if (v === null || v === undefined || v === '') return null
  const n = Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

/** Nama bulan Indonesia → angka 1–12 */
const ID_MONTHS = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12
}

function romanQuarterToStartMonth(r) {
  const u = String(r).toUpperCase().trim()
  if (u === 'I' || u === '1') return 1
  if (u === 'II' || u === '2') return 4
  if (u === 'III' || u === '3') return 7
  if (u === 'IV' || u === '4') return 10
  const n = parseInt(u, 10)
  if (n >= 1 && n <= 4) return (n - 1) * 3 + 1
  return 1
}

/**
 * Urutan kronologis perkiraan; nilai lebih kecil = lebih awal.
 * Jika tidak terparse, kembalikan NaN (urutkan nanti dengan urutan kemunculan).
 * @param {string} label
 * @returns {number}
 */
function parsePeriodSortKey(label) {
  const s = normalizeCell(label)
  if (!s) return Number.NaN

  // Tahun murni 4 digit
  if (/^\d{4}$/.test(s)) {
    const y = parseInt(s, 10)
    if (y >= 1000 && y <= 9999) return y * 10000 + 600
  }

  // ISO YYYY-MM atau YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/)
  if (iso) {
    const yy = parseInt(iso[1], 10)
    const mm = parseInt(iso[2], 10)
    const dd = iso[3] ? parseInt(iso[3], 10) : 1
    return yy * 10000 + mm * 100 + dd
  }

  // Bulan Indonesia + tahun: "Januari 2024"
  const monthRe = new RegExp(
    `^(${Object.keys(ID_MONTHS).join('|')})\\s+(\\d{4})$`,
    'i'
  )
  const bm = s.match(monthRe)
  if (bm) {
    const mon = ID_MONTHS[bm[1].toLowerCase()]
    const yy = parseInt(bm[2], 10)
    if (mon && yy >= 1000) return yy * 10000 + mon * 100 + 15
  }

  // Triwulan … 2024
  const tri = s.match(/triwulan\s*([ivxIVX\d]+)\s*(\d{4})/i)
  if (tri) {
    const startM = romanQuarterToStartMonth(tri[1])
    const yy = parseInt(tri[2], 10)
    return yy * 10000 + startM * 100 + 1
  }

  // Semester … 2024
  const sem = s.match(/semester\s*([12]|i|ii)\s*(\d{4})/i)
  if (sem) {
    let sm = sem[1].toLowerCase()
    const firstMonth = sm === '1' || sm === 'i' ? 1 : 7
    const yy = parseInt(sem[2], 10)
    return yy * 10000 + firstMonth * 100 + 1
  }

  // Angka tahun di akhir string (fallback lemah)
  const tailYear = s.match(/(\d{4})\s*$/)
  if (tailYear) {
    const yy = parseInt(tailYear[1], 10)
    if (yy >= 1000 && yy <= 9999) return yy * 10000 + 600
  }

  return Number.NaN
}

function parseYearLabel(label) {
  const s = normalizeCell(label)
  if (!s) return null
  const n = parseInt(s, 10)
  if (Number.isFinite(n) && n >= 1000 && n <= 9999) return n
  return null
}

/**
 * Kolom periode (long format): prioritas nama umum BPS/CSV.
 */
function findPeriodColumn(visibleColumns) {
  const order = ['tahun', 'turtahun', 'periode', 'bulan', 'triwulan', 'semester']
  const lower = (c) => String(c).toLowerCase()
  for (const name of order) {
    const found = visibleColumns.find((c) => lower(c) === name)
    if (found) return found
  }
  return null
}

function findNilaiColumn(visibleColumns) {
  const lower = (c) => String(c).toLowerCase()
  return visibleColumns.find((c) => lower(c) === 'nilai') || null
}

/**
 * Kumpulkan label periode unik, urutkan: sortKey valid dulu, lalu urutan kemunculan.
 */
function collectSortedPeriodLabels(rows, periodCol) {
  /** @type {Map<string, { sortKey: number, firstIndex: number }>} */
  const meta = new Map()
  let rowIndex = 0
  for (const row of rows) {
    const raw = normalizeCell(row[periodCol])
    if (raw === '') {
      rowIndex++
      continue
    }
    if (!meta.has(raw)) {
      const sk = parsePeriodSortKey(raw)
      meta.set(raw, {
        sortKey: Number.isFinite(sk) ? sk : Number.POSITIVE_INFINITY,
        firstIndex: rowIndex
      })
    }
    rowIndex++
  }
  const labels = [...meta.keys()]
  labels.sort((a, b) => {
    const ma = meta.get(a)
    const mb = meta.get(b)
    const finiteA = Number.isFinite(ma.sortKey) && ma.sortKey !== Number.POSITIVE_INFINITY
    const finiteB = Number.isFinite(mb.sortKey) && mb.sortKey !== Number.POSITIVE_INFINITY
    if (finiteA && finiteB && ma.sortKey !== mb.sortKey) return ma.sortKey - mb.sortKey
    if (finiteA && !finiteB) return -1
    if (!finiteA && finiteB) return 1
    return ma.firstIndex - mb.firstIndex
  })
  return labels
}

const CHART_COLORS = [
  '#d97706', '#0ea5e9', '#16a34a', '#8b5cf6', '#dc2626',
  '#06b6d4', '#f59e0b', '#ec4899', '#14b8a6', '#6366f1'
]

function makeDatasetStyle(i) {
  const c = CHART_COLORS[i % CHART_COLORS.length]
  return {
    borderColor: c,
    backgroundColor: c + '33',
    borderWidth: 2,
    tension: 0.25,
    fill: false,
    pointRadius: 3,
    pointHoverRadius: 5
  }
}

/**
 * Long format: entityCol, periodCol, nilaiCol
 */
function buildLongFormat(rows, entityCol, periodCol, nilaiCol) {
  /** @type {Map<string, Map<string, number|null>>} */
  const byEntity = new Map()

  for (const row of rows) {
    const entity = normalizeCell(row[entityCol]) || '(tanpa nama)'
    const periodLabel = normalizeCell(row[periodCol])
    if (periodLabel === '') continue
    const val = parseNumber(row[nilaiCol])
    if (!byEntity.has(entity)) byEntity.set(entity, new Map())
    byEntity.get(entity).set(periodLabel, val)
  }

  const sortedLabels = collectSortedPeriodLabels(rows, periodCol)
  if (!sortedLabels.length) return { labels: [], datasets: [] }

  const datasets = [...byEntity.entries()].map(([entity, map], i) => ({
    label: entity,
    data: sortedLabels.map((lab) => {
      const v = map.get(lab)
      return v === undefined ? null : v
    }),
    ...makeDatasetStyle(i)
  }))

  return { labels: sortedLabels, datasets }
}

/**
 * Wide format: kolom pertama = entitas; kolom lain = periode (header bisa tahun, bulan, triwulan, dll).
 */
function buildWideFormat(rows, visibleColumns) {
  if (visibleColumns.length < 2) return null
  const entityCol = visibleColumns[0]
  /** Hanya header yang terbaca sebagai periode/tahun; jika tidak ada, pakai semua kolom sisanya (kompatibilitas). */
  let candidateCols = visibleColumns.slice(1).filter((c) => {
    if (parseYearLabel(c) !== null) return true
    return Number.isFinite(parsePeriodSortKey(c))
  })
  if (candidateCols.length === 0) {
    candidateCols = visibleColumns.slice(1)
  }

  const withOrder = candidateCols.map((col, order) => ({
    col,
    sortKey: parsePeriodSortKey(col),
    order
  }))

  withOrder.sort((a, b) => {
    const fa = Number.isFinite(a.sortKey)
    const fb = Number.isFinite(b.sortKey)
    if (fa && fb && a.sortKey !== b.sortKey) return a.sortKey - b.sortKey
    if (fa && !fb) return -1
    if (!fa && fb) return 1
    return a.order - b.order
  })

  const periodCols = withOrder.map((w) => w.col)
  if (periodCols.length === 0) return null

  const labels = periodCols.map((c) => String(c))

  /** @type {Map<string, Map<string, number|null>>} */
  const byEntity = new Map()

  for (const row of rows) {
    const entity = normalizeCell(row[entityCol]) || '(tanpa nama)'
    if (!byEntity.has(entity)) byEntity.set(entity, new Map())
    const map = byEntity.get(entity)
    for (const col of periodCols) {
      map.set(col, parseNumber(row[col]))
    }
  }

  const datasets = [...byEntity.entries()].map(([entity, map], i) => ({
    label: entity,
    data: periodCols.map((col) => {
      const v = map.get(col)
      return v === undefined ? null : v
    }),
    ...makeDatasetStyle(i)
  }))

  return { labels, datasets }
}

/**
 * Legacy: hanya kolom header numerik 4 digit (tahun).
 */
function buildWideFormatYearOnly(rows, visibleColumns) {
  if (visibleColumns.length < 2) return null
  const entityCol = visibleColumns[0]
  const yearCols = visibleColumns.slice(1).filter((c) => parseYearLabel(c) !== null)
  if (yearCols.length === 0) return null

  const sortedYears = yearCols
    .map((c) => parseYearLabel(c))
    .filter((y) => y !== null)
    .sort((a, b) => a - b)

  const labels = sortedYears.map(String)

  /** @type {Map<string, Map<number, number|null>>} */
  const byEntity = new Map()

  for (const row of rows) {
    const entity = normalizeCell(row[entityCol]) || '(tanpa nama)'
    if (!byEntity.has(entity)) byEntity.set(entity, new Map())
    const map = byEntity.get(entity)
    for (const col of yearCols) {
      const y = parseYearLabel(col)
      if (y === null) continue
      map.set(y, parseNumber(row[col]))
    }
  }

  const datasets = [...byEntity.entries()].map(([entity, map], i) => ({
    label: entity,
    data: sortedYears.map((yr) => {
      const v = map.get(yr)
      return v === undefined ? null : v
    }),
    ...makeDatasetStyle(i)
  }))

  return { labels, datasets }
}

/**
 * @param {object[]} rows
 * @param {string[]} visibleColumns
 * @returns {{ labels: string[], datasets: object[] } | null}
 */
export function buildLineChartData(rows, visibleColumns) {
  if (!rows?.length || !visibleColumns?.length) return null

  const entityCol = visibleColumns[0]
  const nilaiCol = findNilaiColumn(visibleColumns)
  const periodCol = findPeriodColumn(visibleColumns)

  if (periodCol && nilaiCol && entityCol) {
    const long = buildLongFormat(rows, entityCol, periodCol, nilaiCol)
    if (long.labels.length && long.datasets.length) return long
  }

  const wide = buildWideFormat(rows, visibleColumns)
  if (wide && wide.labels.length && wide.datasets.length) return wide

  const wideYear = buildWideFormatYearOnly(rows, visibleColumns)
  if (wideYear && wideYear.labels.length && wideYear.datasets.length) return wideYear

  return null
}
