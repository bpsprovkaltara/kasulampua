<template>
  <div class="pagination-bar" v-if="totalPages > 1">
    <button
      class="page-btn"
      :disabled="currentPage === 1"
      @click="emitPage(currentPage - 1)"
      aria-label="Previous page"
    >
      <i class="bi bi-chevron-left"></i>
    </button>

    <div class="page-numbers">
      <button
        v-for="(p, idx) in visiblePages"
        :key="idx"
        class="page-num"
        :class="{ active: p === currentPage, ellipsis: p === '...' }"
        :disabled="p === '...'"
        @click="p !== '...' && emitPage(p)"
      >
        {{ p }}
      </button>
    </div>

    <button
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="emitPage(currentPage + 1)"
      aria-label="Next page"
    >
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['change'])

const emitPage = (p) => {
  if (p >= 1 && p <= props.totalPages) {
    emit('change', p)
  }
}

const visiblePages = computed(() => {
  const total = props.totalPages
  const cur = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = []
  if (cur > 3) {
    pages.push(1)
    if (cur > 4) pages.push('...')
  }

  const start = Math.max(1, cur - 2)
  const end = Math.min(total, cur + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (cur < total - 2) {
    if (cur < total - 3) pages.push('...')
    pages.push(total)
  } else if (end < total) {
    for (let i = end + 1; i <= total; i++) {
      pages.push(i)
    }
  }

  return pages.filter((v, i, a) => a.indexOf(v) === i)
})
</script>

<style scoped>
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.page-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--bg-accent-light);
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-num {
  min-width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 700;
  transition: var(--transition-smooth);
  padding: 0 14px;
}

.page-num:hover:not(.ellipsis) {
  background: var(--bg-accent-light);
  border-color: var(--border-amber-20);
  color: var(--primary-color);
}

.page-num.active {
  background: var(--amber-600);
  border-color: var(--amber-600);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.page-num.ellipsis {
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
