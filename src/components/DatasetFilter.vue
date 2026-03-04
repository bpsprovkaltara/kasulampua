<template>
  <div class="search-filter-wrapper position-relative">
    <i class="bi bi-search search-icon"></i>
    <input
      v-model="searchInput"
      @keyup.enter="emitSearch"
      class="form-control"
      placeholder="Cari dataset atau instansi..."
    />
  </div>
</template>

<style scoped>
.search-filter-wrapper .search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  font-size: 1.125rem;
}

.search-filter-wrapper .form-control {
  padding-left: 2.75rem !important;
}
</style>

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
