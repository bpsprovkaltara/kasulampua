<template>
  <div class="header text-center">
    <div class="mt-5">
  <img :src="header.logo" alt="Logo" class="my-3" />
  <h5 class="fw-bolder" style="color: #187718;font-size: 24pt;">KONSULTASI REGIONAL PDRB</h5>
  <p class="col-md-8 offset-md-2" style="color:#005596;font-size: 6vw;font-weight: bold;">KASULAMPUA</p>

  <div class="mt-3 p-3 rounded col-md-8 offset-md-2 mx-3 mx-md-auto" style="border: 5px solid #02609A;">
    <div class="d-flex align-items-center justify-content-between flex-wrap">
      <div class="d-flex align-items-center">
        <i class="bi bi-geo-alt-fill fs-3 me-3" style="color:#005596;"></i>
        <div class="d-flex flex-column">
          <span class="fw-bold" style="color: #02609A; font-size: 16pt;">KONREG PDRB KASULAMPUA TAHUN 2025</span>
          <span class="text-start" style="font-size: 11pt; color: #000;">BANJARMASIN, 12 JUNI 2025</span>
        </div>
      </div>
      <a :href="link.href" class="btn btn-primary rounded-pill px-4 mt-3 mt-sm-0">
        KUNJUNGI PUSAT INFORMASI <i class="bi bi-arrow-right ms-2"></i>
      </a>
    </div>
  </div>
</div>


    <div class="container my-5">
      <div class="row text-center">
        <div class="col-md-3" v-for="(item, key) in regions" :key="key">
          <div class="card" style="background-color: #F8FFF8;height: 363px;width: auto;">
            <div class="card-body">
              <img :src="item.icon" :alt="'icon_' + key" style="height: 232px; width: auto" />
              <h5 class="card-title text-capitalize">{{ key }}</h5>
              <router-link :to="{ path: '/visualisasi_data', query: { region: key } }" class="btn"
                style="color: white; background-color: #02609a">
                Lihat Insight
              </router-link>

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
