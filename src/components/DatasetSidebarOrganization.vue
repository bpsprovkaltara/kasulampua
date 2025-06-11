<template>
  <h5 class="text-success fw-bold">Organisasi</h5>
  <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  <ul class="list-unstyled">
    <li v-for="org in organization" :key="org.id" class="mb-2">
      <a href="#" @click.prevent="$emit('organizationSelected', org.id)" class="link-ui">
        <i class="bi bi-folder-fill me-2"></i>{{ org.name }} ({{ org.package_count }})
      </a>
    </li>
  </ul>
</template>

<script setup>
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { ref, onMounted } from 'vue'

const organization = ref([])
const loading = ref(true)

defineEmits(['organizationSelected'])

onMounted(async () => {
  loading.value = true
  const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_ORGANIZATION_LIST}`)
  let data = await res.json()

  data = data.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  organization.value = data.map(organization => ({ id: organization.id, name: organization.title,package_count:organization.package_count }))
  loading.value = false

})
</script>
