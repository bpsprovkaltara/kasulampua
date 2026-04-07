<template>
  <DatasetSidebarOrganization @organizationSelected="emitOrganizationSelected" />
  <SidebarGroup @groupSelected="emitGroupSelected"  />

</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { defineEmits } from 'vue'
import SidebarGroup from '@/components/DatasetSidebarGroup.vue'
import DatasetSidebarOrganization from '@/components/DatasetSidebarOrganization.vue'

const emit = defineEmits(['groupSelected', 'organizationSelected'])
const router = useRouter()
const route = useRoute()

const activeGroupId = ref(route.query.group_id || '')
const activeOrganizationId = ref(route.query.organization_id || '')

watch(
  () => route.query,
  () => {
    activeGroupId.value = route.query.group_id || ''
    activeOrganizationId.value = route.query.organization_id || ''
  },
  { deep: true }
)

const emitGroupSelected = (groupId) => {
  activeGroupId.value = groupId
  activeOrganizationId.value = ''
  router.push({ path: '/dataset', query: { group_id: groupId } })
  emit('groupSelected', groupId)
}

const emitOrganizationSelected = (orgId) => {
  activeOrganizationId.value = orgId
  activeGroupId.value = ''
  router.push({ path: '/dataset', query: { organization_id: orgId } })
  emit('organizationSelected', orgId)
}
</script>


