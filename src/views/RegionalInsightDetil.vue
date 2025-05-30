<template>
  <Navbar />

  <div class="header_insight mt-5 mt-md-0">
    <PageHeader :title_detil="title_detail" />

    <div class="py-5">
      <div class="container">
        <h3 class="fw-semibold text-center mb-3">
          {{ state.insight?.judul || 'Memuat...' }}
        </h3>

        <p class="mb-4 text-start">
          {{ state.insight?.deskripsi || 'Insight tidak tersedia.' }}
        </p>

        <div v-if="state.insight"
          class="d-flex flex-wrap justify-content-between align-items-center small mb-4 px-4 py-2 rounded shadow-sm"
          style="background-color: rgba(255, 255, 255, 0.7);">
          <div class="d-flex flex-wrap gap-3">
            <div>
              <i class="bi bi-calendar-event me-1"></i> {{ formatDate(state.insight.tanggal_dibuat) }}
            </div>
            <div>
              <i class="bi bi-person me-1"></i> {{ state.insight.nama_author }}
            </div>
            <div>
              <i class="bi bi-eye me-1"></i> {{ Number(state.insight?.views ?? 0) + 1 }}
            </div>
          </div>
          <div>
            <span>Last Modified: {{ formatDate(state.insight.tanggal_diperbarui) }}</span>
          </div>
        </div>

        <div class="tableau-wrapper overflow-auto">
          <div v-if="state.insight" class="bg-white rounded shadow-sm p-3 " style="aspect-ratio: 1 / 2.45; width: 100%; max-width: 1070px; margin: auto;">
          <iframe frameborder="0" allowtransparency="true" allowfullscreen="true" title="Data Visualization"
          marginheight="0" marginwidth="0" scrolling="no" style="width: 100%; height: 100%; border: none;"
            :src="state.insight.link" ></iframe>
        </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="state.insight">
      <InsightDetailBox :id="state.insight.id" :topic="state.insight.topik" :regional="state.insight.region"
        :wilayah="state.insight.wilayah" :relatedDatasets="state.dataset || []" />
    </div>
  </div>

  <Kontak />
  <Footer />
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import Kontak from '../components/KontakSection.vue'
import PageHeader from '../components/BreadcSection.vue'
import InsightDetailBox from '../components/InsightDetail.vue'
import { API_ENDPOINTS } from '@/config/api'
import { formatDate } from '@/utils/dates'

const route = useRoute()

const title_detail = {
  title: 'Kemiskinan Regional Kalimantan dari Sisi Ketenaga Kerjaaan',
  parent: [
    { label: 'Regional Insight', path: '/regional_insight' },
  ]
}

const state = reactive({
  insight: null,
  dataset: []
})

const fetchInsight = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.INSIGHT_SLUG(route.params.id))
    const data = await res.json()
    state.insight = data
  } catch (error) {
    console.error('Gagal memuat insight:', error)
  }
}

const fetchRelatedDatasets = async () => {
  try {
    const res = await fetch(`${API_ENDPOINTS.INSIGHT}/${route.params.id}/related-datasets`)
    const data = await res.json()
    state.dataset = data
  } catch (error) {
    console.error('Gagal memuat related datasets:', error)
  }
}

onMounted(() => {
  fetchInsight()
  fetchRelatedDatasets()
})
</script>
