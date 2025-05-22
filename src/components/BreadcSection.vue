<template>
  <section class="border-bottom py-3 mb-4 mt-4">
    <div class="container d-flex justify-content-between align-items-center flex-wrap">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <a href="/" class="text-orange text-decoration-none">
              <i class="bi bi-house-door-fill me-1"></i>Beranda
            </a>
          </li>

          <li v-for="(item, index) in title_detil.parent" :key="index" class="breadcrumb-item">
            <a :href="item.path" class="text-dark text-decoration-none">
              {{ item.label }}
            </a>
          </li>

          <li class="breadcrumb-item active" aria-current="page">
            {{ title_detil.title.length > 30 ? title_detil.title.slice(0, 30) + '...' : title_detil.title }}
          </li>
        </ol>
      </nav>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title_detil: {
    type: Object,
    default: () => ({
      title: '',
      parent: []
    })
  }
})
</script>

<style scoped>
.text-orange {
  color: #f26522;
}

.breadcrumb-item + .breadcrumb-item::before {
  color: #aaa;
}
</style>
