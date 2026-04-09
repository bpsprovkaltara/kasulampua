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
              :to="{ path: '/dataset', query: { group: kat.id } }"
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
                      {{ getDatasetCount(kat) }} Tabel
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
const { categories: kategoriList } = store

const scrollProgress = ref(0)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const activeIndex = ref(0)

const getCategoryIcon = (name) => {
  const n = String(name || '').toLowerCase()
  if (n.includes('sosial')) return 'bi bi-people-fill'
  if (n.includes('kependudukan') || n.includes('migrasi')) return 'bi bi-person-vcard-fill'
  if (n.includes('pertanian')) return 'bi bi-flower2'
  if (n.includes('pendidikan')) return 'bi bi-mortarboard-fill'
  if (n.includes('transportasi')) return 'bi bi-bus-front-fill'
  if (n.includes('ekonomi') || n.includes('neraca')) return 'bi bi-graph-up-arrow'
  if (n.includes('iklim')) return 'bi bi-cloud-sun-fill'
  if (n.includes('kesehatan')) return 'bi bi-heart-pulse-fill'
  if (n.includes('perdagangan')) return 'bi bi-shop'
  if (n.includes('pemerintahan')) return 'bi bi-bank2'
  if (n.includes('perkebunan')) return 'bi bi-tree-fill'
  if (n.includes('miskin') || n.includes('kemiskinan')) return 'bi bi-person-exclamation'
  if (n.includes('kerja') || n.includes('ketenagakerjaan')) return 'bi bi-briefcase-fill'
  if (n.includes('pdrb')) return 'bi bi-bar-chart-fill'
  if (n.includes('harga')) return 'bi bi-tags-fill'
  if (n.includes('wisata') || n.includes('pariwisata')) return 'bi bi-luggage-fill'
  if (n.includes('budaya')) return 'bi bi-palette-fill'
  if (n.includes('gender')) return 'bi bi-gender-ambiguous'
  if (n.includes('konsumsi')) return 'bi bi-wallet2'
  if (n.includes('energi')) return 'bi bi-lightning-charge-fill'
  if (n.includes('industri')) return 'bi bi-buildings-fill'
  if (n.includes('konstruksi')) return 'bi bi-tools'
  
  return 'bi bi-archive-fill'
}

const getCategoryColor = (name) => {
  const n = String(name || '').toLowerCase()
  if (n.includes('sosial')) return 'teal'
  if (n.includes('kependudukan')) return 'cyan'
  if (n.includes('pertanian')) return 'green'
  if (n.includes('pendidikan')) return 'indigo'
  if (n.includes('transportasi')) return 'slate'
  if (n.includes('ekonomi')) return 'amber'
  if (n.includes('iklim')) return 'blue'
  if (n.includes('kesehatan')) return 'rose'
  if (n.includes('perdagangan')) return 'orange'
  if (n.includes('pemerintahan')) return 'slate'
  if (n.includes('perkebunan')) return 'emerald'
  if (n.includes('miskin')) return 'red'
  if (n.includes('kerja')) return 'sky'
  if (n.includes('pdrb')) return 'amber'
  if (n.includes('harga')) return 'orange'
  if (n.includes('wisata')) return 'purple'
  if (n.includes('budaya')) return 'purple'
  if (n.includes('gender')) return 'rose'
  if (n.includes('konsumsi')) return 'emerald'
  if (n.includes('energi')) return 'yellow'
  if (n.includes('industri')) return 'slate'
  if (n.includes('konstruksi')) return 'brown'

  return 'amber'
}

const getDatasetCount = (cat) => {
  return cat.count || 0
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
  -webkit-overflow-scrolling: touch;
  padding: 40px 0;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}

.carousel-track-v2 {
  display: flex;
  gap: 30px;
  padding: 0 40px; 
}

@media (max-width: 768px) {
  .carousel-track-v2 {
    gap: 16px;
    padding: 0 20px;
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: white;
  border-radius: 32px;
  border: 1px solid #e2e8f0;
  padding: 2.25rem 1.5rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  height: 100%;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.dataset-card-premium::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.08));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.dataset-card-premium:hover::before {
  opacity: 1;
}

.is-active .dataset-card-premium {
  border-color: #fce788;
  box-shadow: 0 20px 40px -12px rgba(217, 119, 6, 0.12);
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1;
}

