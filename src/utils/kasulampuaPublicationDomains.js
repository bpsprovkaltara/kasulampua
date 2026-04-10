/** BPS domain_id (4-digit) ↔ nama provinsi KASULAMPUA untuk filter publikasi */
export const PUBLICATION_DOMAIN_OPTIONS = [
  { domain_id: '6100', label: 'Kalimantan Barat' },
  { domain_id: '6200', label: 'Kalimantan Tengah' },
  { domain_id: '6300', label: 'Kalimantan Selatan' },
  { domain_id: '6400', label: 'Kalimantan Timur' },
  { domain_id: '6500', label: 'Kalimantan Utara' },
  { domain_id: '7100', label: 'Sulawesi Utara' },
  { domain_id: '7200', label: 'Sulawesi Tengah' },
  { domain_id: '7300', label: 'Sulawesi Selatan' },
  { domain_id: '7400', label: 'Sulawesi Tenggara' },
  { domain_id: '7500', label: 'Gorontalo' },
  { domain_id: '7600', label: 'Sulawesi Barat' },
  { domain_id: '8100', label: 'Maluku' },
  { domain_id: '8200', label: 'Maluku Utara' },
  { domain_id: '9100', label: 'Papua' },
  { domain_id: '9600', label: 'Papua Barat' },
]

export function publicationDomainLabel(domainId) {
  if (!domainId) return ''
  const row = PUBLICATION_DOMAIN_OPTIONS.find((o) => o.domain_id === String(domainId))
  return row ? row.label : `Domain ${domainId}`
}
