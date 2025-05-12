<template>
  <div class="container" style="margin-top: 200px;">
    <h2 class="section-title" style="color: #168418">Regional Data Repository</h2>
    <p class="text-center col-md-8 offset-md-2 text-wrap" style="color: #185c77">
      Data repositori yang terintegrasi secara machine-to-machine dengan memanfaatkan
      interoperabilitas data dari seluruh provinsi di regional Kasulampua.
    </p>

    <div class="container mt-5">
      <div id="multiImageCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item" v-for="(group, index) in chunkedImages" :key="index"
            :class="{ active: index === 0 }">
            <div class="d-flex justify-content-center">
              <div class="image-container mx-2" v-for="image in group" :key="image.id">
                <img :src="image.src" class="rounded" :alt="image.title" />
                <div class="image-title fw-bolder text-wrap">{{ image.title }}</div>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#multiImageCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" style="background-color: #000"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#multiImageCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" style="background-color: #000"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  images: Array,
  itemsPerSlide: Number
})

const chunkedImages = computed(() => {
  const chunks = []
  for (let i = 0; i < props.images.length; i += props.itemsPerSlide) {
    chunks.push(props.images.slice(i, i + props.itemsPerSlide))
  }
  return chunks
})
</script>
