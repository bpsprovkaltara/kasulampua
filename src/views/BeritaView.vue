<!-- src/views/BeritaView.vue -->
<template>
  <Navbar />
  <section class="py-5 container mt-5 mt-md-0">
    <Breadcump :title_detil="title_detail" />
    <div class="row g-4" v-if="beritaList.length">
      <div class="col-md-6 col-lg-4" v-for="(item, index) in beritaList" :key="index">
        <div class="card h-100 shadow-sm border-0">
          <img :src="urlImage(item.gambar) || '/assets/images/default-news.jpg'" class="card-img-top rounded"
            :alt="item.judul" />
          <div class="card-body">
            <h6 class="card-title fw-bold">

              <router-link :to="`/berita/${item.slug}`"
                class="text-dark fw-semibold text-decoration-none small d-block text-start"
                style="color:green;text-decoration:none;">
                {{ item.judul }}
              </router-link>

            </h6>
            <p class="card-text small text-muted mb-2">
              {{ item.isi?.length > 120 ? item.isi.slice(0, 120) + '...' : item.isi }}
            </p>
          </div>
          <div
            class="card-footer bg-white border-0 d-flex flex-wrap justify-content-between small text-muted px-3 pb-3">
            <span><i class="bi bi-calendar-event"></i> {{ item.tanggal_diperbarui }}</span>
            <span><i class="bi bi-person-circle"></i> {{ item.penulis?.length > 20 ? item.penulis.slice(0, 20) + '...' :
              item.penulis }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Kontak />
  <Footer />
</template>

<script setup>

import Navbar from '../components/NavSection.vue'
import Kontak from '../components/KontakSection.vue'
import Footer from '../components/FooterSection.vue'
import Breadcump from '../components/BreadcSection.vue'
import {API_ENDPOINTS} from '../config/api'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const beritaList = ref([])

const route = useRoute()


const fetchBerita = async (filter) => {
  const query = new URLSearchParams(filter).toString()
  const res = await fetch(`${API_ENDPOINTS.BERITA}?${query}`)
  const data = await res.json()
  beritaList.value = data || []
}

function urlImage(image){
  if(image){
    return API_ENDPOINTS.BERITA_IMAGE+'/'+image
  }else{
    return false
  }
}

const title_detail = {
  title: 'Berita',
  parent: [
  ]
}


onMounted(()=>{
  const initialFilter = {}

  if (route.query.q) {
    initialFilter.keyword = route.query.q

  }
  fetchBerita(initialFilter)
})
</script>

<style scoped>
.card-title {
  font-size: 0.95rem;
}

.card-footer i {
  margin-right: 4px;
}

@media (min-width: 992px) {
  .card-img-top {
    height: 180px;
  }
}
</style>
