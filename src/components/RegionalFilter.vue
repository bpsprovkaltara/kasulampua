<template>
  <div class="row g-3 mb-4">
    <div class="col-md-4">
      <input
        type="text"
        class="form-control"
        v-model="search"
        placeholder="Cari"
      />
    </div>

    <div class="col-md-4">
      <select class="form-select" v-model="selectedRegion">
        <option value="" disabled selected hidden>Pilih Regional</option>
        <option>Kalimantan</option>
        <option>Sulawesi</option>
        <option>Maluku</option>
        <option>Papua</option>
      </select>
    </div>

    <div class="col-md-4">
      <select class="form-select" v-model="selectedTopic">
        <option value="" disabled selected hidden>Pilih Topik</option>
        <option>Ketenagakerjaan</option>
        <option>Pariwisata</option>
        <option>Industri</option>
        <option>Logistik</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
const selectedRegion = ref('')
const selectedTopic = ref('')
</script>
