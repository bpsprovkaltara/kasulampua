<template>
  <div class="container-fluid">
    <div class="row mt-4">
      <div class="col-md-2 border-end">
        <DatasetSidebar @groupSelected="redirectToGroup" @organizationSelected="handleOrg" />

      </div>

      <div class="col-md-10">
        <h5 class="mb-3">Topik: {{ groupTitle || groupId }}</h5>

        <DatasetFilter v-model:search="search" @search="applySearch" class="mb-4" />
        <DatasetCard :datasets="filteredDatasets" />
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @pageChanged="goToPage" />
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


const route = useRoute()
const router = useRouter()

const groupId = ref(route.query.group_id || '')
const groupTitle = ref('')
const datasets = ref([])
const filteredDatasets = ref([])
const search = ref('')
const offset = ref(0)
const limit = 10
const total = ref(0)

const currentPage = computed(() => Math.floor(offset.value / limit) + 1)
const totalPages = computed(() => Math.ceil(total.value / limit))

const fetchGroupDatasets = async () => {
  if (!groupId.value) return

  try {
    const res = await fetch(`http://localhost:3500/ckan/group/${groupId.value}?include=true`)
    const data = await res.json()
    const start = offset.value
    const end = offset.value + limit

    groupTitle.value = data.display_name || ''
    const fullList = data.packages || []

    total.value = fullList.length
    datasets.value = fullList.slice(start, end).map(ds => ({
      ...ds,
      views: Math.floor(Math.random() * 100)
    }))
    filteredDatasets.value = datasets.value
  } catch (err) {
    console.error("Gagal ambil data grup:", err)
  }
}

const applySearch = () => {
  if (!search.value) {
    filteredDatasets.value = datasets.value
  } else {
    filteredDatasets.value = datasets.value.filter(ds =>
      ds.title.toLowerCase().includes(search.value.toLowerCase())
    )
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    offset.value = (page - 1) * limit
    fetchGroupDatasets()
  }
}

const redirectToGroup = (newGroupId) => {
  router.replace({ path: '/dataset', query: { group_id: newGroupId } })
}

watch(() => route.query.group_id, (newVal) => {
  groupId.value = newVal
  offset.value = 0
  fetchGroupDatasets()
})

onMounted(() => {
  fetchGroupDatasets()
})
</script>
