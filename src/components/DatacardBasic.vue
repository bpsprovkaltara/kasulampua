<template>
  <div class="list-group">
    <div
      v-for="(name, index) in datasetNames"
      :key="index"
      class="list-group-item list-group-item-action"
    >
      <i class="bi bi-journal-text text-primary me-2"></i>
      {{ name }}
    </div>
  </div>
</template>

<script setup>
defineProps({ datasetNames: Array })
</script>
