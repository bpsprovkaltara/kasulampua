<template>
  <input
    v-model="searchInput"
    @keyup.enter="emitSearch"
    class="form-control"
    placeholder="Masukkan Kata Pencarian"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  search: String
})
const emit = defineEmits(['update:search', 'search'])

const searchInput = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val)
})

const emitSearch = () => {
  emit('search', searchInput.value)
}
</script>
