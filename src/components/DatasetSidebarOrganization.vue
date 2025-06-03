<template>
  <h5 class="text-success fw-bold">Organisasi</h5>
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

defineEmits(['organizationSelected'])

onMounted(async () => {
  const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_ORGANIZATION_LIST}`)
  const data = await res.json()
  organization.value = data.map(organization => ({ id: organization.id, name: organization.title,package_count:organization.package_count }))
})
</script>
