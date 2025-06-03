<template>
  <div>
    <div class="mb-3">
      <button
        v-for="item in data[index].turvar"
        :key="item.val"
        class="btn btn-outline-primary btn-sm me-2 mb-2"
        @click="onSelectTurvar(item.val)"
      >
        {{ item.label }}
      </button>
    </div>


    <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">

    <table class="table table-bordered">
      <thead v-html="kontenHeader"></thead>
      <tbody v-html="kontenBody"></tbody>
    </table>
    </div>

    <div class="_catatanTabel">
      <p>{{ catatan }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  data: Array,
  index: Number,
  yearRange: String,
})

const turvarTerpilih = ref('')
const kontenHeader = ref('')
const kontenBody = ref('')
const catatan = ref('-')

function gantiSeparator(val) {
  return Number(val).toLocaleString('id-ID')
}

function splitword(text) {
  return text.split(/[\s,]+/).slice(0, 5).join(' ')
}

function onSelectTurvar(val) {
  turvarTerpilih.value = val
}

watch(
  () => [props.data, props.index, props.yearRange, turvarTerpilih.value],
  ([data, index, yearRange, turvarval]) => {
    if (!data?.[index] || !turvarval) return

    const arrayTahun = yearRange.split('-').map(Number)
    const item = data[index]
    const labelturvar = item.turvar.find(t => t.val == turvarval)?.label || '-'
    const labelvervar = item.labelvervar
    const varval = item.var?.[0]?.val ?? ''
    const turtahunval = item.turtahun?.[0]?.val ?? ''

    // Header
    let kolom = ''
    let col = 0
    const tahunValid = []

    for (let year = arrayTahun[0]; year <= arrayTahun[1]; year++) {
      const tahunItem = item.tahun.find(t => t.label == year)
      if (!tahunItem) continue
      tahunValid.push({ label: year, val: tahunItem.val })
      kolom += `<th>${year}</th>`
      col++
    }

    kontenHeader.value = `
      <tr>
        <th rowspan="2">${labelvervar}</th>
        <th colspan="${col}">${labelturvar}</th>
      </tr>
      <tr>${kolom}</tr>
    `

    // Body
    let body = ''
    item.vervar.forEach(vervar => {
      let baris = `<td class="kolom1" style="position: sticky; left: 0; background: #fff; z-index: 1;">${splitword(vervar.label)}</td>`
      tahunValid.forEach(tahun => {
        const key = `${vervar.val}${varval}${turvarval}${tahun.val}${turtahunval}`
        const td = item.datacontent[key] ?? '-'
        baris += `<td class="text-end">${gantiSeparator(td)}</td>`
      })
      body += `<tr>${baris}</tr>`
    })

    kontenBody.value = body
    catatan.value = item.var?.[0]?.note || '-'

    // Optional: initDatatable(item.vervar.length)
  },
  { immediate: true }
)

// Init pilihan pertama
watch(
  () => props.data,
  (data) => {
    if (data?.[props.index]?.turvar?.length > 0) {
      turvarTerpilih.value = data[props.index].turvar[0].val
    }
  },
  { immediate: true }
)
</script>
