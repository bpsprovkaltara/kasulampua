<script setup>
import {computed} from 'vue'
import { useRoute } from 'vue-router'
import DatasetView from './DatasetView.vue'
import DatasetGroupView from './DatasetGroupView.vue'
import DatasetOrganizationView from './DatasetOrganizationView.vue'
import Footer from '../components/FooterSection.vue'
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
  <div class="dataset-route-wrapper">
    <component :is="componentToShow" />
  </div>
</template>
