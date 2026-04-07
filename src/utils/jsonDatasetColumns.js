/**
 * Helpers for CKAN JSON dataset preview: column detection and visibility rules.
 */

const normalizeCell = (v) => (v === null || v === undefined ? '' : String(v).trim())

/**
 * @param {string[]} columns
 * @param {string} name
 * @param {number} oneBasedIndex - 1-based column index fallback
 */
export function pickColumnByNameOrIndex(columns, name, oneBasedIndex) {
  if (!columns?.length) return null
  const lower = name.toLowerCase()
  const byName = columns.find((c) => String(c).toLowerCase() === lower)
  if (byName) return byName
  const i = oneBasedIndex - 1
  if (i >= 0 && i < columns.length) return columns[i]
  return null
}

/**
 * Hide column if every row value equals the given literal (after trim).
 * Empty rows are ignored for "all match" — if no non-empty values, do not hide.
 */
export function columnAllEqual(rows, colKey, literal, caseInsensitive = false) {
  if (!rows.length || !colKey) return false
  const target = String(literal).trim()
  const norm = (s) => (caseInsensitive ? s.toLowerCase() : s)
  const t = norm(target)
  let sawNonEmpty = false
  for (const row of rows) {
    const raw = normalizeCell(row[colKey])
    if (raw === '') continue
    sawNonEmpty = true
    if (norm(raw) !== t) return false
  }
  return sawNonEmpty
}

/**
 * @param {object[]} rows
 * @param {string[]} columns - original column order
 * @returns {{ hiddenKeys: Set<string>, turvarKey: string|null, turtahunKey: string|null }}
 */
export function computeHiddenColumns(rows, columns) {
  const hiddenKeys = new Set()
  const turvarKey = pickColumnByNameOrIndex(columns, 'turvar_label', 2)
  const turtahunKey = pickColumnByNameOrIndex(columns, 'turtahun', 4)

  if (turvarKey && columnAllEqual(rows, turvarKey, 'Tidak ada', true)) {
    hiddenKeys.add(turvarKey)
  }
  if (turtahunKey && columnAllEqual(rows, turtahunKey, 'tahunan', true)) {
    hiddenKeys.add(turtahunKey)
  }

  return { hiddenKeys, turvarKey, turtahunKey }
}

/**
 * @param {string[]} columns
 * @param {Set<string>} hiddenKeys
 */
export function visibleColumnsList(columns, hiddenKeys) {
  return columns.filter((c) => !hiddenKeys.has(c))
}
