<template>
  <div class="map-wrapper" ref="containerRef">

    <div class="map-header">
      <div class="map-eyebrow">
        <span class="eyebrow-dot"></span>
        PETA CAKUPAN WILAYAH
      </div>
      <h3 class="map-title">Empat Regional <span class="text-amber">Kasulampua</span></h3>
      <p class="map-subtitle">Kalimantan · Sulawesi · Maluku · Papua</p>
    </div>

    <div class="map-canvas-wrapper">
      <div ref="mapContainer" class="leaflet-map"></div>

      <div class="map-loading" v-if="loading">
        <div class="map-spinner"></div>
        <span>Memuat peta...</span>
      </div>

      <div class="map-legend">
        <div class="legend-title">Keterangan</div>
        <div class="legend-item" v-for="r in regionInfo" :key="r.key">
          <div class="legend-dot" :style="{ background: r.color }"></div>
          <span>{{ r.label }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot other"></div>
          <span>Wilayah Lain</span>
        </div>
      </div>

      <div
        class="map-tooltip"
        :class="{ visible: tooltip.visible }"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-region">{{ tooltip.region }}</div>
        <div class="tooltip-name">{{ tooltip.name }}</div>
        <div class="tooltip-provinces" v-if="tooltip.provinces">
          {{ tooltip.provinces }}
        </div>
      </div>
    </div>

    <div class="region-chips">
      <div
        class="region-chip"
        v-for="r in regionInfo"
        :key="r.key"
        @mouseenter="highlightByKey(r.key)"
        @mouseleave="clearHighlight()"
        @click="zoomToRegion(r.key)"
      >
        <div class="chip-dot" :style="{ background: r.color }"></div>
        <span class="chip-name">{{ r.label }}</span>
        <span class="chip-count">{{ r.count }} Provinsi</span>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  KASULAMPUA_REGIONS,
  getFeatureProvinceName,
  getRegionKeyWithRegex,
  GEOJSON_URLS,
} from '../utils/kasulampuaProvinces'

const regionInfo = KASULAMPUA_REGIONS.filter((r) => r.key !== 'kasulampua')

function getRegionInfo(key) {
  return regionInfo.find((r) => r.key === key)
}

const mapContainer = ref(null)
const containerRef = ref(null)
const loading = ref(true)
const tooltip = ref({ visible: false, x: 0, y: 0, region: '', name: '', provinces: '' })

let map = null
let geojsonLayer = null
let activeHighlight = null

onMounted(async () => {
  await initMap()
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})

async function initMap() {
  map = L.map(mapContainer.value, {
    center: [-2, 117],
    zoom: 5,
    minZoom: 4,
    maxZoom: 10,
    maxBounds: [[-12, 90], [7, 142]],
    maxBoundsViscosity: 1.0,
    worldCopyJump: false,
    zoomControl: false,
    attributionControl: false,
  })


  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    {
      subdomains: 'abcd',
      maxZoom: 19,
    }
  ).addTo(map)

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
    { subdomains: 'abcd', maxZoom: 19, pane: 'shadowPane' }
  ).addTo(map)

  L.control.attribution({ prefix: false, position: 'bottomright' })
    .addAttribution('© <a href="https://carto.com">CARTO</a> © <a href="https://openstreetmap.org">OSM</a>')
    .addTo(map)
  L.control.zoom({ position: 'topright' }).addTo(map)
  await loadGeoJSON()
}

async function loadGeoJSON() {
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
    try {
      const res = await fetch(
        'https://raw.githubusercontent.com/JfrAziz/indonesia-district/master/prov%2034%20simplified.geojson'
      )
      if (res.ok) data = await res.json()
    } catch {
      // ignore
    }
  }
  if (!data?.features?.length) {
    loading.value = false
    return
  }

  geojsonLayer = L.geoJSON(data, {
    style: (feature) => styleFeature(feature),
    onEachFeature: (feature, layer) => bindEvents(feature, layer),
  }).addTo(map)

  loading.value = false

  setTimeout(() => {
    if (!mapContainer.value || !map) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        map.invalidateSize()
        map.flyToBounds([[-11, 92], [6, 141]], {
          padding: [24, 24],
          duration: 1.8,
          maxZoom: 5
        })
        observer.disconnect()
      }
    }, { threshold: 0.15 })
    observer.observe(mapContainer.value)
  }, 100)
}

function styleFeature(feature, highlightKey = null) {
  const name = getFeatureProvinceName(feature)
  const regionKey = getRegionKeyWithRegex(name)
  const info = regionKey ? getRegionInfo(regionKey) : null

  const isKasulampua = !!regionKey
  const isHighlighted = highlightKey === null || regionKey === highlightKey

  if (!isKasulampua) {
    return {
      fillColor: 'transparent',
      fillOpacity: 0,
      color: 'rgba(255,255,255,0.08)',
      weight: 0.4,
      opacity: highlightKey === null ? 0.5 : 0.15,
    }
  }

  return {
    fillColor: info.color,
    fillOpacity: isHighlighted ? 0.78 : 0.15,
    color: isHighlighted ? '#fff' : info.color,
    weight: isHighlighted ? 1.5 : 0.8,
    opacity: isHighlighted ? 1 : 0.4,
  }
}

