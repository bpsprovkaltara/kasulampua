<template>
  <Navbar />
  <Header :header="header" :link="pusatInformasi" :regions="regional" />
  <DataRepository :images="images" :itemsPerSlide="itemsPerSlide" />
  <NewsSection :berita="berita" />
  <DataStory :dataSection="data_section" :dataset="dataset" />
  <Kontak />
  <Footer />
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

import Navbar from '../components/Nav.vue'
import Header from '../components/Head.vue'
import DataRepository from '../components/DataRepository.vue'
import NewsSection from '../components/NewsSection.vue'
import DataStory from '../components/DataStory.vue'
import Footer from '../components/Footer.vue'
import Kontak from '../components/KontakSection.vue'


const pusatInformasi = ref({ href: '#' })

const header = reactive({
  logo: 'assets/images/logo_instansi.png',
  title: 'Kasulampua',
  description:
    'Konsultasi Regional Kalimantan, Sulawesi, Maluku, dan Papua (Kasulampua) merupakan forum bertukar pengetahuan tentang permasalahan dan pembangunan ekonomi di wilayah Kasulampua yang diinisiasi oleh Badan Pusat Statistik, Bappeda, dan Bank Indonesia.',
})

const regional = reactive({
  kalimantan: { insight: 'https://google.com', icon: '/assets/images/icon_kalimantan.svg' },
  sulawesi: { insight: 'https://google.com', icon: '/assets/images/icon_sulawesi.svg' },
  maluku: { insight: 'https://google.com', icon: '/assets/images/icon_maluku.svg' },
  papua: { insight: 'https://google.com', icon: '/assets/images/icon_papua.svg' },
})

const itemsPerSlide = ref(5)
const images = ref([
  {
    id: 1,
    src: '/assets/images/data_repo_160.png',
    title: 'Pertambangan, Manufaktur, Konstruksi',
  },
  { id: 2, src: '/assets/images/data_repo_160.png', title: 'Makroekonomi' },
  { id: 3, src: '/assets/images/data_repo_160.png', title: 'Neraca Ekonomi' },
  { id: 4, src: '/assets/images/data_repo_160.png', title: 'Bisnis' },
  { id: 5, src: '/assets/images/data_repo_160.png', title: 'Harga-Harga' },
  {
    id: 6,
    src: '/assets/images/data_repo_160.png',
    title: 'Pertanian, Kehutanan, Perikanan',
  },
  { id: 7, src: '/assets/images/data_repo_160.png', title: 'Inflasi' },
  { id: 8, src: '/assets/images/data_repo_160.png', title: 'Kependudukan' },
  { id: 9, src: '/assets/images/data_repo_160.png', title: 'Pariwisata' },
  { id: 10, src: '/assets/images/data_repo_160.png', title: 'Ekspor-Impor' },
])

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

const chunkedImages = computed(() => {
  const chunks = []
  for (let i = 0; i < images.value.length; i += itemsPerSlide.value) {
    chunks.push(images.value.slice(i, i + itemsPerSlide.value))
  }
  return chunks
})

const berita = reactive({
  headline_image: '/assets/images/headline_image.png',
  judul_headline: 'Kepala BPS Provinsi Kalimantan Selatan',
  ringkasan_headline:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...',
  href: '#',
  text: 'Baca selengkapnya',
  link_lainnya: '/berita',
  text_lainnya: '(Lihat lainnya)',
})

const data_section = reactive({
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum... ',
  link_lainnya: '#',
  text_lainnya: '(Baca selengkapnya)',
})

const dataset = ref([
  { text: 'Dataset A', href: '#' },
  { text: 'Dataset B', href: '#' },
])

onMounted(() => {
  updateItemsPerSlide()
  window.addEventListener('resize', updateItemsPerSlide)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerSlide)
})
</script>
