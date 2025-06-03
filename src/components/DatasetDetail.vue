<template>
  <div v-if="dataset" class="container py-5">
    <div class="mb-4 border-bottom pb-2">
      <h2 class="fw-bold">{{ dataset.title }}</h2>
      <p class="text-muted">{{ dataset.notes }}</p>
    </div>

    <div class="mb-4">
      <h5 class="fw-bold mb-3">📌 Informasi Umum</h5>
      <ul class="list-group">

        <li class="list-group-item d-flex justify-content-start align-items-start">
          <div class="me-3 fw-semibold" style="min-width: 180px">Organisasi</div>
          <div>{{ dataset.organization?.title || '-' }}</div>
        </li>

        <li class="list-group-item d-flex justify-content-start align-items-start">
          <div class="me-3 fw-semibold" style="min-width: 180px">Author</div>
          <div>
            {{ dataset.author || '-' }}
            <span v-if="dataset.author_email">({{ dataset.author_email }})</span>
          </div>
        </li>

        <li class="list-group-item d-flex justify-content-start align-items-start">
          <div class="me-3 fw-semibold" style="min-width: 180px">Lisensi</div>
          <div>
            <a :href="dataset.license_url" class="link-ui" target="_blank">{{ dataset.license_title }}</a>
          </div>
        </li>

        <li class="list-group-item d-flex justify-content-start align-items-start">
          <div class="me-3 fw-semibold" style="min-width: 180px">Tanggal Dibuat</div>
          <div>{{ formatDate(dataset.metadata_created) }}</div>
        </li>

        <li v-if="dataset.tags?.length" class="list-group-item d-flex justify-content-start align-items-start">
          <div class="me-3 fw-semibold" style="min-width: 180px">Tag</div>
          <div>
            <span v-for="tag in dataset.tags" :key="tag.id" class="badge bg-success me-1">{{ tag.display_name }}</span>
          </div>
        </li>

        <li v-for="item in dataset.extras || []" :key="item.key"
          class="list-group-item d-flex justify-content-start align-items-start">
          <div class="me-3 fw-semibold" style="min-width: 180px">{{ item.key }}</div>
          <div>{{ item.value }}</div>
        </li>

      </ul>
    </div>


    <div v-if="dataset.resources?.length" class="mb-4">
      <h4 class="fw-bold mb-3">📁 File Tersedia</h4>
      <ul class="list-group mb-3">
        <li class="list-group-item d-flex justify-content-between align-items-start"
          v-for="resource in paginatedResources" :key="resource.id">
          <div class="me-auto">
            <div class="fw-bold">{{ resource.name }}</div>
            <small class="text-muted">{{ resource.description }}</small>
          </div>
          <div class="d-flex flex-column align-items-end">
            <span class="badge bg-secondary mb-2">{{ resource.format }}</span>
            <div class="d-flex gap-2">
              <a :href="resource.url" class="btn btn-sm btn-outline-success" target="_blank" @click="trackDownload(resource.id+'##'+resource.name)">
                ⬇ Unduh ({{ jumlahDownload[`${resource.id}##${resource.name}`] || 0 }})
              </a>
              <button
                v-if="['xlsx', 'xls', 'csv'].includes(resource.format.toLowerCase())"
                class="btn btn-sm btn-outline-success"
                @click="previewExcel(resource.url)"
              >
                👁️ Preview
              </button>
            </div>
          </div>

        </li>
      </ul>

      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">«</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
          </li>
        </ul>
      </nav>
    </div>


  </div>

  <div v-else class="text-center py-5">
    <div class="spinner-border text-secondary" role="status"></div>
    <p class="mt-3">Memuat data dataset...</p>
  </div>
<div v-if="showModal" class="modal-backdrop fade show position-fixed" style="z-index: 1040;"></div>

<div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="z-index: 1050;">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Preview Data Excel</h5>
        <button type="button" class="btn-close" @click="showModal = false"></button>
      </div>
      <div class="modal-body">
        <ExcelPreview :fileUrl="fileUrl" :visible="showModal" />
      </div>
    </div>
  </div>
</div>

</template>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ExcelPreview from '../components/ExcelPreview.vue'
import { DATAHUB_ENDPOINTS } from '@/config/api'

const route = useRoute()
const dataset = ref(null)

const currentPage = ref(1)
const itemsPerPage = 10
const emit = defineEmits(['setTitle','setOrganizationName'])
const jumlahDownload = ref({})

const paginatedResources = computed(() => {
  if (!dataset.value?.resources) return []
  const start = (currentPage.value - 1) * itemsPerPage
  return dataset.value.resources.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return dataset.value?.resources
    ? Math.ceil(dataset.value.resources.length / itemsPerPage)
    : 1
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const showModal = ref(false)
const fileUrl = ref('')

const previewExcel = (url) => {
  fileUrl.value = url
  showModal.value = true
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchDataset = async (id) => {
  try {
    const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_DATASET_SHOW}/${id}`)
    const data = await res.json()
    dataset.value = data.result
    emit('setTitle', dataset.value.title)
    emit('setOrganizationName', dataset.value.organization?.title)

    dataset.value.resources.forEach(resource => {
      const label = `${resource.id}##${resource.name}`
      fetchDownloadStats(label)
    })

  } catch (err) {
    console.error("Gagal mengambil dataset:", err)
  }
}


const fetchDownloadStats = async (label) => {
   const res = await fetch(`${DATAHUB_ENDPOINTS.ANALYTICS_DOWNLOAD}?label=${encodeURIComponent(label)}`)
   const data = await res.json()

    const items = Array.isArray(data) ? data : [data]
    items.forEach(item => {
      jumlahDownload.value[item.label] = Number(item.nb_events || 0)
    })
}

const trackDownload = (label) => {
  window._paq?.push(['trackEvent', 'Dataset', 'Download', label])
}



onMounted(() => {
  const id = route.params.id || route.query.id
  if (id) fetchDataset(id)

})
</script>
