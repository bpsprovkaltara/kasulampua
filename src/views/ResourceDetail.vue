<template>
  <Navbar />
  <section class="py-5 container mt-5 mt-md-0">
    <PageHeader :title_detil="title_detail" />
  <ResourceDetail @emit-judul="handleUpdateData"/>


  </section>

  <Footer />
</template>

<script setup>
import { ref,computed } from 'vue'

import PageHeader from '../components/BreadcSection.vue'
import Footer from '../components/FooterSection.vue'
import Navbar from '../components/NavSection.vue'
import ResourceDetail from '../components/ResourceDetail.vue'


const datasetTitle = ref('...')
//const organizationTitle = ref('...')


function handleUpdateData(data) {
  datasetTitle.value = data
}

const title_detail = computed(() => ({
  title: datasetTitle.value,
  parent: [
  ]
}))

</script>
