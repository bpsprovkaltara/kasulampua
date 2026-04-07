/**
 * Parse CKAN/BPS JSON resource into { cols, rows } for tabular preview.
 */

export function parseBpsJson(json) {
  if (Array.isArray(json.records) && json.records.length) {
    const allCols = Object.keys(json.records[0])
    const cols = allCols.filter((c) => !c.endsWith('_id'))
    return {
      cols,
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
    if (!vervars.length) return { cols: [], rows: [] }

    if (years.length) {
      const cols = [vervarLabel, ...years.map((y) => String(y.label))]
      const rows = vervars.map((vv) => {
        const row = { [vervarLabel]: vv.label }
        years.forEach((yr) => {
          row[String(yr.label)] = json.data?.[vv.val]?.[yr.val] ?? '-'
        })
        return row
      })
      return { cols, rows }
    }
    const cols = [vervarLabel, 'Nilai']
    return {
      cols,
      rows: vervars.map((vv) => ({
        [vervarLabel]: vv.label,
        Nilai: json.data?.[vv.val] ?? '-'
      }))
    }
  }

  return { cols: [], rows: [] }
}

/**
 * @param {unknown} json
 * @returns {{ cols: string[], rows: object[] }}
 */
export function parseJsonResource(json) {
  if (Array.isArray(json)) {
    if (json.length) {
      return { cols: Object.keys(json[0]), rows: json }
    }
    return { cols: [], rows: [] }
  }
  const { cols, rows } = parseBpsJson(json)
  if (rows.length) return { cols, rows }
  return { cols: [], rows: [] }
}
