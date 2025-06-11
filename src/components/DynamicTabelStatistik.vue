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
  const item = props.data
  if (!item) return 'jenis1'

  const turtahunLength = item.turtahun?.length || 0
  const turtahunval = item.turtahun?.[0]?.val || 0
  const turvarLength = item.turvar?.length || 0

  if (turtahunval == 0 && turvarLength === 1) {
    return 'jenis1'
  } else if (turtahunval !== 0 && turtahunLength > 1 && turvarLength === 1) {
    return 'jenis2'
  } else if (turtahunval == 0 && turvarLength > 1) {
    return 'jenis3'
  } else {
    return 'jenis2'
  }
})
</script>