.category-icon-main {
  width: 90px;
  height: 90px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.75rem;
  margin-bottom: 2rem;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
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
.cat-color-red { background: #fef2f2; color: #dc2626; }
.cat-color-sky { background: #f0f9ff; color: #0ea5e9; }
.cat-color-purple { background: #faf5ff; color: #9333ea; }
.cat-color-yellow { background: #fefce8; color: #ca8a04; }
.cat-color-brown { background: #efebe9; color: #5d4037; }

.is-active .cat-color-teal { background: #ccfbf1; box-shadow: 0 8px 16px -4px rgba(13, 148, 136, 0.15); }
.is-active .cat-color-cyan { background: #cffafe; box-shadow: 0 8px 16px -4px rgba(8, 145, 178, 0.15); }
.is-active .cat-color-green { background: #dcfce7; box-shadow: 0 8px 16px -4px rgba(22, 163, 74, 0.15); }
.is-active .cat-color-emerald { background: #d1fae5; box-shadow: 0 8px 16px -4px rgba(5, 150, 105, 0.15); }
.is-active .cat-color-indigo { background: #e0e7ff; box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.15); }
.is-active .cat-color-slate { background: #f1f5f9; box-shadow: 0 8px 16px -4px rgba(71, 85, 105, 0.15); }
.is-active .cat-color-amber { background: #fef3c7; box-shadow: 0 8px 16px -4px rgba(217, 119, 6, 0.15); }
.is-active .cat-color-blue { background: #dbeafe; box-shadow: 0 8px 16px -4px rgba(37, 99, 235, 0.15); }
.is-active .cat-color-rose { background: #ffe4e6; box-shadow: 0 8px 16px -4px rgba(225, 29, 72, 0.15); }
.is-active .cat-color-orange { background: #ffedd5; box-shadow: 0 8px 16px -4px rgba(234, 88, 12, 0.15); }
.is-active .cat-color-red { background: #fee2e2; box-shadow: 0 8px 16px -4px rgba(220, 38, 38, 0.15); }
.is-active .cat-color-sky { background: #e0f2fe; box-shadow: 0 8px 16px -4px rgba(14, 165, 233, 0.15); }
.is-active .cat-color-purple { background: #f3e8ff; box-shadow: 0 8px 16px -4px rgba(147, 51, 234, 0.15); }
.is-active .cat-color-yellow { background: #fef9c3; box-shadow: 0 8px 16px -4px rgba(202, 138, 4, 0.15); }
.is-active .cat-color-brown { background: #d7ccc8; box-shadow: 0 8px 16px -4px rgba(93, 64, 55, 0.15); }

.is-active .category-icon-main,
.dataset-card-premium:hover .category-icon-main {
  transform: scale(1.1) rotate(5deg);
}

.category-name-v2 {
  font-weight: 900;
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.dataset-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.stats-badge {
  font-size: 0.75rem;
  font-weight: 800;
  color: #d97706;
  background: #fffbeb;
  padding: 6px 14px;
  border-radius: 12px;
  border: 1px solid #fde68a;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.dataset-card-premium:hover {
  transform: translateY(-12px) scale(1.05);
  box-shadow: 0 30px 60px -15px rgba(217, 119, 6, 0.2);
  border-color: #fce788;
}

.dataset-card-premium:hover .stats-badge {
  background: #fef3c7;
  transform: scale(1.05);
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
    padding: 60px 0 40px;
  }
  .carousel-wrapper {
    padding: 10px 0;
    margin: 0 -15px;
  }
  .carousel-track-v2 {
    gap: 12px;
    padding: 0 15px;
  }
  .carousel-card-wrapper {
    flex: 0 0 calc(85vw - 40px);
    min-width: 260px;
    max-width: 320px;
  }
  .carousel-spacer {
    flex: 0 0 10px;
  }
  .section-title-premium {
    font-size: 1.5rem;
    line-height: 1.3;
    margin-bottom: 2rem !important;
  }
  .header-content {
    text-align: center;
    width: 100%;
  }
  .nav-controls {
    display: none !important;
  }
  .banner-title {
    font-size: 1.4rem;
  }
  .banner-text {
    font-size: 0.95rem;
  }
  .btn-premium-cta-primary {
    width: 100%;
    text-align: center;
    padding: 1rem !important;
    justify-content: center;
  }
  .glass-banner {
    border-radius: 24px;
    padding: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .dataset-card-premium {
    padding: 1.5rem 1rem;
    border-radius: 24px;
  }
  .category-icon-main {
    width: 70px;
    height: 70px;
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
  }
  .category-name-v2 {
    font-size: 1.1rem;
  }
  .banner-title {
    font-size: 1.25rem;
  }
}
</style>
