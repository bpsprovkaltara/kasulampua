<template>
  <section class="indikator-section py-5">
    <div class="container">
      <div class="d-flex align-items-center mb-5">
        <div class="section-label me-4">
          <span class="label-text">DATA STRATEGIS</span>
        </div>
        <div class="flex-grow-1 section-line"></div>
      </div>

      <div class="main-card">
        <div class="tabs-header">
          <div class="tabs-scroll-wrapper">
            <button
              v-for="kat in kategori"
              :key="kat"
              class="tab-btn"
              :class="{ active: activeTab === kat }"
              @click="setTab(kat)"
            >
              {{ kat }}
            </button>
          </div>
        </div>

        <div class="card-body-content p-4">
          <div class="search-box mb-4">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Cari judul dataset..."
            />
          </div>

          <div v-if="paginatedDataset.length > 0" class="dataset-list">
            <router-link
              v-for="(data, idx) in paginatedDataset"
              :key="data.id"
              :to="`/resource/${data.ckan_resource_id || data.id}`"
              class="dataset-row"
            >
              <div class="dataset-number">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</div>
              <div class="dataset-title flex-grow-1">{{ data.title || data.judul }}</div>
              <div class="dataset-year" v-if="data.year">{{ data.year }}</div>
              <i class="bi bi-arrow-right dataset-arrow"></i>
            </router-link>
          </div>

          <div v-else class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>
              Belum ada data untuk kategori <strong>{{ activeTab }}</strong>
            </p>
          </div>
          <div class="pagination-bar mt-4" v-if="totalPages > 1">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
              <i class="bi bi-chevron-left"></i>
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { API_ENDPOINTS } from '@/config/api'

const kategori = ref([])
const activeTab = ref('')
const allDataset = ref([])
const itemsPerPage = 10
const currentPage = ref(1)
const searchQuery = ref('')

const fetchKategori = async () => {
  try {
    /*
    const res = await fetch(API_ENDPOINTS.DATASET_KATEGORI)
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      kategori.value = data.map((item) => item.name || item.nama)
      activeTab.value = kategori.value[0]
    }
    */

    // DUMMY DATA FOR PRESENTATION
    kategori.value = ['Sosial', 'Kependudukan', 'Pertanian', 'Ekonomi', 'Kesehatan', 'Pendidikan']
    activeTab.value = kategori.value[0]
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
}

const fetchDataset = async () => {
  try {
    /*
    const res = await fetch(API_ENDPOINTS.DATASET)
    const rawData = await res.json()
    const catRes = await fetch(API_ENDPOINTS.DATASET_KATEGORI)
    const catData = await catRes.json()
    const catMap = {}
    catData.forEach((c) => {
      catMap[c.id] = c.name || c.nama
    })
    allDataset.value = rawData.map((d) => ({ ...d, kategori_nama: catMap[d.category] }))
    */

    // DUMMY DATA FOR PRESENTATION
    allDataset.value = [
      { id: 1, title: 'Indeks Pembangunan Manusia 2023', year: '2023', kategori_nama: 'Sosial', ckan_resource_id: 'ipm-2023' },
      { id: 2, title: 'Persentase Penduduk Miskin Menurut Kabupaten', year: '2023', kategori_nama: 'Sosial', ckan_resource_id: 'miskin-2023' },
      { id: 3, title: 'Jumlah Penduduk Berdasarkan Jenis Kelamin', year: '2022', kategori_nama: 'Kependudukan', ckan_resource_id: 'gender-2022' },
      { id: 4, title: 'Produksi Kayu Bulat Regional', year: '2023', kategori_nama: 'Pertanian', ckan_resource_id: 'kayu-2023' },
      { id: 5, title: 'Luas Panen Padi Menurut Subround', year: '2024', kategori_nama: 'Pertanian', ckan_resource_id: 'padi-2024' },
      { id: 6, title: 'Laju Pertumbuhan PDRB Atas Dasar Harga Konstan', year: '2023', kategori_nama: 'Ekonomi', ckan_resource_id: 'pdrb-konstan' }
    ]
  } catch (error) {
    console.error('Gagal mengambil dataset:', error)
  }
}

const setTab = (kat) => {
  activeTab.value = kat
  currentPage.value = 1
}

const filteredDataset = computed(() => {
  const byCategory = allDataset.value.filter((item) => item.kategori_nama === activeTab.value)
  if (!searchQuery.value.trim()) return byCategory
  return byCategory.filter((item) =>
    (item.title || item.judul || '').toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const totalPages = computed(() => Math.ceil(filteredDataset.value.length / itemsPerPage))

const paginatedDataset = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDataset.value.slice(start, start + itemsPerPage)
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
.indikator-section {
  background: #fafaf9;
}

.section-label {
  flex-shrink: 0;
}
.label-text {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: #d97706;
  background: #fffbeb;
  border: 1px solid #fde68a;
  padding: 6px 14px;
  border-radius: 100px;
}
.section-line {
  height: 1px;
  background: linear-gradient(to right, #e7e5e4, transparent);
}

.main-card {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 40px -5px rgba(0, 0, 0, 0.08);
  border: 1px solid #f5f5f4;
}

.tabs-header {
  background: #fafaf9;
  border-bottom: 1px solid #f0efee;
  padding: 0 1.5rem;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
.tabs-header::-webkit-scrollbar {
  display: none;
}

.tabs-scroll-wrapper {
  display: inline-flex;
  gap: 4px;
  padding: 12px 0;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #78716c;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}
.tab-btn:hover {
  color: #d97706;
  background: #fffbeb;
}
.tab-btn.active {
  color: #d97706;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.search-box {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a8a29e;
  font-size: 0.9rem;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1.5px solid #e7e5e4;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #1c1917;
  background: #fafaf9;
  transition: all 0.2s ease;
  outline: none;
}
.search-input:focus {
  border-color: #d97706;
  background: white;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}
.search-input::placeholder {
  color: #a8a29e;
}

.dataset-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dataset-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #1c1917;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.dataset-row:hover {
  background: #fffbeb;
  border-color: #fde68a;
  transform: translateX(4px);
  color: #1c1917;
}

.dataset-number {
  font-size: 0.75rem;
  font-weight: 700;
  color: #a8a29e;
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}

.dataset-title {
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}
.dataset-row:hover .dataset-title {
  color: #d97706;
}

.dataset-year {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: #d97706;
  padding: 2px 10px;
  border-radius: 100px;
  flex-shrink: 0;
}

.dataset-arrow {
  color: #d4d0cb;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.dataset-row:hover .dataset-arrow {
  color: #d97706;
  transform: translateX(4px);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #a8a29e;
}
.empty-state i {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.3;
}
.empty-state p {
  font-size: 0.9rem;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #e7e5e4;
  background: white;
  color: #78716c;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:hover:not(:disabled) {
  border-color: #d97706;
  color: #d97706;
  background: #fffbeb;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-info {
  font-size: 0.85rem;
  font-weight: 600;
  color: #78716c;
}
</style>
