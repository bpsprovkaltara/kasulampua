/**
 * Parse CKAN/BPS JSON resource into { cols, rows, columnLabels } for tabular preview.
 */

/** label_overrides keys (BPS export) → nama field di records */
const LABEL_OVERRIDE_TO_FIELD = {
  vervar_col: 'vervar_label',
  turvar_col: 'turvar_label',
  tahun_col: 'tahun',
  turtahun_col: 'turtahun',
  nilai_col: 'nilai'
}

function normalizeLabelMap(raw) {
  if (raw == null) return {}
  if (typeof raw === 'string') {
    try {
      const o = JSON.parse(raw)
      return typeof o === 'object' && o && !Array.isArray(o) ? { ...o } : {}
    } catch {
      return {}
    }
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) return { ...raw }
  return {}
}

/**
 * column_labels + label_overrides di root JSON resource (bukan metadata CKAN).
 * label_overrides mengisi field standar; column_labels menang atas konflik nama field.
 */
export function extractColumnLabelsFromJsonRoot(json) {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {}

  const fromOverrides = {}
  const overrides = normalizeLabelMap(json.label_overrides)
  for (const [overrideKey, field] of Object.entries(LABEL_OVERRIDE_TO_FIELD)) {
    const v = overrides[overrideKey]
    if (v != null && String(v).trim() !== '') fromOverrides[field] = String(v).trim()
  }

  const fromExplicit = normalizeLabelMap(json.column_labels)
  return { ...fromOverrides, ...fromExplicit }
}

export function parseBpsJson(json) {
  if (Array.isArray(json.records) && json.records.length) {
    const allCols = Object.keys(json.records[0])
    const cols = allCols.filter((c) => !c.endsWith('_id'))
    const columnLabels = extractColumnLabelsFromJsonRoot(json)
    return {
      cols,
      columnLabels,
      rows: json.records.map((r) => {
        const row = {}
        cols.forEach((c) => {
          row[c] = r[c]
        })
        return row
      })
    }
  }

  if (json.dimensions && json.data) {
    const vervarLabel = json.dimensions.label_vervar || 'Wilayah'
    const vervars = json.dimensions.vertical_variables || []
    const years = json.dimensions.periods || json.dimensions.years || []
    if (!vervars.length) {
      return { cols: [], rows: [], columnLabels: extractColumnLabelsFromJsonRoot(json) }
    }

    if (years.length) {
      const cols = [vervarLabel, ...years.map((y) => String(y.label))]
      const columnLabels = extractColumnLabelsFromJsonRoot(json)
      const rows = vervars.map((vv) => {
        const row = { [vervarLabel]: vv.label }
        years.forEach((yr) => {
          row[String(yr.label)] = json.data?.[vv.val]?.[yr.val] ?? '-'
        })
        return row
      })
      return { cols, rows, columnLabels }
    }
    const cols = [vervarLabel, 'Nilai']
    return {
      cols,
      columnLabels: extractColumnLabelsFromJsonRoot(json),
      rows: vervars.map((vv) => ({
        [vervarLabel]: vv.label,
        Nilai: json.data?.[vv.val] ?? '-'
      }))
    }
  }

  return { cols: [], rows: [], columnLabels: {} }
}

/**
 * @param {unknown} json
 * @returns {{ cols: string[], rows: object[], columnLabels: Record<string, string> }}
 */
export function parseJsonResource(json) {
  if (Array.isArray(json)) {
    if (json.length) {
      return { cols: Object.keys(json[0]), rows: json, columnLabels: {} }
    }
    return { cols: [], rows: [], columnLabels: {} }
  }
  const { cols, rows, columnLabels = {} } = parseBpsJson(json)
  if (rows.length) return { cols, rows, columnLabels }
  return { cols: [], rows: [], columnLabels }
}
