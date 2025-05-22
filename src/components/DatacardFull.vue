<template>
  <div class="list-group">
    <div
      v-for="(dataset, index) in datasets"
      :key="dataset.id || index"
      class="list-group-item list-group-item-action"
    >
      <div class="d-flex justify-content-between">
        <div>
          <h6 class="mb-1">
            <i class="bi bi-journal-text text-primary me-2"></i>
            {{ dataset.title }}
          </h6>
          <small class="text-muted">{{ dataset.organization?.title || 'Tidak diketahui' }}</small><br />
          <small class="text-muted">📅 {{ formatDate(dataset.metadata_created) }}</small><br />
          <small class="text-muted">{{ dataset.notes?.slice(0, 100) || 'Tanpa deskripsi' }}</small>
        </div>
        <div class="text-end">
          <a
            v-if="dataset.resources?.[0]?.url"
            :href="dataset.resources[0].url"
            target="_blank"
            class="badge bg-success text-decoration-none text-white"
          >
            ⬇ Download
          </a>
          <span v-else class="badge bg-secondary">No File</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ datasets: Array })

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
