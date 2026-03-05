<template>
  <div class="home-wrapper">
    <Navbar />
    <Header :header="header" :link="pusatInformasi" :regions="regional" />
    <main>
      <DataRepository />
      <NewsSection :berita="berita" />
      <DataStory :dataSection="data_section" :dataset="dataset" />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive,  onMounted, onBeforeUnmount } from 'vue'
// import {API_ENDPOINTS, DATAHUB_ENDPOINTS} from '../config/api'


import Navbar from '../components/NavSection.vue'
import Header from '../components/HeadSection.vue'
import DataRepository from '../components/DataRepository.vue'
import NewsSection from '../components/NewsSection.vue'
import DataStory from '../components/DataStory.vue'
import Footer from '../components/FooterSection.vue'
import { DUMMY_BERITA } from '../utils/dummyBerita'
import { DUMMY_INSIGHTS } from '../utils/dummyInsights'


const pusatInformasi = ref({ href: 'https://info.kasulampua.id/' })

const header = reactive({
  logo: '/assets/images/logo-kasulampua-PUTIH.png',
  title: 'Kasulampua',
  description:''
})

const regional = reactive({
  kalimantan: {icon: '/assets/images/icon_kalimantan.svg' },
  sulawesi: { icon: '/assets/images/icon_sulawesi.svg' },
  maluku: { icon: '/assets/images/icon_maluku.svg' },
  papua: { icon: '/assets/images/icon_papua.svg' },
})

const itemsPerSlide = ref(5)
const kategori = ref([])
const loading = ref(true)

const fetchGroups = async () => {
  try {
    /* 
    const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_ORGANIZATION_LIST}`)
    let data = await res.json()

    data = data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    kategori.value = data
    */

    // DUMMY DATA 
    kategori.value = [
      { name: 'BPS Provinsi Kalimantan Utara' },
      { name: 'BPS Provinsi Sulawesi Tengah' },
      { name: 'BPS Provinsi Maluku Utara' },
      { name: 'BPS Provinsi Papua Barat' }
    ]
    loading.value = false
  } catch (error) {
    console.error('Gagal mengambil data group:', error)
  }
}

const updateItemsPerSlide = () => {
  const width = window.innerWidth
  if (width >= 1200) {
    itemsPerSlide.value = 5
  } else if (width >= 768) {
    itemsPerSlide.value = 4
  } else if (width >= 576) {
    itemsPerSlide.value = 2
  } else {
    itemsPerSlide.value = 1
  }
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

const dataset = ref([])

const data_section = reactive({
  judul:'',
  gambar:'',
  topik:'',
  wilayah:'',
  region:'',
  deskripsi: '',
  link_lainnya: '',
  text_lainnya: '(Baca selengkapnya)',
})

const fetchTopInsight = async () => {
  try {
    /* 
    const res = await fetch(API_ENDPOINTS.INSIGHT_TOP)
    const top = await res.json()

    data_section.judul = top.title
    data_section.deskripsi = top.description
    data_section.wilayah = top.region_name || top.wilayah
    data_section.region = top.region
    data_section.topik = top.topic || top.topik
    data_section.gambar = top.image
        ? `${top.image}`
        : '/assets/images/headline_image.png'
    data_section.link_lainnya = `/regional_insight/${top.slug}`

    fetchRelatedDatasets(top.id)
    */

    // FORCING DUMMY 
    const top = DUMMY_INSIGHTS[0]
    data_section.judul = top.title
    data_section.deskripsi = top.description
    data_section.wilayah = top.region_name
    data_section.region = top.region
    data_section.topik = top.topic
    data_section.gambar = top.image
    data_section.link_lainnya = `/regional_insight/${top.slug}`
    
    dataset.value = [
      { title: 'Dataset PDRB Perkapita 2023', url: '#' },
      { title: 'Laju Pertumbuhan Ekonomi Triwulan IV', url: '#' },
      { title: 'Indeks Harga Konsumen Gabungan', url: '#' }
    ]
    
    dataset.value = [
      { title: 'Dataset PDRB Perkapita 2023', url: '#' },
      { title: 'Laju Pertumbuhan Ekonomi Triwulan IV', url: '#' },
      { title: 'Indeks Harga Konsumen Gabungan', url: '#' }
    ]
  } catch (err) {
    console.error('Gagal ambil top insight:', err)
  }
}




onMounted(() => {
  fetchHeadlineBerita()
  updateItemsPerSlide()
  fetchTopInsight()
  fetchGroups()
  window.addEventListener('resize', updateItemsPerSlide)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerSlide)
})
</script>
