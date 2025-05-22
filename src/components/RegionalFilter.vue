<template>
  <div class="row g-3 mb-4">
    <div class="col-md-4">
      <input
        type="text"
        class="form-control"
        v-model="search"
        @input="applyFilters"
        placeholder="Cari"
      />
    </div>

    <div class="col-md-4">
      <select class="form-select" v-model="selectedRegion" @change="applyFilters">
        <option value="">Pilih Regional</option>
        <option value="kalimantan">Kalimantan</option>
        <option value="sulawesi">Sulawesi</option>
        <option value="maluku">Maluku</option>
        <option value="papua">Papua</option>
      </select>
    </div>

    <div class="col-md-4">
      <select class="form-select" v-model="selectedTopic" @change="applyFilters">
        <option value="">Pilih Topik</option>
        <option>Ketenagakerjaan</option>
        <option>Pariwisata</option>
        <option>Industri</option>
        <option>Logistik</option>
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

const applyFilters = () => {
  emit('filter-changed', {
    keyword: search.value,
    region: selectedRegion.value,
    topik: selectedTopic.value
  })
}

onMounted(() => {
  if (route.query.keyword) search.value = route.query.keyword
  if (route.query.region) selectedRegion.value = route.query.region
  if (route.query.topik) selectedTopic.value = route.query.topik

  applyFilters()
})
</script>
