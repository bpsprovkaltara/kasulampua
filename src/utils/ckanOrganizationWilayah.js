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
    return 'Kasulampua'
  }

  if (!title) {
    return humanizeSlug(slug) || slug
  }

  const normalized = title.replace(/\s+/g, ' ')

  if (/^badan\s+pusat\s+statistik$/i.test(normalized)) {
    return 'Kasulampua'
  }

  /** Hanya "BPS" / "bps" tanpa nama wilayah — dipetakan ke Indonesia (kantor pusat). */
  if (/^bps$/i.test(normalized)) {
    return 'Kasulampua'
  }

  let rest = normalized
    .replace(/^BPS\s+Provinsi\s+/i, '')
    .replace(/^BPS\s+Kabupaten\s+/i, '')
    .replace(/^BPS\s+Kota\s+/i, '')
    .replace(/^BPS\s+Kota\s+Administrasi\s+/i, '')
    .replace(/^BPS\s+/i, '')
    .trim()

  if (rest !== normalized) {
    if (!rest || /^bps$/i.test(rest)) return 'Kasulampua'
    return rest
  }

  return normalized
}

/**
 * Urutan domain BPS: 000 (pusat/Kasulampua), lalu 6100, 6200, ..., sesuai kode wilayah BPS.
 * Label di sini harus cocok dengan hasil ckanOrgToWilayahLabel().
 */
export const WILAYAH_DOMAIN_ORDER = [
  'Kasulampua',         // 000  — BPS pusat / agregat
  'Kalimantan Barat',   // 6100
  'Kalimantan Tengah',  // 6200
  'Kalimantan Selatan', // 6300
  'Kalimantan Timur',   // 6400
  'Kalimantan Utara',   // 6500
  'Sulawesi Utara',     // 7100
  'Sulawesi Tengah',    // 7200
  'Sulawesi Selatan',   // 7300
  'Sulawesi Tenggara',  // 7400
  'Gorontalo',          // 7500
  'Sulawesi Barat',     // 7600
  'Maluku',             // 8100
  'Maluku Utara',       // 8200
  'Papua',              // 9100
  'Papua Barat',        // 9600
]

export function sortWilayahRegions(regions) {
  return [...regions].sort((a, b) => {
    const ia = WILAYAH_DOMAIN_ORDER.indexOf(a.label)
    const ib = WILAYAH_DOMAIN_ORDER.indexOf(b.label)
    // Jika keduanya ada di daftar urutan domain → gunakan urutan domain
    if (ia !== -1 && ib !== -1) return ia - ib
    // Jika hanya salah satu yang dikenali → yang dikenali duluan
    if (ia !== -1) return -1
    if (ib !== -1) return 1
    // Keduanya tidak dikenali → urutkan alfabetis
    return a.label.localeCompare(b.label, 'id')
  })
}

/**
 * Mengurutkan hasil package_search CKAN berdasarkan urutan domain BPS.
 * Digunakan pada tampilan default (tanpa filter pencarian teks) di DatasetView.
 *
 * @param {Array} datasets - Array dataset dari CKAN (masing-masing punya field `organization`).
 * @returns {Array} Dataset yang sudah diurutkan.
 */
export function sortDatasetsByDomain(datasets) {
  return [...datasets].sort((a, b) => {
    const labelA = ckanOrgToWilayahLabel(a.organization)
    const labelB = ckanOrgToWilayahLabel(b.organization)
    const ia = WILAYAH_DOMAIN_ORDER.indexOf(labelA)
    const ib = WILAYAH_DOMAIN_ORDER.indexOf(labelB)
    // Keduanya dikenali → urutkan berdasarkan domain
    if (ia !== -1 && ib !== -1) return ia - ib
    // Hanya salah satu dikenali → yang dikenali duluan
    if (ia !== -1) return -1
    if (ib !== -1) return 1
    // Keduanya tidak dikenali → alfabetis berdasarkan judul
    return (a.title || '').localeCompare(b.title || '', 'id')
  })
}
