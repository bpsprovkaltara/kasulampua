<template>
  <Navbar />
  <Header :header="header" :link="pusatInformasi" :regions="regional" />
  <DataRepository :kategori="kategori" :itemsPerSlide="itemsPerSlide" />
  <IndikatorStrategis />
  <NewsSection :berita="berita" />
  <DataStory :dataSection="data_section" :dataset="dataset" />
  <Kontak />
  <Footer />
</template>

<script setup>
import { ref, reactive,  onMounted, onBeforeUnmount } from 'vue'
import {API_ENDPOINTS} from '../config/api'


import Navbar from '../components/NavSection.vue'
import Header from '../components/HeadSection.vue'
import DataRepository from '../components/DataRepository.vue'
import NewsSection from '../components/NewsSection.vue'
import DataStory from '../components/DataStory.vue'
import Footer from '../components/Footer.vue'
import Kontak from '../components/KontakSection.vue'
import IndikatorStrategis from '@/components/IndikatorStrategis.vue'


const pusatInformasi = ref({ href: 'https://info-kasulampua.vercel.app/' })

const header = reactive({
  logo: 'assets/images/logo_instansi.png',
  title: 'Kasulampua',
  description:
    'Konsultasi Regional Kalimantan, Sulawesi, Maluku, dan Papua (Kasulampua) merupakan forum bertukar pengetahuan tentang permasalahan dan pembangunan ekonomi di wilayah Kasulampua yang diinisiasi oleh Badan Pusat Statistik, Bappeda, dan Bank Indonesia.',
})

const regional = reactive({
  kalimantan: {icon: '/assets/images/icon_kalimantan.svg' },
  sulawesi: { icon: '/assets/images/icon_sulawesi.svg' },
  maluku: { icon: '/assets/images/icon_maluku.svg' },
  papua: { icon: '/assets/images/icon_papua.svg' },
})

const itemsPerSlide = ref(5)
const kategori = ref([])

const fetchGroups = async () => {
  try {
    const res = await fetch('http://localhost:3500/ckan/group_list')
    const data = await res.json()

     kategori.value = data
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
    const res = await fetch(API_ENDPOINTS.BERITA+'?type=headline_utama')
    const data = await res.json()

    if (res.ok && data && data.length > 0) {
      const item = data[0]
      berita.headline_image = item.gambar
        ? `${API_ENDPOINTS.BERITA_IMAGE}/${item.gambar}`
        : '/assets/images/headline_image.png'
      berita.judul_headline = item.judul
      berita.ringkasan_headline = item.isi?.substring(0, 500) + '...'
      berita.href = `/berita/detail/${item.slug}`
    }
  } catch (err) {
    console.error('Gagal memuat headline:', err)
  }
}

const dataset = ref([])

const data_section = reactive({
  judul:'',
  deskripsi: '',
  link_lainnya: '',
  text_lainnya: '(Baca selengkapnya)',
})

const fetchTopInsight = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.INSIGHT_TOP)
    const top = await res.json()

    data_section.judul = top.judul
    data_section.deskripsi = top.deskripsi
    data_section.link_lainnya = `/regional_insight/${top.id}`

    fetchRelatedDatasets(top.id)
  } catch (err) {
    console.error('Gagal ambil top insight:', err)
  }
}

const fetchRelatedDatasets = async (id) => {
  try {
    const res = await fetch(`${API_ENDPOINTS.INSIGHT}/${id}/related-datasets`)
    const data = await res.json()
    dataset.value = data
  } catch (error) {
    console.error('Gagal memuat related datasets:', error)
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
