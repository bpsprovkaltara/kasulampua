<template>
  <div class="map-viz-container">
    <div class="map-controls">
      <div class="map-legend-pills">
        <div class="legend-item" v-for="(color, i) in colorScale" :key="i">
          <div class="legend-box" :style="{ background: color }"></div>
          <span class="legend-text" v-if="i === 0">Min</span>
          <span class="legend-text" v-else-if="i === colorScale.length - 1">Max</span>
        </div>
      </div>
    </div>

    <div class="map-render-area">
      <div ref="mapRef" class="viz-leaflet-map"></div>
      
      <div v-if="loading" class="viz-map-loading">
        <div class="viz-spinner"></div>
        <span>Memuat Peta...</span>
      </div>

      <div 
        class="viz-map-tooltip"
        :class="{ visible: tooltip.visible }"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-prov">{{ tooltip.name }}</div>
        <div class="tooltip-val-row">
          <span class="tooltip-label">{{ title }}</span>
          <span class="tooltip-val">{{ formatValue(tooltip.value) }} <small>{{ unit }}</small></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  KASULAMPUA_REGIONS,
  getFeatureProvinceName as getFeatureName,
  normalizeProvinceName,
  getRegionKeyWithRegex,
  GEOJSON_URLS,
} from '../utils/kasulampuaProvinces'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  dataValues: { type: Array, default: () => [] },
  unit: { type: String, default: '' },
  title: { type: String, default: '' },
  region: { type: String, default: 'kasulampua' }
})

const regionInfo = KASULAMPUA_REGIONS

const getFeatureProvinceName = getFeatureName

const mapRef = ref(null)
const loading = ref(true)
const tooltip = ref({ visible: false, x: 0, y: 0, name: '', value: 0 })

let map = null
let geojsonLayer = null

const colorScale = [
  '#ebf8ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985'
]

const formatValue = (val) => {
  if (val === undefined || val === null) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}

const getColor = (value) => {
  if (value === 0 || value === undefined) return '#f1f5f9'
  const max = Math.max(...props.dataValues, 1)
  const min = Math.min(...props.dataValues.filter(v => v > 0), 0)
  const ratio = (value - min) / (max - min || 1)
  const index = Math.min(Math.floor(ratio * colorScale.length), colorScale.length - 1)
  return colorScale[index]
}

const initMap = async () => {
  if (map) return
  map = L.map(mapRef.value, {
    center: [-2.5, 118],
    zoom: 4,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
  })
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)
  await loadGeoJSON()
}

const loadGeoJSON = async () => {
  let data = null
  for (const url of GEOJSON_URLS) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      data = await res.json()
      if (data?.features?.length) break
    } catch {
      continue
    }
  }
  if (!data?.features?.length) {
    loading.value = false
    return
  }
  try {
    geojsonLayer = L.geoJSON(data, {
      filter: (feature) => {
        const provName = getFeatureProvinceName(feature)
        const regionKey = getRegionKeyWithRegex(provName)
        if (props.region === 'kasulampua') return !!regionKey
        return regionKey === props.region
      },
      style: (feature) => {
        const provName = getFeatureProvinceName(feature)
        const normalized = normalizeProvinceName(provName)
        const value = getValueForProv(normalized)
        return {
          fillColor: getColor(value),
          fillOpacity: 0.85,
          color: 'white',
          weight: 1.5,
        }
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const l = e.target
            l.setStyle({ fillOpacity: 1, weight: 2, color: '#d97706' })
            l.bringToFront()
            const provName = getFeatureProvinceName(feature)
            const normalized = normalizeProvinceName(provName)
            const value = getValueForProv(normalized)
            tooltip.value = { visible: true, x: e.containerPoint.x + 15, y: e.containerPoint.y - 15, name: provName, value: value }
          },
          mousemove: (e) => {
            tooltip.value.x = e.containerPoint.x + 15
            tooltip.value.y = e.containerPoint.y - 15
          },
          mouseout: (e) => {
            geojsonLayer.resetStyle(e.target)
            tooltip.value.visible = false
          }
        })
      }
    }).addTo(map)
    
    fitToRegion()
  } finally {
    loading.value = false
  }
}

const fitToRegion = () => {
  if (!map) return
  const info = regionInfo.find(r => r.key === props.region)
  if (info?.bounds) {
    map.fitBounds(info.bounds, { padding: [20, 20], animate: true, duration: 1 })
  }
}

const getValueForProv = (normalizedName) => {
  const idx = props.labels.findIndex(l => {
    const nl = normalizeProvinceName(l)
    return nl.includes(normalizedName) || normalizedName.includes(nl)
  })
  return idx !== -1 ? props.dataValues[idx] : 0
}

watch(() => props.dataValues, () => {
  if (geojsonLayer) {
    geojsonLayer.eachLayer(layer => {
      const provName = getFeatureProvinceName(layer.feature)
      const normalized = normalizeProvinceName(provName)
      const value = getValueForProv(normalized)
      layer.setStyle({ fillColor: getColor(value) })
    })
  }
}, { deep: true })

watch(() => props.region, async () => {
  if (geojsonLayer) {
    map.removeLayer(geojsonLayer)
    await loadGeoJSON()
  }
})

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-viz-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-controls {
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

.map-legend-pills {
  display: flex;
  gap: 2px;
  align-items: center;
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.legend-box {
  width: 30px;
  height: 12px;
}

.legend-text {
  font-size: 0.6rem;
  font-weight: 700;
  color: #64748b;
  margin-top: 4px;
}

.map-render-area {
  flex-grow: 1;
  position: relative;
}

.viz-leaflet-map {
  width: 100%;
  height: 100%;
  background: #f8fafc;
}

.viz-map-loading {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.viz-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.viz-map-tooltip {
  position: absolute;
  background: rgba(15, 23, 42, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  pointer-events: none;
  z-index: 2000;
  min-width: 160px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255,255,255,0.1);
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s, transform 0.2s;
}

.viz-map-tooltip.visible {
  opacity: 1;
  transform: scale(1);
}

.tooltip-prov {
  font-weight: 800;
  font-size: 0.9rem;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 4px;
}

.tooltip-val-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tooltip-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.tooltip-val {
  font-size: 1.1rem;
  font-weight: 700;
  color: #38bdf8;
}

.tooltip-val small {
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 2px;
}
</style>
