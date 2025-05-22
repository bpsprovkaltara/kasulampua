<template>
  <SidebarGroup @groupSelected="emitGroupSelected" />
  <DatasetSidebarOrganization @organizationSelected="emitOrganizationSelected" />
</template>

<script setup>
import { defineEmits } from 'vue'
import SidebarGroup from '@/components/DatasetSidebarGroup.vue'
import DatasetSidebarOrganization from '@/components/DatasetSidebarOrganization.vue'

const emit = defineEmits(['groupSelected', 'organizationSelected'])

const emitGroupSelected = (groupId) => {
  emit('groupSelected', groupId)
}

const emitOrganizationSelected = (orgId) => {
  emit('organizationSelected', orgId)
}
</script>
