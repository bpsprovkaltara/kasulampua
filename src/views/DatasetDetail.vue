<template>
  <Navbar />
  <section class="py-5 container">
    <PageHeader :title_detil="title_detail" />
  <DatasetDetail @setTitle="datasetTitle = $event" @setOrganizationName="organizationTitle = $event"/>


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
import DatasetDetail from '../components/DatasetDetail.vue'
import { useRoute } from 'vue-router'
const route = useRoute()


const datasetTitle = ref('...')
const organizationTitle = ref('...')

const title_detail = computed(() => ({
  title: datasetTitle.value,
  parent: [
    { label: 'Dataset', path: '/dataset' },
    { label: organizationTitle.value, path: route.query.from || '/dataset' }
  ]
}))

</script>
