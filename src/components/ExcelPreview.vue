<template>
  <div>
    <div v-if="loading" class="text-muted">Sedang memuat data...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <div class="table-responsive" v-if="!loading && excelData.length">
      <table class="table table-bordered table-sm">
        <thead class="table-light">
          <tr>
            <th v-for="(header, i) in excelHeaders" :key="i">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in excelData" :key="i">
            <td v-for="(header, j) in excelHeaders" :key="j">{{ row[header] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { ref, watch, onMounted } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
  fileUrl: String,
  visible: Boolean
})

const excelData = ref([])
const excelHeaders = ref([])
const loading = ref(false)
const error = ref(null)

const loadExcel = async () => {
  if (!props.fileUrl) return
  loading.value = true
  error.value = null

  try {
    const res = await fetch(
      `${DATAHUB_ENDPOINTS.CKAN_URL_PROXY}?url=` + encodeURIComponent(props.fileUrl)
    )

    if (!res.ok) throw new Error('Gagal mengambil file dari server proxy')

    const blob = await res.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const jsonData = XLSX.utils.sheet_to_json(sheet)
    excelData.value = jsonData.slice(0, 20)
    excelHeaders.value = Object.keys(jsonData[0] || {})
  } catch (err) {
    error.value = 'Gagal memuat file Excel: ' + err.message
  } finally {
    loading.value = false
  }
}

watch(() => props.visible, (val) => {
  if (val) loadExcel()
})

onMounted(() => {
  if (props.visible) loadExcel()
})
</script>
