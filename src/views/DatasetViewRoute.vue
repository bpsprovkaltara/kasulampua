<script setup>
import {computed} from 'vue'
import { useRoute } from 'vue-router'
import DatasetView from './DatasetView.vue'
import DatasetGroupView from './DatasetGroupView.vue'
import DatasetOrganizationView from './DatasetOrganizationView.vue'
import Footer from '../components/FooterSection.vue'
import Kontak from '../components/KontakSection.vue'
import Navbar from '../components/NavSection.vue'
import Breadcump from '../components/BreadcSection.vue'

const route = useRoute()

const componentToShow = computed(() => {
  if (route.query.group_id) return DatasetGroupView
  if (route.query.organization_id) return DatasetOrganizationView
  return DatasetView
})

const title_detail = {
  title: 'Dataset',
  parent: [
  ]
}
</script>

<template>
  <Navbar />
  <div class="container py-5 mt-5 mt-md-0">
  <Breadcump :title_detil="title_detail" />
  <div class="row">
    <component :is="componentToShow" class="border rounded " />
    </div>
  </div>
  <Kontak />
  <Footer />
</template>
