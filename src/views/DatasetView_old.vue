<template>
  <div class="container-fluid">
    <div class="row mt-4">
      <div class="col-md-2 border-end">
        <h6 class="fw-bold mb-3">Topics</h6>
        <ul class="list-unstyled">
          <li v-for="group in topics" :key="group.id" class="mb-2">
            <a href="#" @click.prevent="selectGroup(group.id)" class="text-decoration-none text-dark">
              <i class="bi bi-folder-fill me-2"></i>{{ group.name }}
            </a>
          </li>
        </ul>
      </div>

      <div class="col-md-10">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <input v-model="search" @input="applySearch" type="text" class="form-control w-50"
            placeholder="Masukkan Kata Pencarian">
        </div>

        <div class="list-group">
          <div v-for="(dataset, index) in filteredDatasets" :key="index" class="list-group-item list-group-item-action">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="mb-1">
                  <i class="bi bi-journal-text text-primary me-2"></i>
                  {{ dataset.title }}
                </h6>
                <small class="text-muted">{{ dataset.organization?.title || 'Tidak diketahui' }}</small><br />
                <small class="text-muted">📅 {{ formatDate(dataset.metadata_created) }}</small>
              </div>
              <div class="text-end">
                <span class="badge bg-secondary">👁️ {{ dataset.views || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <nav class="mt-3 ms-auto">
          <div class="d-flex justify-content-center">
            <ul class="pagination flex-wrap">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(1)">⇐ Awal</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)">←</button>
            </li>

            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(currentPage + 1)">→</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(totalPages)">Akhir ⇢</button>
            </li>
          </ul>
          </div>

        </nav>


      </div>
    </div>
  </div>
</template>

<script setup>
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { ref, onMounted, computed } from 'vue'


const datasets = ref([])
const filteredDatasets = ref([])
const search = ref('')
const offset = ref(0)
const limit = 10
const totalCount = ref(1000)

const fetchData = async () => {
  try {
    const url = `${DATAHUB_ENDPOINTS.CKAN_DATASET}?limit=${limit}&offset=${offset.value}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.success) {
      datasets.value = data.result.map(ds => ({
        ...ds,
        views: Math.floor(Math.random() * 100)
      }))
      filteredDatasets.value = datasets.value
    } else {
      console.error('CKAN API error:', data.error)
    }
  } catch (err) {
    console.error('Fetch error:', err)
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

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const currentPage = computed(() => Math.floor(offset.value / limit) + 1)
const totalPages = computed(() => Math.ceil(totalCount.value / limit))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    offset.value = (page - 1) * limit
    fetchData()
  }
}

const maxVisible = 7
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const half = Math.floor(maxVisible / 2)

  let start = current - half
  let end = current + half

  if (start < 1) {
    start = 1
    end = Math.min(maxVisible, total)
  }

  if (end > total) {
    end = total
    start = Math.max(1, total - maxVisible + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const topics = ref([])

const fetchGroups = async () => {
  try {
    const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_GROUP_LIST}`)
    const data = await res.json()

    topics.value = data.map(group => ({
      name: group.title,
      id: group.id
    }))
  } catch (err) {
    console.error('Gagal ambil data group:', err)
  }
}

const selectedGroup = ref(null)

const selectGroup = async (groupId) => {
  selectedGroup.value = groupId
  try {
    const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_GROUP}/${groupId}?include=true`)
    const data = await res.json()

    datasets.value = data.packages.map(ds => ({
      ...ds,
      views: Math.floor(Math.random() * 100) // dummy view count
    }))
    filteredDatasets.value = datasets.value
  } catch (err) {
    console.error("Gagal fetch dataset group:", err)
  }
}


onMounted(() => {
  fetchGroups()
  fetchData()
})



</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>
