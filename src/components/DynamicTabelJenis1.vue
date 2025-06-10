<template>
  <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
    <table id="_tabel" class="table table-bordered">
      <thead id="_tabelhead" v-html="kontenHeader"></thead>
      <tbody id="_tabelbody" v-html="kontenBody"></tbody>
    </table>
    <div class="_catatanTabel">
      <p>{{ catatan }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props / Reactive Input
const props = defineProps({
  data: Array,
  index: Number,
  yearRange: String
})

// Reactive State
const kontenHeader = ref('')
const kontenBody = ref('')
const catatan = ref('-')

// Helper
function gantiSeparator(val) {
  return Number(val).toLocaleString('id-ID')
}

function splitword(text) {
  return text.split(/[\s,]+/).slice(0, 5).join(' ')
}


// Watch input
watch(
  () => [props.data, props.index, props.yearRange],
  ([data, index, yearRange]) => {
    if (!data?.[index]) return

    const arrayTahun = yearRange.split('-').map(Number)
    const col = arrayTahun[1] - arrayTahun[0] + 1

    const item = data[index]
    const labelvervar = item.labelvervar
    const varval = item.var?.[0]?.val ?? ''
    const turvarval = item.turvar?.[0]?.val ?? ''
    const turtahunval = item.turtahun?.[0]?.val ?? ''

    // Generate header
    let konten = `
      <tr>
        <th rowspan="2">${labelvervar}</th>
        <th colspan="${col}">Tahun</th>
      </tr>
      <tr id="_bariskolom">
    `
    const tahunValid = []
    for (let year = arrayTahun[0]; year <= arrayTahun[1]; year++) {
      const cekTahun = item.tahun.find(t => t.label == year)
      if (cekTahun) {
        tahunValid.push({ label: year, val: cekTahun.val })
        konten += `<th>${year}</th>`
      }
    }
    konten += '</tr>'
    kontenHeader.value = konten

    // Generate body
    let body = ''
    item.vervar.forEach(vervar => {
      let baris = `<td class="kolom1">${splitword(vervar.label)}</td>`
      tahunValid.forEach(tahun => {
        const key = `${vervar.val}${varval}${turvarval}${tahun.val}${turtahunval}`
        //console.log(key)
        const td = item.datacontent[key] ?? '-'
        baris += `<td class="text-end">${gantiSeparator(td)}</td>`
      })
      body += `<tr>${baris}</tr>`
    })
    kontenBody.value = body

    catatan.value = item.var?.[0]?.note || '-'

    // Optional: initDatatable could be called here if needed
    // initDatatable(item.vervar.length)
  },
  { immediate: true }
)
</script>
