function escapeSolrPhraseValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
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
