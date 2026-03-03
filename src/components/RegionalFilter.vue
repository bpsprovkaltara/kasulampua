<template>
  <div class="filter-bar">
    <div class="filter-search">
      <i class="bi bi-search search-icon"></i>
      <input
        type="text"
        class="filter-input"
        v-model="search"
        @input="applyFilters"
        placeholder="Cari judul insight..."
      />
    </div>

    <div class="filter-divider" aria-hidden="true"></div>

    <div class="filter-chips">
      <span class="chip-label">Regional:</span>
      <button class="filter-chip" :class="{ active: selectedRegion === '' }" @click="setRegion('')">
        Semua
      </button>
      <button
        v-for="region in regions"
        :key="region.value"
        class="filter-chip"
        :class="{ active: selectedRegion === region.value }"
        @click="setRegion(region.value)"
      >
        {{ region.label }}
      </button>
    </div>

    <div class="filter-select-wrapper">
      <i class="bi bi-tag select-prefix-icon"></i>
      <select class="filter-select" v-model="selectedTopic" @change="applyFilters">
        <option value="">Semua Topik</option>
        <option>Ketenagakerjaan</option>
        <option>Pariwisata</option>
        <option>Industri</option>
        <option>Logistik</option>
        <option>Ekonomi</option>
        <option>Pertanian</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const emit = defineEmits(['filter-changed'])

const search = ref('')
const selectedRegion = ref('')
const selectedTopic = ref('')

const regions = [
  { value: 'kalimantan', label: 'Kalimantan' },
  { value: 'sulawesi', label: 'Sulawesi' },
  { value: 'maluku', label: 'Maluku' },
  { value: 'papua', label: 'Papua' },
]

const setRegion = (val) => {
  selectedRegion.value = val
  applyFilters()
}

const applyFilters = () => {
  emit('filter-changed', {
    keyword: search.value,
    region: selectedRegion.value,
    topik: selectedTopic.value,
  })
}

onMounted(() => {
  if (route.query.keyword) search.value = route.query.keyword
  if (route.query.region) selectedRegion.value = route.query.region
  if (route.query.topik) selectedTopic.value = route.query.topik
  applyFilters()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  flex-wrap: wrap;
}

.filter-search {
  position: relative;
  flex: 1;
  min-width: 240px;
}
.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  pointer-events: none;
}
.filter-input {
  width: 100%;
  padding: 11px 16px 11px 44px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: #fcfcfb;
  outline: none;
  transition: var(--transition-smooth);
}
.filter-input:focus {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
}
.filter-input::placeholder {
  color: var(--text-secondary);
}

.filter-divider {
  width: 1px;
  height: 32px;
  background: var(--border-color);
  flex-shrink: 0;
}

.filter-chips {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.chip-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}
.filter-chip {
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
  white-space: nowrap;
}
.filter-chip:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--bg-accent);
}
.filter-chip.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.filter-select-wrapper {
  position: relative;
  flex-shrink: 0;
}
.select-prefix-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  pointer-events: none;
}
.filter-select {
  padding: 10px 16px 10px 36px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: #fcfcfb;
  outline: none;
  cursor: pointer;
  transition: var(--transition-smooth);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  min-width: 160px;
}
.filter-select:focus {
  border-color: var(--primary-color);
  background-color: white;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
}

@media (max-width: 992px) {
  .filter-bar {
    padding: 16px;
    gap: 12px;
  }
  .filter-divider {
    display: none;
  }
  .filter-search {
    min-width: 100%;
  }
}
</style>
