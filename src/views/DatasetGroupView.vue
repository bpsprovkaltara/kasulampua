<template>
  <div class="container-fluid">
    <div class="row mt-4">
      <div class="col-md-2 border-end">
        <DatasetSidebar @groupSelected="redirectToGroup"  />

      </div>

      <div class="col-md-10">
        <h5 class="mb-3">Topik: {{ groupTitle || groupId }}</h5>

        <DatasetFilter v-model:search="search" @search="applySearch" class="mb-4" />
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <DatasetCard :datasets="filteredDatasets" />
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @pageChanged="goToPage"  class="mt-2"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DatasetSidebar from '@/components/DatasetSidebar.vue'
import DatasetFilter from '@/components/DatasetFilter.vue'
import DatasetCard from '@/components/DatasetCard.vue'
import Pagination from '@/components/DatasetPagination.vue'
import { DATAHUB_ENDPOINTS } from '@/config/api'


const route = useRoute()
const router = useRouter()

const groupId = ref(route.query.group_id || '')
const groupTitle = ref('')
const groupName = ref('')
const datasets = ref([])
const filteredDatasets = ref([])
const search = ref('')
const offset = ref(0)
const limit = 10
const total = ref(0)
const loading = ref(true)


const currentPage = computed(() => Math.floor(offset.value / limit) + 1)
const totalPages = computed(() => Math.ceil(total.value / limit))

const fetchGroupDatasets = async () => {
  loading.value = true

  if (!groupId.value) return

  try {
    const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_GROUP_PACKAGE}/${groupId.value}?page=${currentPage.value}&rows=${limit}`)
    const data = await res.json()

    groupTitle.value = data.group.display_name || ''
    groupName.value = data.group.name || ''


    total.value = data.total

    filteredDatasets.value = data.datasets
  loading.value = false

  } catch (err) {
  loading.value = false

    console.error("Gagal ambil data grup:", err)
  }
}

const applySearch = () => {
  if (!search.value) {
    offset.value =0
    fetchGroupDatasets()
  } else {
    offset.value =0
    fetchDataFiltered()
  }
}

//GET /ckan/datasets-search?org=bps-kalsel&keyword=transportasi&rows=10&offset=0
const fetchDataFiltered = async () => {
  loading.value = true

  const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_DATASET_SEARCH}?group=${groupName.value}&rows=${limit}&offset=${offset.value}&keyword=${search.value}`)
  const data = await res.json()
  datasets.value = data.result.results
  filteredDatasets.value = data.result.results
  total.value = data.result.count
  loading.value = false

}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    offset.value = (page - 1) * limit
    fetchDataFiltered()

    router.replace({
      path: route.path,
      query: {
        ...route.query,
        page: page
      }
    })
  }
}

const redirectToGroup = (newGroupId) => {
  router.replace({ path: '/dataset', query: { group_id: newGroupId } })
  groupId.value = newGroupId
  offset.value = 0
  fetchGroupDatasets()
}

watch(() => route.query.group_id, (newVal) => {
  groupId.value = newVal
  offset.value = 0
  fetchGroupDatasets()
})

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

onMounted(async () => {
  await fetchGroupDatasets()
  setPage()
})
</script>
