<template>
  <div class="container-flex my-5 news">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <img :src="berita.headline_image" alt="headline" class="img-fluid" />
        </div>
        <div class="col-md-9">
          <h4 class="fw-bolder">{{ berita.judul_headline }}</h4>
          <p>
            {{ berita.ringkasan_headline }}
            <a class="fw-bolder" style="color: black" :href="berita.href">{{ berita.text }}</a>
          </p>
          <a class="btn rounded-pill" :href="berita.link_lainnya" style="background-color: #187718; color: white">
            {{ berita.text_lainnya }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  berita: Object
})
</script>
