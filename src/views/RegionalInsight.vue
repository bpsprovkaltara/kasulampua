<template>
  <Navbar />
  <div class="header_insight">
    <div class="container mt-5 mt-md-0">
      <div class="text-center">
        <h1 class="fw-bold">REGIONAL <em>INSIGHT</em></h1>
        <p class="text-muted">
          Menjelajahi dinamika sosial ekonomi Kalimantan, Sulawesi, Maluku, dan Papua...
        </p>
      </div>

      <RegionalFilter @filter-changed="applyFilter" />

      <div class="row">
        <RegionalCard v-for="(item, i) in insights" :id="item.id" :key="i" :image="item.gambar" :region="item.region"
          :badgeColor="item.badge" :title="item.judul" :date="item.tanggal_dibuat" :author="item.nama_author"
          :location="item.wilayah" :slug="item.slug" />
      </div>
    </div>
  </div>

  <Kontak />
  <Footer />
</template>
<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import RegionalFilter from '../components/RegionalFilter.vue'
import RegionalCard from '../components/RegionalCard.vue'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import Kontak from '../components/KontakSection.vue'
import {API_ENDPOINTS} from '../config/api'


const insights = ref([])
const route = useRoute()

const fetchInsight = async (filter = {}) => {
  const query = new URLSearchParams(filter).toString()
  const res = await fetch(`${API_ENDPOINTS.INSIGHT}?${query}`)
  const data = await res.json()
  insights.value = data || []
}

const applyFilter = (filter) => {
  console.log('Filter diterapkan:', filter)
  fetchInsight(filter)
}

onMounted(() => {
  const initialFilter = {}

  if (route.query.region) {
    initialFilter.region = route.query.region

  }
  fetchInsight(initialFilter)
})

</script>
