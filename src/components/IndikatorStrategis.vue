<template>
  <div style="margin-top: 310px;">
    <div class="container my-4">
      <h4 class="text-center fw-bold text-success mb-4">
        DATA STRATEGIS REGIONAL
      </h4>

      <div class="card shadow-sm rounded">
        <div class="card-header bg-light p-0">
          <ul class="nav nav-tabs justify-content-center border-0">
            <li class="nav-item" v-for="kat in kategori" :key="kat">
              <button
                class="nav-link"
                :class="{ active: activeTab === kat }"
                @click="setTab(kat)"
              >
                {{ kat }}
              </button>
            </li>
          </ul>
        </div>


        <div class="card-body text-start">
          <div class="mb-3">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Cari judul dataset..."
            />
          </div>
          <div v-if="paginatedDataset.length > 0">
            <ul class="list-group list-group-flush">
              <li class="list-group-item" v-for="data in paginatedDataset" :key="data.id">
                <router-link
                  :to="`/resource/${data.ckan_resource_id}`"
                  class="text-success link-ui"
                >
                  {{ data.judul }} [{{ data.tahun }}]
                </router-link>

              </li>
            </ul>

            <!-- Pagination -->
            <div class="mt-3 d-flex justify-content-center" v-if="totalPages > 1">
              <button
                class="btn btn-sm btn-outline-success mx-1"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                &laquo; Prev
              </button>
              <span class="mx-2 align-self-center">
                Halaman {{ currentPage }} dari {{ totalPages }}
              </span>
              <button
                class="btn btn-sm btn-outline-success mx-1"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Next &raquo;
              </button>
            </div>
          </div>

          <div v-else>
            <strong>Belum ada data untuk kategori {{ activeTab }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { API_ENDPOINTS } from '@/config/api'

const kategori = ref([])
const activeTab = ref('')
const allDataset = ref([])

const itemsPerPage = 10
const currentPage = ref(1)

const fetchKategori = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.DATASET_KATEGORI)
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      kategori.value = data.map(item => item.nama)
      activeTab.value = kategori.value[0]
    }
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}

const fetchDataset = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.LISTDATASET)
    const data = await res.json()
    allDataset.value = data
  } catch (error) {
    console.error('Gagal mengambil dataset:', error)
  }
}


const setTab = (kat) => {
  activeTab.value = kat
  currentPage.value = 1
}

// const filteredDataset = computed(() =>
//   allDataset.value.filter(item => item.kategori_nama === activeTab.value)
// )

const totalPages = computed(() =>
  Math.ceil(filteredDataset.value.length / itemsPerPage)
)

const paginatedDataset = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDataset.value.slice(start, start + itemsPerPage)
})

const searchQuery = ref('')

const filteredDataset = computed(() => {
  const filteredByCategory = allDataset.value.filter(item => item.kategori_nama === activeTab.value)

  if (!searchQuery.value.trim()) return filteredByCategory

  return filteredByCategory.filter(item =>
    item.judul.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


watch(activeTab, () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchKategori()
  fetchDataset()
})
</script>

<style scoped>
.nav-tabs .nav-link {
  border: none;
  color: #000;
}
.nav-tabs .nav-link.active {
  border-bottom: 3px solid #4caf50;
  font-weight: bold;
  color: #000;
  background-color: #f8f9fa;
}
</style>
