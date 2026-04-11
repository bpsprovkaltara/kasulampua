function escapeSolrPhraseValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/**
 * Filter Solr CKAN untuk satu atau banyak organization slug (sama seperti DatasetView,
 * tetapi dengan OR bila lebih dari satu).
 *
 * @param {string[]} organizations - slug `organization.name` dari CKAN
 * @returns {string} contoh: organization:"a" atau organization:("a" OR "b")
 */
export function buildOrganizationFilterQuery(organizations) {
  const orgs = (organizations || []).map((o) => String(o || '').trim()).filter(Boolean)
  if (!orgs.length) return ''
  if (orgs.length === 1) {
    return `organization:"${escapeSolrPhraseValue(orgs[0])}"`
  }
  const inner = orgs.map((o) => `"${escapeSolrPhraseValue(o)}"`).join(' OR ')
  return `organization:(${inner})`
}

export function buildPackageSearchFilterQuery({ group, organization } = {}) {
  const filters = []

  if (group) {
    filters.push(`groups:"${escapeSolrPhraseValue(group)}"`)
  }

  if (organization) {
    filters.push(`organization:"${escapeSolrPhraseValue(organization)}"`)
  }

  return filters.join(' AND ')
}
