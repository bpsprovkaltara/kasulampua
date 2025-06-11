<template>
  <h5 class="text-success fw-bold">Topik</h5>
  <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  <ul class="list-unstyled">
    <li v-for="group in groups" :key="group.id" class="mb-2">
      <a href="#" @click.prevent="$emit('groupSelected', group.id)" class="link-ui">
        <i class="bi bi-folder-fill me-2"></i>{{ group.name }} ({{ group.package_count }})
      </a>
    </li>
  </ul>
</template>

<script setup>
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { ref, onMounted } from 'vue'

const groups = ref([])
const loading = ref(true)

defineEmits(['groupSelected'])

onMounted(async () => {
  loading.value = true

  const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_GROUP_LIST}`)
  const data = await res.json()
  groups.value = data.map(group => ({ id: group.id, name: group.title,package_count:group.package_count }))
  loading.value = false

})
</script>
