<template>
  <div class="container-flex my-5 data-section">
    <div class="container">
      <div class="row">
        <div class="col-md-9">
          <h3 class="fw-bolder" style="color: #185c77">[DATA STORY]</h3>
          <h3 class="fw-bolder">{{dataSection.judul}}</h3>
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
