<template>
  <Navbar />


  <section class="container py-5">
    <PageHeader title="Berita" :title_detil="['berita', news.title]" />
    <div class="row">
      <div class="col-lg-8">
        <img :src="news.urlToImage" alt="Gambar berita" class="img-fluid rounded mb-4"
          style="max-height: 400px; object-fit: cover; width: 100%;" />

        <h3 class="fw-bold mb-3">{{ news.title }}</h3>

        <div class="text-muted small mb-4">
          <strong>{{ news.location }}</strong>
          <span class="ms-2"><i class="bi bi-calendar-event text-orange me-1 "></i>{{ news.publishedAt }}</span>
        </div>

        <p class="text-justify">
          {{ news.content }}
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
              <img :src="item.urlToImage" class="me-3 rounded" style="width: 80px; height: 100px; object-fit: cover" />
              <div class="text-start">
                <router-link :to="`/berita/${index}`"
                  class="text-dark fw-semibold text-decoration-none small d-block text-start">
                  {{ item.title.length > 120 ? item.title.slice(0, 120) + '…' : item.title }}
                </router-link>
                <small class="text-muted">
                  <i class="bi bi-calendar-event text-orange me-1 "></i>{{ item.publishedAt }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ContactSection />
</template>



<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'

import PageHeader from '../components/Breadc.vue'
import ContactSection from '../components/KontakSection.vue'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Nav.vue'

const beritaList = ref([])
const route = useRoute()
const search = ref('')
const news = ref({
  title: '',
  urlToImage: '',
  publishedAt: '',
  content: ''
})

const fetchBerita = async () => {
  const res = await fetch('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=b66128bed1054877a21ee66ed26fd934')
  const data = await res.json()
  beritaList.value = data.articles || []
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

const formatDate = (raw) => {
  const date = new Date(raw)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
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
