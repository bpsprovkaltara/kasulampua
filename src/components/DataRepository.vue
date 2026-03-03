<template>
  <section class="data-repo-premium py-5 position-relative overflow-hidden">
    <div class="bg-accent-glow"></div>

    <div class="container-fluid px-0">
      <div class="container mb-5">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-4">
          <div class="header-content">
            <div class="badge-premium mb-2">DATA REPOSITORY</div>
            <h2 class="section-title-premium">Katalog Data Terintegrasi</h2>
          </div>
          <div class="nav-controls d-flex align-items-center gap-3">
            <button @click="scrollPrev" class="btn-scroll" :disabled="isAtStart">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button @click="scrollNext" class="btn-scroll" :disabled="isAtEnd">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="carousel-wrapper" ref="carouselRef" @scroll="handleScroll">
        <div class="carousel-track-v2">
          <div class="carousel-spacer"></div>

          <div
            v-for="(kat, idx) in kategoriList"
            :key="kat.id"
            class="carousel-card-wrapper"
            :class="{ 'is-active': activeIndex === idx }"
          >
            <router-link
              :to="{ path: '/dataset', query: { kategori: kat.name } }"
              class="dataset-card-premium"
            >
              <div class="card-inner">
                <div class="category-icon-main">
                  <i :class="getCategoryIcon(kat.name)"></i>
                </div>
                <div class="card-content">
                  <h4 class="category-name-v2">{{ kat.name }}</h4>
                  <p class="category-desc">
                    Kumpulan dataset strategis terkait {{ kat.name.toLowerCase() }} di wilayah
                    Kasulampua.
                  </p>
                  <div class="card-footer-v2">
                    <span class="view-data"
                      >Lihat Dataset <i class="bi bi-arrow-right ms-1"></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="card-reflection"></div>
            </router-link>
          </div>

          <div class="carousel-spacer"></div>
        </div>
      </div>
      <div class="container mt-5">
        <div class="progress-nav-container">
          <div class="progress-bg">
            <div class="progress-bar-amber" :style="{ width: scrollProgress + '%' }"></div>
          </div>
          <div class="scroll-instruction-v2 d-flex align-items-center justify-content-center gap-3">
            <div class="line-dot"></div>
            <span>GESER UNTUK EKSPLORASI</span>
            <div class="line-dot"></div>
          </div>
        </div>
      </div>

      <div class="container mt-5 pt-4">
        <div class="glass-banner p-4 p-md-5">
          <div class="row align-items-center">
            <div class="col-lg-8 mb-4 mb-lg-0">
              <h3 class="banner-title mb-2">Akses Data Terbuka Nasional</h3>
              <p class="banner-text mb-0 opacity-75">
                Mendukung pengambilan keputusan berbasis data yang akurat dan transparan untuk
                seluruh wilayah Kalimantan, Sulawesi, Maluku, dan Papua.
              </p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <router-link to="/dataset" class="btn-premium-cta btn-premium-cta-primary px-5 py-3">
                Mulai Eksplorasi Data <i class="bi bi-search ms-2"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { API_ENDPOINTS } from '@/config/api'

const carouselRef = ref(null)
const kategoriList = ref([])
const activeIndex = ref(0)
const scrollProgress = ref(0)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const getCategoryIcon = (name) => {
  const icons = {
    Sosial: 'bi bi-people-fill',
    Kependudukan: 'bi bi-person-vcard-fill',
    Pertanian: 'bi bi-sun-fill',
    Pendidikan: 'bi bi-mortarboard-fill',
    Transportasi: 'bi bi-truck-front-fill',
    Ekonomi: 'bi bi-graph-up-arrow',
    Iklim: 'bi bi-cloud-sun-fill',
    Kesehatan: 'bi bi-heart-pulse-fill',
    Perdagangan: 'bi bi-cart-fill',
    Pemerintahan: 'bi bi-bank2',
    Perkebunan: 'bi bi-tree-fill',
  }
  return icons[name] || 'bi bi-archive-fill'
}

const fetchData = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.DATASET_KATEGORI)
    const data = await res.json()
    kategoriList.value = data || []
  } catch (err) {
    console.error('API Error:', err)
  }
}

