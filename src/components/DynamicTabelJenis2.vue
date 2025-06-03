<template>
<button @click="downloadExcelFile" class="btn btn-success mb-3">
  <i class="bi bi-download me-1"></i> Unduh Data
</button>
  <div class="table-responsive" style="max-height: 400px; overflow: auto">
    <table class="table table-bordered" style="min-width: max-content">
      <thead v-html="kontenHeader"></thead>
      <tbody v-html="kontenBody"></tbody>
    </table>
    <div class="_catatanTabel mt-2">
      <p><strong>Catatan:</strong> {{ catatan }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { downloadExcel } from '@/utils/excel'

const props = defineProps({
  data: Array,
  index: Number,
  yearRange: String,
})

const kontenHeader = ref('')
const kontenBody = ref('')
const catatan = ref('-')
const turvarvalRef = ref('')

function gantiSeparator(val) {
  return Number(val).toLocaleString('id-ID')
}

function splitword(text) {
  return text.split(/[\s,]+/).slice(0, 5).join(' ')
}

function downloadExcelFile(){
  downloadExcel(props.data, props.index, '2017-2022',turvarvalRef)
}

watch(
  () => [props.data, props.index, props.yearRange],
  ([data, index, yearRange]) => {
    if (!data?.[index] || !data[index].turtahun?.length) return

    const arrayTahun = yearRange.split('-').map(Number)
    const item = data[index]
    const col = item.turtahun.length
    const labelvervar = item.labelvervar
    const varval = item.var?.[0]?.val ?? ''
    const turvarval = item.turvar?.[0]?.val ?? ''
    turvarvalRef.value = turvarval

    let kolom1 = `<th rowspan="2" style="position: sticky; left: 0; background: #fff; z-index: 2;">${labelvervar}</th>`
    let kolom2 = ''
    const tahunValid = []

    for (let year = arrayTahun[0]; year <= arrayTahun[1]; year++) {
      const tahunItem = item.tahun.find(t => t.label == year)
      if (!tahunItem) continue
      tahunValid.push({ label: year, val: tahunItem.val })

      kolom1 += `<th colspan="${col}">${year}</th>`
      item.turtahun.forEach(tt => {
        kolom2 += `<th style="white-space: nowrap;">${tt.label}</th>`
        // Kalau mau freeze header baris bawah, bisa tambahkan top sticky:
        // kolom2 += `<th style="position: sticky; top: 38px; background: #f8f9fa; z-index: 1;">${tt.label}</th>`
      })
    }

    kontenHeader.value = `
      <tr>${kolom1}</tr>
      <tr>${kolom2}</tr>
    `

    let body = ''
    item.vervar.forEach(vervar => {
      let baris = `<td class="kolom1" style="position: sticky; left: 0; background: #fff; z-index: 1;">${splitword(vervar.label)}</td>`
      tahunValid.forEach(tahun => {
        item.turtahun.forEach(turtahun => {
         // const key = `${vervar.val}${varval}${turvarval}${tahun.val}${turtahun.val}`
          const key = `${String(vervar.val)}${String(varval)}${String(turvarval)}${String(tahun.val)}${String(turtahun.val)}`
          const td = item.datacontent[key] ?? '-'
          baris += `<td class="text-end">${gantiSeparator(td)}</td>`
        })
      })
      body += `<tr>${baris}</tr>`
    })

    kontenBody.value = body
    catatan.value = item.var?.[0]?.note || '-'
  },
  { immediate: true }
)
</script>
