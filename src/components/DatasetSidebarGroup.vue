<template>
  <h5>Topik</h5>
  <ul class="list-unstyled">
    <li v-for="group in groups" :key="group.id" class="mb-2">
      <a href="#" @click.prevent="$emit('groupSelected', group.id)">
        <i class="bi bi-folder-fill me-2"></i>{{ group.name }}
      </a>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const groups = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:3500/ckan/group_list')
  const data = await res.json()
  groups.value = data.map(group => ({ id: group.id, name: group.title }))
})
</script>
