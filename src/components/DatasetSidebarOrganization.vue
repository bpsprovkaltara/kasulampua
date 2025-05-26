<template>
  <h5>Organisasi</h5>
  <ul class="list-unstyled">
    <li v-for="org in organization" :key="org.id" class="mb-2">
      <a href="#" @click.prevent="$emit('organizationSelected', org.id)">
        <i class="bi bi-folder-fill me-2"></i>{{ org.name }}
      </a>
    </li>
  </ul>
</template>

<script setup>
import { DATAHUB_ENDPOINTS } from '@/config/api'
import { ref, onMounted } from 'vue'

const organization = ref([])

onMounted(async () => {
  const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_ORGANIZATION_LIST}`)
  const data = await res.json()
  organization.value = data.map(organization => ({ id: organization.id, name: organization.title }))
})
</script>
