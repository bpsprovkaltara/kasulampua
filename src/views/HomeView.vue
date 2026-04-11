<template>
  <div class="home-wrapper">
    <Navbar />
    <Header :header="header" :link="pusatInformasi" :regions="regional" />
    <main>
      <DataRepository />
      <!-- <NewsSection :berita="berita" /> -->
      <HomePublicationSection />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
// import {API_ENDPOINTS, DATAHUB_ENDPOINTS} from '../config/api'


import Navbar from '../components/NavSection.vue'
import Header from '../components/HeadSection.vue'
import DataRepository from '../components/DataRepository.vue'
import HomePublicationSection from '../components/HomePublicationSection.vue'
import Footer from '../components/FooterSection.vue'
import { DUMMY_BERITA } from '../utils/dummyBerita'


const pusatInformasi = ref({ href: '/dataset' })

const regional = {
  kalimantan: { icon: '/assets/images/icon_kalimantan.svg' },
  sulawesi: { icon: '/assets/images/icon_sulawesi.svg' },
  maluku: { icon: '/assets/images/icon_maluku.svg' },
  papua: { icon: '/assets/images/icon_papua.svg' },
}

// const chunkedImages = computed(() => {
//   const chunks = []
//   for (let i = 0; i < images.value.length; i += itemsPerSlide.value) {
//     chunks.push(images.value.slice(i, i + itemsPerSlide.value))
//   }
//   return chunks
// })



// function urlImage(image){
//   if(image){
//     return API_ENDPOINTS.BERITA_IMAGE+'/'+image
//   }else{
//     return false
//   }
// }


const berita = reactive({
  headline_image: '',
  judul_headline: '',
  ringkasan_headline: '',
  href: '#',
  text: 'Baca selengkapnya',
  link_lainnya: '/berita',
  text_lainnya: 'Berita lainnya',
})

const fetchHeadlineBerita = async () => {
  try {
    /* 
    const res = await fetch(API_ENDPOINTS.BERITA+'?type=headline_utama')
    const data = await res.json()

    if (res.ok && data && data.length > 0) {
      const item = data[0]
      berita.headline_image = item.image
        ? `${item.image}` // New API seems to provide full URL or specific path
        : '/assets/images/headline_image.png'
      berita.judul_headline = item.title
      berita.ringkasan_headline = item.content?.substring(0, 500) + '...'
      berita.href = `/berita/${item.slug}`
    }
    */

    // DUMMY DATA
    const headline = DUMMY_BERITA[0]
    berita.headline_image = headline.image
    berita.judul_headline = headline.title
    berita.ringkasan_headline = headline.content.replace(/<[^>]*>/g, '').substring(0, 300) + '...'
    berita.href = `/berita/${headline.slug}`
  } catch (err) {
    console.error('Gagal memuat headline:', err)
  }
}

onMounted(() => {
  fetchHeadlineBerita()
})

onBeforeUnmount(() => {
})
</script>
