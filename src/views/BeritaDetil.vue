<template>
  <Navbar background_class="bg-default" />


  <section class="container py-5 mt-5 mt-md-0">
    <PageHeader :title_detil="title_detail" />
    <div class="row">
      <div class="col-lg-8">
        <img :src="urlImage(news.gambar)" alt="Gambar berita" class="img-fluid rounded mb-4"
          style="max-height: 400px; object-fit: cover; width: 100%;" />

        <h3 class="fw-bold mb-3">{{ news.judul }}</h3>

        <div class="text-muted small mb-4">
          <span class="ms-2"><i class="bi bi-calendar-event text-orange me-1 "></i>{{ news.tanggal_dibuat }}</span>
        </div>

        <p class="text-justify">
          {{ news.isi }}
        </p>
      </div>

      <!-- SIDEBAR -->
      <div class="col-lg-4">
        <!-- Search Box -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <h6 class="fw-bold mb-3">Cari Berita</h6>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Searching..." v-model="search" />
              <button class="btn btn-success"><i class="bi bi-search"></i></button>
            </div>
          </div>
        </div>

        <!-- Berita Terkini -->
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold mb-3">Berita Terkini</h6>
            <div class="d-flex align-items-center flex-sm-nowrap flex-wrap gap-24 mb-4"
              v-for="(item, index) in beritaList" :key="index">
              <img :src="urlImage(item.gambar)" class="me-3 rounded" style="width: 80px; height: 100px; object-fit: cover" />
              <div class="text-start">
                <router-link :to="`/berita/${index}`"
                  class="text-dark fw-semibold text-decoration-none small d-block text-start">
                  {{ item.judul.length > 120 ? item.judul.slice(0, 120) + '…' : item.judul }}
                </router-link>
                <small class="text-muted">
                  <i class="bi bi-calendar-event text-orange me-1 "></i>{{ item.tanggal_dibuat }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ContactSection />
  <Footer/>
</template>



<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted,  watch } from 'vue'

import PageHeader from '../components/BreadcSection.vue'
import ContactSection from '../components/KontakSection.vue'
import Footer from '../components/FooterSection.vue'
import Navbar from '../components/NavSection.vue'
import {API_ENDPOINTS} from '../config/api'

const beritaList = ref([])
const route = useRoute()
const search = ref('')
const news = ref({
  judul: '',
  gambar: '',
  tanggal_dibuat: '',
  isi: ''
})

const title_detail = {
  title: 'Kemiskinan Regional Kalimantan dari Sisi Ketenaga Kerjaaan',
  parent: [
    { label: 'Berita', path: '/berita' },
  ]
}

const fetchBerita = async () => {
  const res = await fetch(API_ENDPOINTS.BERITA)
  const data = await res.json()
  beritaList.value = data || []
  setNews()

}

const setNews = () => {
  const id = parseInt(route.params.id)
  news.value = beritaList.value[id] || {
    title: 'Berita tidak ditemukan',
    urlToImage: '',
    publishedAt: '',
    description: '',
    content: ''
  }
}


function urlImage(image){
  if(image){
    return API_ENDPOINTS.BERITA_IMAGE+'/'+image
  }else{
    return false
  }
}

onMounted(fetchBerita)

watch(() => route.params.id, () => {
  setNews()
})
</script>

<style scoped>
.text-orange {
  color: #f26522;
}

.text-justify {
  text-align: justify;
}
</style>
