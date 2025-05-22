<template>
  <Navbar />
  <section class="py-5 container">
    <PageHeader :title_detil="title_detail" />
  <DatasetDetail @setTitle="datasetTitle = $event" />


  </section>

  <Kontak />
  <Footer />
</template>

<script setup>
import { ref } from 'vue'

import PageHeader from '../components/BreadcSection.vue'
import Kontak from '../components/KontakSection.vue'
import Footer from '../components/Footer.vue'
import Navbar from '../components/NavSection.vue'
import DatasetDetail from '../components/DatasetDetail.vue'

const datasetTitle = ref('...')
const title_detail = {
  get title() {
    return datasetTitle.value
  },
  parent: [
    { label: 'Dataset', path: '/dataset' },
  ]
}

</script>
