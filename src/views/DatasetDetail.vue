<template>
  <Navbar />
  <section class="py-5 container mt-5 mt-md-0">
    <PageHeader :title_detil="title_detail" />
    <DatasetDetail
      @setTitle="datasetTitle = $event"
      @setOrganizationName="organizationTitle = $event"
      @setOrganizationSlug="organizationSlug = $event"
    />
  </section>
  <Footer />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PageHeader from '../components/BreadcSection.vue'
import Footer from '../components/FooterSection.vue'
import Navbar from '../components/NavSection.vue'
import DatasetDetail from '../components/DatasetDetail.vue'
import { useRoute } from 'vue-router'
import { useMeta } from '../composables/useMeta'

const route = useRoute()
const { updateMeta } = useMeta()

const datasetTitle = ref('...')
const organizationTitle = ref('...')
const organizationSlug = ref('')

/** Kembali ke katalog: filter wilayah jika slug CKAN tersedia; jika tidak, gunakan `from` bila valid. */
const organizationListPath = computed(() => {
  if (organizationSlug.value) {
    return { path: '/dataset', query: { organization: organizationSlug.value } }
  }
  const from = route.query.from
  if (typeof from === 'string' && from.trim().length > 0) {
    return from
  }
  return '/dataset'
})

const title_detail = computed(() => ({
  title: datasetTitle.value,
  parent: [
    { label: 'Subjek', path: '/dataset' },
    { label: organizationTitle.value, path: organizationListPath.value }
  ]
}))

watch(datasetTitle, (newTitle) => {
  if (newTitle && newTitle !== '...') {
    updateMeta({
      title: newTitle,
      description: `Dataset: ${newTitle} dari organisasi ${organizationTitle.value}. Lihat detail data di portal Kasulampua.`
    })
  }
})
</script>