function bindEvents(feature, layer) {
  const name = getFeatureProvinceName(feature)
  const regionKey = getRegionKeyWithRegex(name)
  if (!regionKey) return

  const info = getRegionInfo(regionKey)

  layer.on('mouseover', (e) => {
    layer.setStyle({
      fillOpacity: 0.92,
      weight: 2,
      color: '#fff',
    })
    layer.bringToFront()

    const containerRect = mapContainer.value.getBoundingClientRect()
    const point = e.containerPoint
    tooltip.value = {
      visible: true,
      x: Math.min(point.x + 14, containerRect.width - 210),
      y: Math.max(point.y - 50, 8),
      region: info.label,
      name,          
      provinces: info.provinces,
    }
  })

  layer.on('mousemove', (e) => {
    const containerRect = mapContainer.value.getBoundingClientRect()
    const point = e.containerPoint
    tooltip.value.x = Math.min(point.x + 14, containerRect.width - 210)
    tooltip.value.y = Math.max(point.y - 50, 8)
  })

  layer.on('mouseout', () => {
    if (activeHighlight) {
      geojsonLayer.eachLayer(l => l.setStyle(styleFeature(l.feature, activeHighlight)))
    } else {
      geojsonLayer.resetStyle(layer)
    }
    tooltip.value.visible = false
  })
}

function highlightByKey(key) {
  if (!geojsonLayer) return
  activeHighlight = key
  geojsonLayer.eachLayer(layer => {
    layer.setStyle(styleFeature(layer.feature, key))
  })
}

function clearHighlight() {
  if (!geojsonLayer) return
  activeHighlight = null
  geojsonLayer.eachLayer(layer => {
    layer.setStyle(styleFeature(layer.feature, null))
  })
}

function zoomToRegion(key) {
  if (!map) return
  const info = getRegionInfo(key)
  if (info?.bounds) {
    map.fitBounds(info.bounds, { padding: [40, 40], duration: 0.5 })
  }
}
</script>


<style scoped>
.map-wrapper {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.map-header {
  text-align: center;
  margin-bottom: 2rem;
}
.map-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: #d97706;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.eyebrow-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #d97706;
  animation: pulse-d 2s ease-in-out infinite;
}
@keyframes pulse-d {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.6); opacity: 0.5; }
}
.map-title { font-size: 2rem; font-weight: 900; color: #1c1917; margin-bottom: 0.5rem; }
.text-amber { color: #d97706; }
.map-subtitle { font-size: 0.875rem; color: #78716c; letter-spacing: 0.1em; }

.map-canvas-wrapper {
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
  background: #0f1923;
}
.leaflet-map {
  width: 100%;
  height: 480px;
}

.map-loading {
  position: absolute;
  inset: 0;
  background: rgba(15, 25, 35, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255,255,255,0.5);
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 500;
  backdrop-filter: blur(4px);
}
.map-spinner {
  width: 44px; height: 44px;
  border: 3px solid rgba(217,119,6,0.2);
  border-top-color: #d97706;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.map-legend {
  position: absolute;
  bottom: 52px;
  left: 14px;
  background: rgba(10, 14, 20, 0.85);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 12px 16px;
  z-index: 400;
}
.legend-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  margin-bottom: 5px;
}
.legend-item:last-child { margin-bottom: 0; }
.legend-dot {
  width: 12px; height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}
.legend-dot.other {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
}

.map-tooltip {
  position: absolute;
  pointer-events: none;
  background: rgba(8, 6, 5, 0.94);
  border: 1px solid rgba(245,158,11,0.25);
  border-radius: 12px;
  padding: 12px 16px;
  backdrop-filter: blur(12px);
  opacity: 0;
  transform: translateY(6px) scale(0.95);
  transition: opacity 0.18s, transform 0.18s;
  min-width: 185px;
  max-width: 220px;
  z-index: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.map-tooltip.visible { opacity: 1; transform: translateY(0) scale(1); }
.tooltip-region {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #f59e0b;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.tooltip-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: white;
  margin-bottom: 5px;
}
.tooltip-provinces {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.4);
  line-height: 1.6;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 5px;
}

.region-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 1.5rem;
}
.region-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  background: white;
  border: 1.5px solid #e7e5e4;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}
.region-chip:hover {
  border-color: #d97706;
  background: #fffbeb;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(217,119,6,0.15);
}
.chip-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.chip-name { font-size: 0.875rem; font-weight: 700; color: #1c1917; }
.chip-count { font-size: 0.75rem; color: #78716c; font-weight: 500; }

:deep(.leaflet-control-zoom) {
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: none !important;
}
:deep(.leaflet-control-zoom a) {
  background: rgba(15, 25, 35, 0.85) !important;
  color: rgba(255,255,255,0.7) !important;
  border-bottom: 1px solid rgba(255,255,255,0.08) !important;
  backdrop-filter: blur(8px);
  font-weight: 700;
  line-height: 24px;
  width: 28px; height: 28px;
}
:deep(.leaflet-control-zoom a:hover) {
  background: rgba(40, 50, 65, 0.95) !important;
  color: white !important;
}
:deep(.leaflet-control-attribution) {
  background: rgba(0,0,0,0.55) !important;
  color: rgba(255,255,255,0.3) !important;
  font-size: 9px !important;
  border-radius: 4px 0 0 0 !important;
}
:deep(.leaflet-control-attribution a) { color: rgba(255,255,255,0.4) !important; }

@media (max-width: 768px) {
  .map-title { font-size: 1.5rem; }
  .leaflet-map { height: 320px; }
  .region-chips { gap: 8px; }
  .region-chip { padding: 7px 14px; }
  .map-legend { bottom: 38px; }
}
</style>
