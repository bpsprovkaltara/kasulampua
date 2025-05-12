<template>
  <div class="header text-center">
    <div class="mt-5">
      <img :src="header.logo" alt="Logo" class="my-3" />
      <h5 class="fw-bolder" style="color: #187718">KONSULTASI REGIONAL PDRB</h5>
      <h1>{{ header.title }}</h1>
      <p class="col-md-8 offset-md-2" style="color:#185C77">{{ header.description }}</p>
      <a :href="link.href" class="btn rounded-pill" style="background-color: #187718;color: white;">Pusat Informasi</a>
    </div>

    <div class="container my-5">
      <div class="row text-center">
        <div class="col-md-3" v-for="(item, key) in regions" :key="key">
          <div class="card" style="background-color: #F8FFF8;height: 363px;width: auto;">
            <div class="card-body">
              <img :src="item.icon" :alt="'icon_' + key" style="height: 232px; width: auto" />
              <h5 class="card-title text-capitalize">{{ key }}</h5>
              <a :href="item.insight" class="btn" style="color: white; background-color: #02609a">Lihat Insight</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  header: Object,
  link: Object,
  regions: Object
})
</script>
