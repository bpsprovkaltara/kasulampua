/**
 * Derives a short "wilayah" label from CKAN organization fields (BPS-style naming).
 * - "Badan Pusat Statistik" (or national slug) → "Indonesia"
 * - Provincial / other BPS titles → text without leading "BPS" / "BPS Provinsi" / etc.
 */
function humanizeSlug(slug) {
  if (!slug) return ''
  return String(slug)
    .replace(/_/g, '-')
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Slug kantor pusat BPS di CKAN sering `bps` atau `badan-pusat-statistik` (bukan teks panjang).
 */
function isNationalBpsSlug(slug) {
  return slug === 'badan-pusat-statistik' || slug === 'bps'
}

export function ckanOrgToWilayahLabel(org) {
  if (!org || typeof org !== 'object') return ''

  const title = String(org.display_name || org.title || '').trim()
  const slug = String(org.name || '')
    .toLowerCase()
    .replace(/_/g, '-')

  if (isNationalBpsSlug(slug)) {
    return 'Indonesia'
  }

  if (!title) {
    return humanizeSlug(slug) || slug
  }

  const normalized = title.replace(/\s+/g, ' ')

  if (/^badan\s+pusat\s+statistik$/i.test(normalized)) {
    return 'Indonesia'
  }

  /** Hanya "BPS" / "bps" tanpa nama wilayah — dipetakan ke Indonesia (kantor pusat). */
  if (/^bps$/i.test(normalized)) {
    return 'Indonesia'
  }

  let rest = normalized
    .replace(/^BPS\s+Provinsi\s+/i, '')
    .replace(/^BPS\s+Kabupaten\s+/i, '')
    .replace(/^BPS\s+Kota\s+/i, '')
    .replace(/^BPS\s+Kota\s+Administrasi\s+/i, '')
    .replace(/^BPS\s+/i, '')
    .trim()

  if (rest !== normalized) {
    if (!rest || /^bps$/i.test(rest)) return 'Indonesia'
    return rest
  }

  return normalized
}

export function sortWilayahRegions(regions) {
  return [...regions].sort((a, b) => {
    if (a.label === 'Indonesia') return -1
    if (b.label === 'Indonesia') return 1
    return a.label.localeCompare(b.label, 'id')
  })
}
