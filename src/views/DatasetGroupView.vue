<template>
  <Navbar />
  <header class="hero-v2">
    <div class="hero-v2-glow" aria-hidden="true"></div>
    <div class="hero-v2-dots" aria-hidden="true"></div>
    
    <div class="container position-relative" style="z-index:10;">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="hero-v2-badge">
            <span class="badge-dot"></span>
            DATASET BY TOPIC
          </div>
          
          <h1 class="hero-v2-title">
            Katalog <br /> 
            <em>Dataset</em>
          </h1>
          
          <p class="hero-v2-subtitle">
            Menampilkan data untuk topik <strong>{{ groupTitle || groupId }}</strong>.
            Akses dataset strategis secara terbuka dan terintegrasi.
          </p>
        </div>
      </div>
    </div>
  </header>

  <div class="dataset-content py-5">
    <div class="container-xl">
      <div class="row g-4">
        <div class="col-lg-3 order-2 order-lg-1">
          <DatasetSidebar @groupSelected="redirectToGroup"  />
        </div>

        <div class="col-lg-9 order-1 order-lg-2">
          <DatasetFilter v-model:search="search" @search="applySearch" class="mb-4" />
          
          <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-amber" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted small mt-2">Memuat dataset...</p>
          </div>
          
          <div v-else>
            <DatasetCard :datasets="filteredDatasets" />
            <PaginationControl
              :current-page="currentPage"
              :total-pages="totalPages"
              @change="goToPage"
              class="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import DatasetSidebar from '@/components/DatasetSidebar.vue'
import DatasetFilter from '@/components/DatasetFilter.vue'
import DatasetCard from '@/components/DatasetCard.vue'
import PaginationControl from '../components/PaginationControl.vue'
import { DATAHUB_ENDPOINTS } from '@/config/api'


const route = useRoute()
const router = useRouter()

function pickQueryStr(val) {
  if (val == null || val === '') return ''
  if (Array.isArray(val)) return String(val[0] ?? '')
  return String(val)
}

function cleanQuery(q) {
  const out = {}
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === '') continue
    out[k] = v
  }
  return out
}

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

let searchDebounce = null

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

const syncFromRoute = () => {
  groupId.value = pickQueryStr(route.query.group_id)
  search.value = pickQueryStr(route.query.q)
  const page = parseInt(pickQueryStr(route.query.page) || '1', 10)
  const safePage = Number.isFinite(page) && page >= 1 ? page : 1
  offset.value = (safePage - 1) * limit
}

const runListFetch = async () => {
  if (!groupId.value) return
  if (search.value.trim()) await fetchDataFiltered()
  else await fetchGroupDatasets()
}

const applySearch = () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    router.replace({
      path: '/dataset',
      query: cleanQuery({
        ...route.query,
        group_id: groupId.value,
        q: search.value.trim() || undefined,
        page: undefined,
      }),
    })
  }, 400)
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
    router.replace({
      path: '/dataset',
      query: cleanQuery({
        ...route.query,
        group_id: groupId.value,
        q: search.value.trim() || undefined,
        page: page > 1 ? String(page) : undefined,
      }),
    })
  }
}

const redirectToGroup = (newGroupId) => {
  router.replace({
    path: '/dataset',
    query: cleanQuery({ group_id: newGroupId }),
  })
}

watch(
  () => route.query,
  async () => {
    syncFromRoute()
    await runListFetch()
  },
  { deep: true }
)

watch(search, () => {
  if (pickQueryStr(route.query.q) === search.value.trim()) return
  applySearch()
})

onMounted(async () => {
  syncFromRoute()
  await runListFetch()
})
</script>
