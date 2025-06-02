<template>
  <Navbar />
  <section class="py-5 container mt-5 mt-md-0">
    <PageHeader :title_detil="title_detail" />
  <ResourceDetail/>


  </section>

  <Kontak />
  <Footer />
</template>

<script setup>
import { ref,computed } from 'vue'

import PageHeader from '../components/BreadcSection.vue'
import Kontak from '../components/KontakSection.vue'
import Footer from '../components/FooterSection.vue'
import Navbar from '../components/NavSection.vue'
import ResourceDetail from '../components/ResourceDetail.vue'


const datasetTitle = ref('...')
//const organizationTitle = ref('...')

const title_detail = computed(() => ({
  title: datasetTitle.value,
  parent: [
    { label: 'Dataset', path: '/dataset' },
  ]
}))

</script>