const handleScroll = () => {
  if (!carouselRef.value) return
  const el = carouselRef.value
  const scrollLeft = el.scrollLeft
  const scrollWidth = el.scrollWidth - el.clientWidth

  scrollProgress.value = (scrollLeft / scrollWidth) * 100

  const center = scrollLeft + el.clientWidth / 2
  const cardWidth = 290
  const index = Math.floor((center - el.clientWidth / 2) / cardWidth)
  activeIndex.value = Math.max(0, Math.min(kategoriList.value.length - 1, index))

  isAtStart.value = scrollLeft < 10
  isAtEnd.value = scrollLeft > scrollWidth - 10
}

const scrollNext = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: 290, behavior: 'smooth' })
  }
}

const scrollPrev = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: -290, behavior: 'smooth' })
  }
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
.data-repo-premium {
  background: white;
  padding: 80px 0;
}

.bg-accent-glow {
  position: absolute;
  top: 50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.03) 0%, transparent 70%);
  z-index: 1;
}

.badge-premium {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: #d97706;
  background: #fffbeb;
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid #fef3c7;
}

.section-title-premium {
  font-weight: 900;
  font-size: 2.5rem;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.btn-scroll {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  transition: all 0.4s ease;
  cursor: pointer;
}

.btn-scroll:hover:not(:disabled) {
  border-color: #d97706;
  color: #d97706;
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.btn-scroll:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-wrapper {
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 40px 0;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}

.carousel-track-v2 {
  display: flex;
  gap: 30px;
  padding: 0 20px;
}

.carousel-spacer {
  flex: 0 0 15%;
}

.carousel-card-wrapper {
  flex: 0 0 260px;
  scroll-snap-align: center;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.7;
  transform: scale(0.9);
}

.carousel-card-wrapper.is-active {
  opacity: 1;
  transform: scale(1.08) translateY(-10px);
  z-index: 10;
}

.dataset-card-premium {
  display: block;
  background: white;
  border-radius: 28px;
  border: 1px solid #e2e8f0;
  padding: 2.5rem 2rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  height: 100%;
  transition: all 0.5s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.is-active .dataset-card-premium {
  border-color: #fde68a;
  box-shadow: 0 25px 50px -12px rgba(217, 119, 6, 0.12);
}

.category-icon-main {
  width: 70px;
  height: 70px;
  background: #f8fafc;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #d97706;
  margin-bottom: 2rem;
  transition: all 0.5s ease;
}

.is-active .category-icon-main {
  background: #fffbeb;
  transform: scale(1.1) rotate(5deg);
}

.category-name-v2 {
  font-weight: 900;
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.category-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.view-data {
  font-weight: 800;
  font-size: 0.85rem;
  color: #d97706;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-reflection {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

.dataset-card-premium:hover .card-reflection {
  left: 100%;
}

.dataset-card-premium:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -10px rgba(217, 119, 6, 0.15);
  border-color: var(--primary-color);
}

.progress-nav-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.progress-bg {
  width: 100%;
  height: 2px;
  background: #f1f5f9;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress-bar-amber {
  height: 100%;
  background: #d97706;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.scroll-instruction-v2 {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.line-dot {
  width: 40px;
  height: 1px;
  background: #e2e8f0;
}

.glass-banner {
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  border: 1px solid #fde68a;
  border-radius: 32px;
  box-shadow: 0 15px 35px rgba(217, 119, 6, 0.05);
  position: relative;
  overflow: hidden;
}

.glass-banner::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.banner-title {
  font-weight: 900;
  font-size: 1.75rem;
  color: #1e293b;
}

.banner-text {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
}

.btn-banner-action {
  display: inline-flex;
  align-items: center;
  background: #1e293b;
  color: white;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.4s ease;
}

.btn-banner-action:hover {
  background: #d97706;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(217, 119, 6, 0.2);
}

@media (max-width: 768px) {
  .carousel-card-wrapper {
    flex: 0 0 240px;
  }
  .carousel-spacer {
    flex: 0 0 10%;
  }
  .section-title-premium {
    font-size: 1.75rem;
  }
  .banner-title {
    font-size: 1.25rem;
  }
  .btn-banner-action {
    width: 100%;
    justify-content: center;
  }
}
</style>
