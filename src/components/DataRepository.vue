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
            <button @click="scrollPrev" class="btn-scroll" :disabled="isAtStart" aria-label="Geser katalog ke kiri">
              <i class="bi bi-chevron-left" aria-hidden="true"></i>
            </button>
            <button @click="scrollNext" class="btn-scroll" :disabled="isAtEnd" aria-label="Geser katalog ke kanan">
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
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
                <div class="category-icon-main" :class="'cat-color-' + getCategoryColor(kat.name)">
                  <i :class="getCategoryIcon(kat.name)"></i>
                </div>
                <div class="card-content">
                  <h4 class="category-name-v2">{{ kat.name }}</h4>
                  <div class="dataset-stats mt-3">
                    <span class="stats-badge">
                      <i class="bi bi-database-fill me-1"></i>
                      {{ getDatasetCount(kat.id) }} Tabel
                    </span>
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
              <a href ="/dataset" class="btn-premium-cta btn-premium-cta-primary px-5 py-3">
                Mulai Eksplorasi Data <i class="bi bi-search ms-2"></i>     
        </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDatasetStore } from '@/composables/useDatasetStore'

const carouselRef = ref(null)
const store = useDatasetStore()
const { allDatasets, categories: kategoriList } = store

const scrollProgress = ref(0)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const activeIndex = ref(0)

const getCategoryIcon = (name) => {
  const icons = {
    Sosial: 'bi bi-people-fill',
    Kependudukan: 'bi bi-person-vcard-fill',
    Pertanian: 'bi bi-flower2',
    Pendidikan: 'bi bi-mortarboard-fill',
    Transportasi: 'bi bi-bus-front-fill',
    Ekonomi: 'bi bi-graph-up-arrow',
    Iklim: 'bi bi-cloud-sun-fill',
    Kesehatan: 'bi bi-heart-pulse-fill',
    Perdagangan: 'bi bi-shop-window',
    Pemerintahan: 'bi bi-bank2',
    Perkebunan: 'bi bi-tree-fill',
  }
  return icons[name] || 'bi bi-archive-fill'
}

const getCategoryColor = (name) => {
  const colors = {
    Sosial: 'teal',
    Kependudukan: 'cyan',
    Pertanian: 'green',
    Pendidikan: 'indigo',
    Transportasi: 'slate',
    Ekonomi: 'amber',
    Iklim: 'blue',
    Kesehatan: 'rose',
    Perdagangan: 'orange',
    Pemerintahan: 'slate',
    Perkebunan: 'emerald',
  }
  return colors[name] || 'amber'
}

const getDatasetCount = (catId) => {
  return allDatasets.value.filter((d) => d.category === catId).length
}

const handleScroll = () => {
  if (!carouselRef.value) return
  const el = carouselRef.value
  const scrollLeft = el.scrollLeft
  const scrollWidth = el.scrollWidth - el.clientWidth

  scrollProgress.value = (scrollLeft / (scrollWidth || 1)) * 100
  
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
  store.fetchAllData()
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
  flex: 0 0 220px;
  scroll-snap-align: center;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 1;
  transform: scale(0.95);
}

.carousel-card-wrapper.is-active {
  opacity: 1;
  transform: scale(1.05) translateY(-5px);
  z-index: 10;
}

.dataset-card-premium {
  display: block;
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  padding: 1.75rem 1.5rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  height: 100%;
  transition: all 0.5s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.is-active .dataset-card-premium {
  border-color: #fde68a;
  box-shadow: 0 20px 40px -12px rgba(217, 119, 6, 0.15);
}

.category-icon-main {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  transition: all 0.5s ease;
}

.cat-color-teal { background: #f0fdfa; color: #0d9488; }
.cat-color-cyan { background: #ecfeff; color: #0891b2; }
.cat-color-green { background: #f0fdf4; color: #16a34a; }
.cat-color-emerald { background: #ecfdf5; color: #059669; }
.cat-color-indigo { background: #eef2ff; color: #4f46e5; }
.cat-color-slate { background: #f8fafc; color: #475569; }
.cat-color-amber { background: #fffbeb; color: #d97706; }
.cat-color-blue { background: #eff6ff; color: #2563eb; }
.cat-color-rose { background: #fff1f2; color: #e11d48; }
.cat-color-orange { background: #fff7ed; color: #ea580c; }

.is-active .cat-color-teal { background: #ccfbf1; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2); }
.is-active .cat-color-cyan { background: #cffafe; box-shadow: 0 4px 12px rgba(8, 145, 178, 0.2); }
.is-active .cat-color-green { background: #dcfce7; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2); }
.is-active .cat-color-emerald { background: #d1fae5; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2); }
.is-active .cat-color-indigo { background: #e0e7ff; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2); }
.is-active .cat-color-slate { background: #f1f5f9; box-shadow: 0 4px 12px rgba(71, 85, 105, 0.2); }
.is-active .cat-color-amber { background: #fef3c7; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2); }
.is-active .cat-color-blue { background: #dbeafe; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
.is-active .cat-color-rose { background: #ffe4e6; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2); }
.is-active .cat-color-orange { background: #ffedd5; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2); }

.is-active .category-icon-main {
  transform: scale(1.1) rotate(5deg);
}

.category-name-v2 {
  font-weight: 900;
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.dataset-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-badge {
  font-size: 0.7rem;
  font-weight: 800;
  color: #d97706;
  background: #fffbeb;
  padding: 4px 12px;
  border-radius: 10px;
  border: 1px solid #fde68a;
  display: inline-flex;
  align-items: center;
}

.dataset-card-premium:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px -10px rgba(217, 119, 6, 0.2);
  border-color: #d97706;
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
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary-color, #d97706);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  animation: pulse-cue 2.5s infinite ease-in-out;
}

@keyframes pulse-cue {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; transform: scale(1.02); }
}

.line-dot {
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color, #d97706), transparent);
}

.glass-banner {
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  border: 1px solid #fde68a;
  border-radius: 32px;
  box-shadow: 0 15px 35px rgba(217, 119, 6, 0.05);
  position: relative;
  overflow: hidden;
  z-index: 5;
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
  .data-repo-premium {
    padding: 60px 0;
  }
  .carousel-wrapper {
    padding: 20px 0;
  }
  .carousel-track-v2 {
    gap: 16px;
  }
  .carousel-card-wrapper {
    flex: 0 0 240px;
  }
  .carousel-spacer {
    flex: 0 0 5%;
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
  .btn-premium-cta-primary {
    width: 100%;
    text-align: center;
    padding: 1rem !important;
  }
  .glass-banner {
    border-radius: 20px;
    padding: 1.5rem !important;
  }
}
</style>
