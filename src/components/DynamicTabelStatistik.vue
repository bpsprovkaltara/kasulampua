<template>
  <component
    :is="componentMap[detectedJenis]"
    :data="data"
    :index="index"
    :yearRange="yearRange"
    v-bind="detectedJenis === 'jenis3' ? { turvarval: turvarval } : {}"
  />
</template>

<script setup>
import { computed } from 'vue'

import TabelStatistikJenis1 from './DynamicTabelJenis1.vue'
import TabelStatistikJenis2 from './DynamicTabelJenis2.vue'
import TabelStatistikJenis3 from './DynamicTabelJenis3.vue'

const props = defineProps({
  data: Array,
  index: Number,
  yearRange: String,
  turvarval: {
    type: String,
    default: '', // untuk jenis3
  },
})

// Komponen map
const componentMap = {
  jenis1: TabelStatistikJenis1,
  jenis2: TabelStatistikJenis2,
  jenis3: TabelStatistikJenis3,
}

const detectedJenis = computed(() => {
  const item = props.data[props.index]
  if (!item) return 'jenis1'

  const tahun = parseInt(item.tahun[0].val)
  const turtahun = parseInt(item.turtahun[0].val)
  const turvar = parseInt(item.turvar[0].val)

  if (tahun != 0 && turtahun == 0 && turvar ==0) {
    return 'jenis1'
  }else if (turvar == 0 && turtahun != 0 && tahun != 0) {
    return 'jenis2'
  }else if (turtahun != 0 && turvar != 0 && tahun != 0) {
    return 'jenis3'
  } else {
    return 'jenis1'
  }
})
</script>
