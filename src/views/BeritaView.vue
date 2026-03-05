<template>
  <Navbar />

  <header class="hero-v2">
    <div class="hero-v2-glow" aria-hidden="true"></div>
    <div class="hero-v2-dots" aria-hidden="true"></div>

    <div class="container position-relative" style="z-index: 10">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="hero-v2-badge">
            <span class="badge-dot"></span>
            PUBLIKASI &amp; INFORMASI
          </div>

          <h1 class="hero-v2-title">
            Berita <br />
            <em>Terkini</em>
          </h1>

          <p class="hero-v2-subtitle">
            Informasi terbaru seputar kegiatan, kebijakan, dan perkembangan data regional Kasulampua
            <span class="hero-v2-amp">&mdash;</span> Kalimantan, Sulawesi, Maluku, Papua.
          </p>
        </div>

        <div class="col-lg-4 d-none d-lg-flex justify-content-end align-items-center">
          <div class="hero-count-badge">
            <i class="bi bi-newspaper hero-badge-icon"></i>
            <div>
              <div class="hero-count-num text-amber">{{ beritaList.length }}</div>
              <div class="hero-count-label">Artikel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="berita-content py-5">
    <div class="container">
      <div class="berita-filterbar mb-5">
        <div class="filter-search flex-grow-1">
          <i class="bi bi-search search-icon"></i>
          <input
            class="filter-input"
            type="text"
            v-model="searchQuery"
            @input="applySearch"
            placeholder="Cari berita..."
          />
          <button
            class="search-clear"
            v-if="searchQuery"
            @click="clearSearch"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="filter-result-info d-none d-md-block" v-if="!loading">
          <i class="bi bi-filter2 me-1"></i>
          <strong>{{ filteredList.length }}</strong> berita
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="berita-spinner mx-auto mb-3"></div>
        <p class="text-muted small">Memuat berita...</p>
      </div>
      <div v-else-if="!filteredList.length" class="empty-state">
        <i class="bi bi-newspaper empty-icon"></i>
        <h5 class="fw-bold mt-3 mb-1">Tidak ada berita ditemukan</h5>
        <p class="text-muted small">Coba kata kunci lain.</p>
        <button
          class="btn btn-sm btn-outline-amber rounded-pill px-4 mt-2"
          @click="clearSearch"
        >
          Reset Pencarian
        </button>
      </div>

      <template v-else>
        <router-link
          v-if="currentPage === 1 && paginatedList[0]"
          :to="`/berita/${paginatedList[0].slug}`"
          class="featured-card mb-5 d-block text-decoration-none"
        >
          <div class="row g-0 align-items-stretch">
            <div class="col-lg-6">
              <div class="featured-img-wrapper">
                <img
                  :src="urlImage(paginatedList[0].image) || '/assets/images/default-news.jpg'"
                  :alt="paginatedList[0].title"
                  class="featured-img"
                />
                <div class="featured-img-overlay"></div>
                <div class="featured-label">
                  <span class="fl-dot"></span>
                  BERITA TERBARU
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="featured-body d-flex flex-column justify-content-between h-100 p-5">
                <div>
                  <div class="news-date mb-3">
                    <i class="bi bi-calendar3 me-2"></i>
                    {{
                      formatLongDate(
                        paginatedList[0].tanggal_diperbarui || paginatedList[0].created_at,
                      )
                    }}
                  </div>
                  <h2 class="featured-title mb-3">{{ paginatedList[0].title }}</h2>
                  <p class="featured-excerpt">{{ stripHTMLText(paginatedList[0].content)?.slice(0, 220) }}...</p>
                </div>
                <div class="mt-4 d-flex justify-content-between align-items-center">
                  <span class="author-chip" v-if="paginatedList[0].penulis">
                    <i class="bi bi-person me-1"></i>{{ paginatedList[0].penulis?.slice(0, 20) }}
                  </span>
                  <div class="detail-label">
                    Baca Berita
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>

        <div class="row g-4">
          <div
            v-for="(item, index) in (currentPage === 1 ? paginatedList.slice(1) : paginatedList)"
            :key="item.id || index"
            class="col-md-6 col-lg-4"
          >
            <router-link
              :to="`/berita/${item.slug}`"
              class="news-card h-100 d-block text-decoration-none"
            >
              <div class="nc-img-wrapper">
                <img
                  :src="urlImage(item.image) || '/assets/images/default-news.jpg'"
                  :alt="item.title"
                  class="nc-img"
                />
                <div class="nc-img-overlay"></div>
              </div>

              <div class="nc-body">
                <div class="nc-meta">
                  <span class="nc-date">
                    <i class="bi bi-calendar3 me-1"></i>
                    {{ formatLongDate(item.tanggal_diperbarui || item.created_at) }}
                  </span>
                  <span class="nc-author" v-if="item.penulis">
                    <i class="bi bi-person me-1"></i>{{ item.penulis?.slice(0, 16) }}
                  </span>
                </div>
                <h5 class="nc-title">
                  {{ item.title }}
                </h5>
                <p class="nc-excerpt">{{ stripHTMLText(item.content)?.slice(0, 110) }}...</p>
                <div class="detail-label mt-3">
                  Baca Berita
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <PaginationControl
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="(p) => { currentPage = p; applySearch() }"
        />
      </template>
    </div>
  </section>

  <Footer />
