<template>
  <div class="col-md-4 mb-4">
    <div class="card border-1 rounded shadow-sm h-100" style="border-color: #b3d7e6;">

      <div class="position-relative">
        <img :src="image" class="card-img-top" alt="..." style="height: 200px; object-fit: cover;" />
        <span
          class="badge position-absolute bottom-0 start-0 m-3 text-white px-3 py-1 rounded"
          :style="{ backgroundColor: badgeColorMap[badgeColor] }"
        >
          {{ region }}
        </span>
      </div>

      <div class="card-body">
        <h5 class="card-title fw-semibold mt-2 text-start">

          <router-link :to="`/regional_insight/${id}`">{{ title }}</router-link>

        </h5>

        <ul class="list-unstyled text-muted text-start small mt-3">
          <li class="mb-1">
            <i class="bi bi-calendar-event me-2"></i> {{ date }}
          </li>
          <li class="mb-1">
            <i class="bi bi-person me-2"></i> {{ author }}
          </li>
          <li>
            <i class="bi bi-geo-alt me-2"></i> {{ location }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id:String,
  image: String,
  region: String,
  title: String,
  date: String,
  author: String,
  location: String,
  badgeColor: {
    type: String,
    default: 'success'
  }
})

const badgeColorMap = {
  success: '#28a745',
  danger: '#dc3545',
  info: '#17a2b8',
  warning: '#ffc107',
  primary: '#007bff',
  secondary: '#6c757d'
}
</script>
