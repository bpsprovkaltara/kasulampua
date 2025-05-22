<template>
  <ul class="pagination flex-wrap justify-content-center">
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="page-link" @click="$emit('pageChanged', 1)">Awal</button>
    </li>

    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="page-link" @click="$emit('pageChanged', currentPage - 1)">←</button>
    </li>

    <li
      v-for="page in visiblePages"
      :key="page"
      class="page-item"
      :class="{ active: page === currentPage }"
    >
      <button class="page-link" @click="$emit('pageChanged', page)">
        {{ page }}
      </button>
    </li>

    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="page-link" @click="$emit('pageChanged', currentPage + 1)">→</button>
    </li>

    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="page-link" @click="$emit('pageChanged', totalPages)">Akhir</button>
    </li>
  </ul>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
})

const screenWidth = ref(window.innerWidth)
const maxVisible = computed(() => (screenWidth.value < 768 ? 3 : 7))

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth)
})

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const half = Math.floor(maxVisible.value / 2)

  let start = current - half
  let end = current + half

  if (start < 1) {
    start = 1
    end = Math.min(maxVisible.value, total)
  }

  if (end > total) {
    end = total
    start = Math.max(1, total - maxVisible.value + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>
