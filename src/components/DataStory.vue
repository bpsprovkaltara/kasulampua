<template>
  <div class="container-flex my-5 data-section">
    <div class="container">
      <div class="row">
        <div class="col-md-9">
              <h3 class="fw-bolder" style="color: #185c77">[DATA STORY]</h3>
          <hr>
          <div class="row">
            <div class="col-md-3">
              <img :src="dataSection.gambar" style="height: 200px;"
                alt="headline" class="img-fluid" />
            </div>
            <div class="col-md-9">
              <h3 class="fw-bolder">{{ dataSection.judul }}</h3>
              <p>
                {{ dataSection.deskripsi }}
                <a class="fw-bolder" style="color: black" :href="dataSection.link_lainnya">
                  {{ dataSection.text_lainnya }}
                </a>
              </p>
              <h5 class="fw-bolder">Dataset:</h5>
              <ul>
                <li v-for="link in dataset" :key="link.title">
                  <a class="nav-link" :href="link.url" style="color: #02609a">{{ link.title }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div class="border rounded p-3 mb-4 d-flex flex-wrap gap-4">
              <div class="flex-fill">
                <small class="d-block mb-1">Topik</small>
                <i class="bi bi-journal-text me-1"></i> {{ dataSection.topik }}
              </div>
              <div class="flex-fill">
                <small class="d-block mb-1">Regional</small>
                <i class="bi bi-building me-1"></i> {{ dataSection.region }}
              </div>
              <div class="flex-fill">
                <small class="d-block mb-1">Wilayah</small>
                <i class="bi bi-diagram-3-fill me-1"></i> {{ dataSection.wilayah }}
              </div>
            </div>
          </div>

        </div>
        <div class="col-md-3">
          <img src="/assets/images/img_kasulampua.png" alt="img_kasulampua" class="mobile-hidden img-fluid" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dataSection: Object,
  dataset: Array
})
</script>
