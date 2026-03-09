<template>
  <section class="border-bottom py-3 mb-4 mt-4">
    <div class="container d-flex justify-content-between align-items-center flex-wrap">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">
            <a href="/" class="text-amber-breadcrumb text-decoration-none" aria-label="Kembali ke Beranda">
              <i class="bi bi-house-door-fill me-1"></i>Beranda
            </a>
          </li>

          <li v-for="(item, index) in title_detil.parent" :key="index" class="breadcrumb-item">
            <a :href="item.path" class="text-dark text-decoration-none" :aria-label="`Ke halaman ${item.label}`">
              {{ item.label }}
            </a>
          </li>

          <li class="breadcrumb-item active" aria-current="page">
            {{ (title_detil.title && title_detil.title.length > 30) ? title_detil.title.slice(0, 30) + '...' : (title_detil.title || 'Tidak tersedia') }}
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
.text-amber-breadcrumb {
  color: var(--primary-color);
}

.breadcrumb-item + .breadcrumb-item::before {
  color: #aaa;
}
</style>
