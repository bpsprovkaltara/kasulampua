<template>
  <div class="container" style="margin-top: 350px;">
    <h2 class="section-title" style="color: #168418">Regional Data Repository</h2>
    <p class="text-center col-md-8 offset-md-2 text-wrap" style="color: #185c77">
      Data repositori yang terintegrasi secara machine-to-machine dengan memanfaatkan
      interoperabilitas data dari seluruh provinsi di regional Kasulampua.
    </p>

    <div class="container mt-5">
      <div id="multiImageCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item" v-for="(group, index) in chunkedKategori" :key="index"
            :class="{ active: index === 0 }">
            <div class="d-flex justify-content-center">
              <div class="image-container mx-2" v-for="kategori in group" :key="kategori.id">
                 <a :href="`/dataset?organization_id=${kategori.id}`" target="_blank" class="link-ui">
                <img  :src="kategori.image_display_url || '/assets/images/data_repo_160.png'" class="rounded" :alt="kategori.title" />

                  {{ kategori.title }}</a>
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
import { computed,onMounted,ref } from 'vue'
import { API_ENDPOINTS } from '@/config/api'

const props = defineProps({
  kategori: Array,
  itemsPerSlide: Number
})

const urlCkan = ref();

const chunkedKategori = computed(() => {
  const chunks = []
  for (let i = 0; i < props.kategori.length; i += props.itemsPerSlide) {
    chunks.push(props.kategori.slice(i, i + props.itemsPerSlide))
  }
  return chunks
})

const fetchData = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.SETELAN + '?set_key=ckan_api_url')
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      const rawUrl = data[0].set_val
      urlCkan.value = rawUrl.replace(/\/api$/, '')
    } else {
      console.warn('Data kosong atau format tidak sesuai')
    }
  } catch (err) {
    console.error('Gagal ambil data setelan:', err)
  }
}



onMounted(() => {
  fetchData()
})
</script>
