<template>
  <Navbar />
  <div class="header_insight">
    <div class="container">
      <div class="text-center">
        <h1 class="fw-bold">REGIONAL <em>INSIGHT</em></h1>
        <p class="text-muted">
          Menjelajahi dinamika sosial ekonomi Kalimantan, Sulawesi, Maluku, dan Papua...
        </p>
      </div>

      <RegionalFilter />

      <div class="row">
        <RegionalCard v-for="(item, i) in insights" :id="item.id" :key="i" :image="item.image" :region="item.region"
          :badgeColor="item.badgeColor" :title="item.title" :date="item.date" :author="item.author"
          :location="item.location" />
      </div>
    </div>
  </div>

  <Kontak />
  <Footer />
</template>
<script setup>
import { ref } from 'vue'
import RegionalFilter from '../components/RegionalFilter.vue'
import RegionalCard from '../components/RegionalCard.vue'
import Navbar from '../components/Nav.vue'
import Footer from '../components/Footer.vue'
import Kontak from '../components/KontakSection.vue'


const insights = ref([
  {
    id:1,
    image: 'https://placehold.co/400x200?text=Kalimantan',
    region: 'Kalimantan',
    badgeColor: 'success',
    title: 'Kemiskinan Regional Kalimantan dari Sisi Ketenagakerjaan',
    date: '10 Juni 2025',
    author: 'John Doe',
    location: 'Kalimantan Timur'
  },
  {
    id:2,
    image: 'https://placehold.co/400x200?text=Sulawesi',
    region: 'Sulawesi',
    badgeColor: 'danger',
    title: 'Hilirisasi Industri Pendorong Perekonomian Sulawesi',
    date: '04 Juni 2025',
    author: 'John Doe',
    location: 'Sulawesi Tengah'
  },
  {
    id:3,
    image: 'https://placehold.co/400x200?text=Maluku',
    region: 'Maluku',
    badgeColor: 'info',
    title: 'Pariwisata Sebagai Alternatif Perekonomian Maluku',
    date: '09 Juni 2025',
    author: 'John Doe',
    location: 'Maluku Utara'
  },
  {
    id:4,
    image: 'https://placehold.co/400x200?text=Papua',
    region: 'Papua',
    badgeColor: 'warning',
    title: 'Food Estate dan tantangan logistik di Papua',
    date: '08 Juni 2025',
    author: 'John Doe',
    location: 'Papua'
  },
  {
    id:5,
    image: 'https://placehold.co/400x200?text=Kalimantan',
    region: 'Kalimantan',
    badgeColor: 'success',
    title: 'Kemiskinan Regional Kalimantan dari Sisi Ketenagakerjaan',
    date: '10 Juni 2025',
    author: 'John Doe',
    location: 'Kalimantan Timur'
  },
  {
    id:6,
    image: 'https://placehold.co/400x200?text=Sulawesi',
    region: 'Sulawesi',
    badgeColor: 'danger',
    title: 'Hilirisasi Industri Pendorong Perekonomian Sulawesi',
    date: '04 Juni 2025',
    author: 'John Doe',
    location: 'Sulawesi Tengah'
  },
  {
    id:7,
    image: 'https://placehold.co/400x200?text=Maluku',
    region: 'Maluku',
    badgeColor: 'info',
    title: 'Pariwisata Sebagai Alternatif Perekonomian Maluku',
    date: '09 Juni 2025',
    author: 'John Doe',
    location: 'Maluku Utara'
  },
  {
    id:8,
    image: 'https://placehold.co/400x200?text=Papua',
    region: 'Papua',
    badgeColor: 'warning',
    title: 'Food Estate dan tantangan logistik di Papua',
    date: '08 Juni 2025',
    author: 'John Doe',
    location: 'Papua'
  }
])
</script>
