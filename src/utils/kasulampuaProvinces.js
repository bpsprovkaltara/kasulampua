export const KASULAMPUA_REGIONS = [
  {
    key: 'kalimantan',
    label: 'Kalimantan',
    count: 5,
    color: '#16a34a',
    provinces: 'Kaltara · Kaltim · Kalteng · Kalsel · Kalbar',
    bounds: [[-4.2, 108.2], [4.2, 118.8]],
    provinceNames: [
      'Kalimantan Barat',
      'Kalimantan Tengah',
      'Kalimantan Selatan',
      'Kalimantan Timur',
      'Kalimantan Utara',
    ],
  },
  {
    key: 'sulawesi',
    label: 'Sulawesi',
    count: 6,
    color: '#dc2626',
    provinces: 'Sulut · Sulteng · Sulsel · Sultra · Gorontalo · Sulbar',
    bounds: [[-6, 119.3], [2, 125.3]],
    provinceNames: [
      'Sulawesi Utara',
      'Gorontalo',
      'Sulawesi Tengah',
      'Sulawesi Tenggara',
      'Sulawesi Selatan',
      'Sulawesi Barat',
    ],
  },
  {
    key: 'maluku',
    label: 'Maluku',
    count: 2,
    color: '#2563eb',
    provinces: 'Maluku · Maluku Utara',
    bounds: [[-9, 123], [2.5, 135.5]],
    provinceNames: ['Maluku', 'Maluku Utara'],
  },
  {
    key: 'papua',
    label: 'Papua',
    count: 6,
    color: '#ca8a04',
    provinces: 'Papua · Papua Barat · Papua Selatan · Papua Tengah · Papua Pegunungan · Papua Barat Daya',
    bounds: [[-9, 130.5], [0, 141.1]],
    provinceNames: [
      'Papua',
      'Papua Barat',
      'Papua Selatan',
      'Papua Tengah',
      'Papua Pegunungan',
      'Papua Barat Daya',
    ],
  },
  {
    key: 'kasulampua',
    label: 'Kasulampua',
    count: 19,
    color: '#d97706',
    provinces: '',
    bounds: [[-11, 108], [6, 141]],
    provinceNames: [], // all above
  },
]

const provinceToRegion = {}
KASULAMPUA_REGIONS.forEach((r) => {
  if (r.key === 'kasulampua') return
  r.provinceNames.forEach((p) => {
    const norm = normalizeNameForMatch(p)
    provinceToRegion[norm] = r.key
  })
})

export const PROVINCE_NAME_ALIASES = {
  'irian jaya barat': 'papua barat',
  'west papua': 'papua barat',
  'papua barat daya': 'papua barat daya',
  'south papua': 'papua selatan',
  'central papua': 'papua tengah',
  'highlands papua': 'papua pegunungan',
  'papua pegunungan': 'papua pegunungan',
  'north kalimantan': 'kalimantan utara',
  'kalimantan utara': 'kalimantan utara',
  'west kalimantan': 'kalimantan barat',
  'central kalimantan': 'kalimantan tengah',
  'south kalimantan': 'kalimantan selatan',
  'east kalimantan': 'kalimantan timur',
  'north sulawesi': 'sulawesi utara',
  'south sulawesi': 'sulawesi selatan',
  'central sulawesi': 'sulawesi tengah',
  'southeast sulawesi': 'sulawesi tenggara',
  'west sulawesi': 'sulawesi barat',
  'north maluku': 'maluku utara',
}

function normalizeNameForMatch(name) {
  if (!name || typeof name !== 'string') return ''
  return name
    .toLowerCase()
    .replace(/provinsi\s+/gi, '')
    .replace(/prov\.?\s*/gi, '')
    .trim()
}

export function normalizeProvinceName(name) {
  if (!name || typeof name !== 'string') return ''
  const normalized = normalizeNameForMatch(name)
  return PROVINCE_NAME_ALIASES[normalized] || normalized
}

export function getFeatureProvinceName(feature) {
  const p = feature?.properties || {}
  return (
    p.state ||
    p.name ||
    p.NAME_1 ||
    p.NAMA ||
    p.PROVINSI ||
    p.NAMA_PROP ||
    p.PROPINSI ||
    p.Provinsi ||
    p.provinsi ||
    ''
  )
}

export function getRegionKeyFromProvinceName(name) {
  if (!name || typeof name !== 'string') return null
  const normalized = normalizeProvinceName(name)
  return provinceToRegion[normalized] || null
}


export function isKasulampuaProvince(name) {
  return getRegionKeyFromProvinceName(name) !== null
}


export const KASULAMPUA_REGEX = {
  kalimantan:
    /\b(kalimantan\s*(barat|tengah|selatan|timur|utara)?|kaltara|kaltim|kalteng|kalsel|kalbar|north\s*kalimantan|east\s*kalimantan|south\s*kalimantan|west\s*kalimantan|central\s*kalimantan)\b/i,
  sulawesi:
    /\b(sulawesi\s*(utara|tengah|tenggara|selatan|barat)?|sulut|sulteng|sulbar|sulsel|sultra|gorontalo|north\s*sulawesi|south\s*sulawesi|central\s*sulawesi|southeast\s*sulawesi|west\s*sulawesi)\b/i,
  maluku: /\b(maluku\s*(utara)?|north\s*maluku)\b/i,
  papua:
    /\b(papua\s*(barat\s*daya|pegunungan|tengah|selatan|barat)?|irian\s*jaya\s*barat|west\s*papua|south\s*papua|central\s*papua|highlands?\s*papua)\b/i,
}

export function getRegionKeyWithRegex(name) {
  if (!name) return null
  const lower = String(name).toLowerCase().trim()
  if (
    lower.includes('sumatera') ||
    lower.includes('jawa') ||
    lower.includes('bali') ||
    lower.includes('nusa tenggara') ||
    lower.includes('palembang') ||
    lower.includes('jakarta') ||
    lower.includes('yogyakarta') ||
    lower.includes('aceh') ||
    lower.includes('bengkulu') ||
    lower.includes('riau') ||
    lower.includes('kepulauan riau') ||
    lower.includes('bangka') ||
    lower.includes('lampung') ||
    lower.includes('banten') ||
    lower.includes('jambi')
  ) {
    return null
  }
  for (const [key, regex] of Object.entries(KASULAMPUA_REGEX)) {
    if (regex.test(lower)) return key
  }
  return null
}

export const GEOJSON_URLS = [
  'https://raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi/main/Provinsi/38%20Provinsi%20Indonesia%20-%20Provinsi.json',
  'https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-edit.geojson',
]
