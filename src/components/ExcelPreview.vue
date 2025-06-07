<template>
  <div>
    <div v-if="loading" class="text-muted">Sedang memuat data...</div>
    <div class="alert alert-danger mt-3" v-if="error" v-html="error"></div>

    <div v-if="!loading && excelData.length">
      <!-- <table class="table table-bordered table-sm">
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
      </table> -->
      <div class="table-responsive" style="overflow-x: auto; max-height: 500px;">
        <table class="table table-bordered table-sm">
          <thead>
            <tr v-for="(row, rowIndex) in headerRows" :key="'head-' + rowIndex">
              <template v-for="(cell, colIndex) in mergeRowCells(row)" :key="'cell-' + rowIndex + '-' + colIndex">
                <th :colspan="cell.colspan">{{ cell.text }}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in excelData" :key="'row-' + i">
              <td v-for="(cell, j) in row" :key="'cell-' + i + '-' + j">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { ref, watch, onMounted } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
  fileUrl: String,
  visible: Boolean,
  name: String
})

const excelData = ref([])
//const excelHeaders = ref([])
const loading = ref(false)
const error = ref(null)

// const loadExcel = async () => {
//   if (!props.fileUrl) return
//   loading.value = true
//   error.value = null

//   try {
//     const res = await fetch(
//       `${DATAHUB_ENDPOINTS.CKAN_URL_PROXY}?url=` + encodeURIComponent(props.fileUrl)
//     )

//     if (!res.ok) throw new Error('Gagal mengambil file dari server proxy')

//     const blob = await res.blob()
//     const arrayBuffer = await blob.arrayBuffer()
//     const workbook = XLSX.read(arrayBuffer, { type: 'array' })

//     const sheetName = workbook.SheetNames[0]
//     const sheet = workbook.Sheets[sheetName]

//     const jsonData = XLSX.utils.sheet_to_json(sheet)
//     excelData.value = jsonData.slice(0, 20)
//     excelHeaders.value = Object.keys(jsonData[0] || {})
//   } catch (err) {
//     error.value = 'Gagal memuat file Excel: ' + err.message
//   } finally {
//     loading.value = false
//   }
// }

const checkIfPageExists = async (targetUrl, fallbackUrl) => {
  try {
    const encodedUrl = encodeURIComponent(targetUrl)
    const res = await fetch(`${DATAHUB_ENDPOINTS.CEK_URL_DATA_GO_ID}?url=${encodedUrl}`)
    const data = await res.json()
    return data.exists ? targetUrl : fallbackUrl
  } catch {
    return fallbackUrl
  }
}



const showErrorWithLink = async (err, fileUrl,varname) => {

  const urlToCheck = `https://data.go.id/dataset/dataset/${varname}`

  const safeUrl = await checkIfPageExists(urlToCheck,fileUrl)

  error.value = `
    Gagal memuat file, silahkan
    kunjungi halaman asal file:
    <a href="${safeUrl}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">
      Buka File Asal
    </a>
  `
}


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

    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // treat as no header
    excelData.value = rows.slice(0, 25)
  } catch (err) {

    showErrorWithLink(err,props.fileUrl,props.name)

  } finally {
    loading.value = false
  }
}

const mergeRowCells = (row) => {
  const result = []
  let i = 0

  while (i < row.length) {
    const cell = row[i]
    if (cell === '' || cell === null || cell === undefined) {
      i++
      continue
    }

    let span = 1
    while (
      i + span < row.length &&
      (row[i + span] === '' || row[i + span] === null || row[i + span] === undefined)
    ) {
      span++
    }

    result.push({ text: cell, colspan: span })
    i += span
  }

  return result
}





watch(() => props.visible, (val) => {
  if (val) loadExcel()
})

onMounted(() => {
  if (props.visible) {

    loadExcel()
  }
})
</script>

<style scoped>
.excel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.excel-table td,
.excel-table th {
  border: 1px solid #999;
  padding: 4px 8px;
  text-align: left;
}
</style>
