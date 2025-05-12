<template>
  <section class="bg-light border-bottom py-3 mb-4 mt-4">
    <div class="container d-flex justify-content-between align-items-center flex-wrap">
      <h5 class="fw-bold text-dark mb-0">{{ title }}</h5>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <a href="/" class="text-orange text-decoration-none">
              <i class="bi bi-house-door-fill me-1"></i>Beranda
            </a>
          </li>

          <li v-for="(item, index) in title_detil" :key="index"
            :class="['breadcrumb-item', { active: index === title_detil.length - 1 }]"
            :aria-current="index === title_detil.length - 1 ? 'page' : null">
            <template v-if="index !== title_detil.length - 1">
              <a href="#" class="text-dark text-decoration-none">{{ item }}</a>
            </template>
            <template v-else>
              {{ item.length > 30 ? item.slice(0, 30) + '...' : item }}
            </template>
          </li>
        </ol>
      </nav>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  title_detil: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.bg-light {
  background-color: #ffffff !important;
}

.text-orange {
  color: #f26522;
}

.breadcrumb-item+.breadcrumb-item::before {
  color: #aaa;
}
</style>