</template>

<script setup>
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import { API_ENDPOINTS } from '../config/api'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { formatLongDate } from '../utils/dates'
import { DUMMY_BERITA } from '../utils/dummyBerita'
import PaginationControl from '../components/PaginationControl.vue'

const beritaList = ref([])
const searchQuery = ref('')
const loading = ref(true)
const route = useRoute()

const currentPage = ref(1)
const itemsPerPage = 7 

const filteredList = computed(() => {
  let list = beritaList.value
  if (searchQuery.value.trim()) {
    list = list.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage))

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredList.value.slice(start, start + itemsPerPage)
})

watch(searchQuery, () => {
  currentPage.value = 1
})

const fetchBerita = async () => {
  loading.value = true
  try {
    /*
    const query = new URLSearchParams(filter).toString()
    const res = await fetch(`${API_ENDPOINTS.BERITA}?${query}`)
    beritaList.value = (await res.json()) || []
    */

    // DUMMY DATA 
    beritaList.value = DUMMY_BERITA
  } catch (err) {
    console.error('Gagal memuat berita:', err)
  } finally {
    loading.value = false
  }
}

function urlImage(image) {
  if (!image) return false
  if (image.startsWith('http')) return image
  return API_ENDPOINTS.BASE_URL + '/uploads/berita/' + image
}

function stripHTMLText(htmlStr) {
  if (!htmlStr) return ''
  let text = htmlStr.replace(/<br\s*\/?>/gi, ' ').replace(/<\/p>/gi, ' ')
  text = text.replace(/<[^>]*>?/gm, '')
  text = text.replace(/&nbsp;/g, ' ')
  return text.trim().replace(/\s+/g, ' ')
}

function applySearch() {
  /* computed handles it */
}

onMounted(() => {
  const initial = {}
  if (route.query.q) {
    initial.keyword = route.query.q
    searchQuery.value = route.query.q
  }
  fetchBerita(initial)
})

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  applySearch()
}
</script>

<style scoped>
.hero-count-badge {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: var(--border-radius);
  padding: 1.5rem 2.5rem;
}
.hero-badge-icon {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.4);
}
.hero-count-num {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1;
  color: white;
}
.hero-count-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.berita-content {
  background: var(--bg-color);
  min-height: 60vh;
}

.berita-filterbar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.filter-search {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1rem;
  pointer-events: none;
}
.filter-input {
  width: 100%;
  padding: 12px 40px 12px 48px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: #fcfcfb;
  outline: none;
  transition: var(--transition-smooth);
  min-width: 320px;
}
.filter-input:focus {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
}
.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-smooth);
}
.search-clear:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}
.filter-result-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  flex-shrink: 0;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: 8px;
}

.featured-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
  transition: var(--transition-smooth);
}
.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -15px rgba(217, 119, 6, 0.15);
  border-color: var(--primary-color);
}
.featured-card:hover .featured-title {
  color: var(--primary-color);
}
.featured-card:hover .detail-label {
  opacity: 1;
  transform: translateX(0);
}
.featured-img-wrapper {
  position: relative;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
}
.featured-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.featured-card:hover .featured-img {
  transform: scale(1.05);
}
.featured-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 60%);
}
.featured-label {
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.fl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: pulse 1.5s ease-in-out infinite;
  display: inline-block;
}

.featured-body {
  background: white;
  padding: 3rem !important;
}
.news-date {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
  display: flex;
  align-items: center;
}
.news-date i {
  color: var(--primary-color);
}
.featured-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
}
.featured-excerpt {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}


.author-chip {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-color);
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid var(--border-color);
}

.news-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  transition: var(--transition-smooth);
}
.news-card:hover {
  border-color: var(--primary-color);
  background-color: #fffaf0;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(217, 119, 6, 0.15);
}
.news-card:hover .detail-label {
  opacity: 1;
  transform: translateX(0);
}

.nc-img-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: #1c1917;
}
.nc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.news-card:hover .nc-img {
  transform: scale(1.05);
}
.nc-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 60%);
}

.nc-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
  text-decoration: none;
}
.nc-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
  transition: var(--transition-smooth);
}
.news-card:hover .nc-title {
  color: var(--primary-color);
}
.nc-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.nc-date,
.nc-author {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
}
.nc-date i,
.nc-author i {
  color: var(--primary-color);
}
.nc-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}

.nc-excerpt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.nc-read-btn {
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  border: 1.5px solid var(--primary-color);
  background: transparent;
  padding: 8px 18px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  align-self: flex-start;
  margin-top: auto;
}
.nc-read-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px -5px rgba(217, 119, 6, 0.3);
}

.detail-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-smooth);
}

.berita-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--secondary-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  padding: 5rem 2rem;
  text-align: center;
}
.empty-icon {
  font-size: 4rem;
  color: var(--primary-color);
  opacity: 0.2;
}

@media (max-width: 992px) {
  .featured-img-wrapper {
    min-height: 240px;
  }
  .featured-body {
    padding: 1.5rem !important;
  }
  .featured-title {
    font-size: 1.35rem;
    margin-bottom: 1rem;
  }
  .hero-v2-title {
    font-size: clamp(2.5rem, 8vw, 4rem);
  }
  .hero-v2-subtitle {
    margin-bottom: 2rem;
  }
  .filter-input {
    min-width: 100%;
  }
}
</style>
