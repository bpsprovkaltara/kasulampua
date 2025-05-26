<template>
  <div class="container-fluid">
    <div class="row mt-4">
      <div class="col-md-2 border-end">

        <DatasetSidebar @groupSelected="redirectToGroup" @organizationSelected="redirectToOrg" />

      </div>

      <div class="col-md-10">
        <DatasetFilter v-model:search="search" @search="applySearch" class="mb-4" />
        <DatasetCard :datasets="filteredDatasets" />
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @pageChanged="goToPage" class="mt-2"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter,useRoute} from 'vue-router'

import DatasetFilter from '@/components/DatasetFilter.vue'
import DatasetCard from '@/components/DatasetCard.vue'
import Pagination from '@/components/DatasetPagination.vue'
import DatasetSidebar from '@/components/DatasetSidebar.vue'
const router = useRouter()
const route = useRoute()
const datasets = ref([])
const filteredDatasets = ref([])
const search = ref('')
const offset = ref(0)
const limit = 10
const totalCount = ref(0)

const currentPage = computed(() => Math.floor(offset.value / limit) + 1)
const totalPages = computed(() => Math.ceil(totalCount.value / limit))

const fetchData = async () => {
  const res = await fetch(`http://localhost:3500/ckan/datasets?limit=${limit}&offset=${offset.value}`)
  const data = await res.json()
  datasets.value = data.result
  filteredDatasets.value = data.result

  totalCount.value = data.total || 1000
}

const applySearch = () => {
  if (!search.value) {
    offset.value =0
    fetchData()
    //filteredDatasets.value = datasets.value
  } else {
    offset.value =0
    fetchDataFiltered()
    // filteredDatasets.value = datasets.value.filter(ds =>
    //   ds.title.toLowerCase().includes(search.value.toLowerCase())
    // )
  }
}

const fetchDataFiltered = async () => {
  const res = await fetch(`http://localhost:3500/ckan/datasets-search?rows=${limit}&offset=${offset.value}&keyword=${search.value}`)
  const data = await res.json()
  datasets.value = data.result.results
  filteredDatasets.value = data.result.results
  totalCount.value = data.result.count
}

const goToPage = (page) => {
  offset.value = (page - 1) * limit
  if (!search.value) {
    fetchData()
  } else {
    fetchDataFiltered()
  }

  router.replace({
      path: route.path,
      query: {
        ...route.query,
        page: page
      }
    })
}

const setPage = () => {
  const page = parseInt(route.query.page)
  if (page > 1) {
    const waitUntilReady = setInterval(() => {
      if (totalPages.value > 0) {
        clearInterval(waitUntilReady)
        goToPage(page)
      }
    }, 100)
  }
}

const redirectToGroup = (groupId) => {
  router.replace({ path: '/dataset', query: { group_id: groupId } })
}

const redirectToOrg = (orgId) => {
  router.replace({ path: '/dataset', query: { organization_id: orgId } })
}

onMounted(async ()=>{
  await fetchData()
  setPage()
})
</script>
