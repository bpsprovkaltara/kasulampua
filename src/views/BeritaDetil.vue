<template>
  <Navbar />

  <div
    class="article-hero"
    :style="news.image ? `background-image: url('${urlImage(news.image)}')` : ''"
  >
    <div class="article-hero-overlay"></div>
    <div class="container article-hero-content">
      <nav class="article-breadcrumb mb-4" aria-label="breadcrumb">
        <router-link to="/" class="bc-link">Beranda</router-link>
        <span class="bc-sep"><i class="bi bi-chevron-right"></i></span>
        <router-link to="/berita" class="bc-link">Berita</router-link>
        <span class="bc-sep"><i class="bi bi-chevron-right"></i></span>
        <span class="bc-current">Artikel</span>
      </nav>

      <div class="article-hero-label mb-3">
        <span class="label-dot"></span>
        BERITA
      </div>
      <h1 class="article-hero-title">{{ news.title || 'Memuat...' }}</h1>

      <div class="article-hero-meta mt-4" v-if="news.created_at">
        <span class="meta-chip">
          <i class="bi bi-calendar3"></i>
          {{ formatLongDate(news.tanggal_diperbarui || news.created_at) }}
        </span>
        <span class="meta-chip" v-if="news.penulis">
          <i class="bi bi-person"></i>
          {{ news.penulis?.slice(0, 30) }}
        </span>
      </div>
    </div>
  </div>

  <section class="article-section">
    <div class="container">
      <div class="row g-5 justify-content-center">
        <div class="col-lg-8">
          <article class="article-body">
            <div v-if="loading" class="text-center py-5">
              <div class="article-spinner mx-auto mb-3"></div>
              <p class="text-muted small">Memuat artikel...</p>
            </div>

            <div v-else>
              <div class="article-image-credit" v-if="news.image">
                <img :src="urlImage(news.image)" :alt="news.title" class="article-cover-img" />
              </div>
              <div
                class="article-text"
                v-html="news.content || '<p>Konten tidak tersedia.</p>'"
              ></div>

              <div class="article-share-bar mt-5">
                <span class="share-label">Bagikan:</span>
                <div class="share-buttons">
                  <a
                    :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${pageUrl}`"
                    target="_blank"
                    class="share-btn twitter"
                    title="Bagikan ke Twitter"
                  >
                    <i class="bi bi-twitter-x"></i>
                  </a>
                  <a
                    :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`"
                    target="_blank"
                    class="share-btn facebook"
                    title="Bagikan ke Facebook"
                  >
                    <i class="bi bi-facebook"></i>
                  </a>
                  <a
                    :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + ' ' + pageUrl)}`"
                    target="_blank"
                    class="share-btn whatsapp"
                    title="Bagikan via WhatsApp"
                  >
                    <i class="bi bi-whatsapp"></i>
                  </a>
                  <button
                    class="share-btn copy"
                    @click="copyLink"
                    :title="copied ? 'Tersalin!' : 'Salin tautan'"
                  >
                    <i :class="copied ? 'bi bi-check2' : 'bi bi-link-45deg'"></i>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="col-lg-4">
          <div class="sidebar-sticky">
            <div class="sidebar-card mb-4">
              <h6 class="sidebar-title">Cari Berita</h6>
              <form @submit.prevent="handleSearch" class="search-form">
                <div class="search-wrapper">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    type="text"
                    class="search-input"
                    placeholder="Kata kunci..."
                    v-model="search"
                  />
                </div>
                <button type="submit" class="btn-search">Cari Berita</button>
              </form>
            </div>

            <div class="sidebar-card">
              <h6 class="sidebar-title">Berita Terkini</h6>
              <div class="recent-news-list">
                <router-link
                  v-for="(item, index) in beritaList.slice(0, 5)"
                  :key="index"
                  :to="`/berita/${item.slug}`"
                  class="recent-item"
                  :class="{ active: item.slug === currentSlug }"
                >
                  <div class="recent-thumb">
                    <img
                      :src="urlImage(item.image) || '/assets/images/default-news.jpg'"
                      :alt="item.title"
                    />
                  </div>
                  <div class="recent-info">
                    <p class="recent-title">
                      {{ item.title?.length > 70 ? item.title.slice(0, 70) + '…' : item.title }}
                    </p>
                    <span class="recent-date">
                      <i class="bi bi-calendar3 me-1"></i>
                      {{ formatLongDate(item.tanggal_diperbarui || item.created_at) }}
                    </span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import Footer from '../components/FooterSection.vue'
import Navbar from '../components/NavSection.vue'
import { API_ENDPOINTS } from '../config/api'
import { formatLongDate } from '../utils/dates'
import { DUMMY_BERITA } from '../utils/dummyBerita'

const beritaList = ref([])
const route = useRoute()
const router = useRouter()
const search = ref('')
const loading = ref(true)
const copied = ref(false)
const news = ref({ title: '', image: '', created_at: '', content: '' })

const currentSlug = computed(() => route.params.id)
const pageUrl = computed(() => window.location.href)

const fetchBerita = async () => {
  try {
    // const res = await fetch(API_ENDPOINTS.BERITA_TERKINI)
    // beritaList.value = (await res.json()) || []
    beritaList.value = DUMMY_BERITA
  } catch (e) {
    console.error('Gagal memuat daftar berita:', e)
  }
}

const fetchBeritaSlug = async () => {
  loading.value = true
  try {
    /*
    const res = await fetch(API_ENDPOINTS.BERITA_SLUG(route.params.id))
    const data = await res.json()
    news.value = data.error
      ? { title: 'Berita tidak ditemukan', image: '', created_at: '', content: '' }
      : data
    */
    
    const found = DUMMY_BERITA.find(b => b.slug === route.params.id)
    if (found) {
      news.value = found
      trackInsight(news.value.title)
    } else {
      news.value = { title: 'Berita tidak ditemukan', image: '', created_at: '', content: '' }
    }
  } catch (e) {
    console.error('Gagal memuat berita:', e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (search.value.trim()) router.push({ path: '/berita', query: { q: search.value } })
}

function urlImage(image) {
  if (!image) return false
  if (image.startsWith('http')) return image
  return API_ENDPOINTS.BASE_URL + '/uploads/berita/' + image
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('Failed to copy', e)
  }
}

const trackInsight = (label) => {
  window._paq?.push(['trackEvent', 'Berita', 'ViewBerita', 'Berita-' + label])
}

onMounted(() => {
  fetchBerita()
  fetchBeritaSlug()
})

watch(
  () => route.params.id,
  () => {
    fetchBeritaSlug()
  },
)
</script>

<style scoped>
.article-hero {
  min-height: 52vh;
  background: linear-gradient(135deg, #1c0f04 0%, #3b1f0a 100%);
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding-bottom: 0;
}
.article-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(28, 15, 4, 0.55) 0%, rgba(28, 15, 4, 0.92) 100%);
}
.article-hero-content {
  position: relative;
  z-index: 10;
  padding-top: 120px;
  padding-bottom: 3.5rem;
  max-width: 820px;
}

.article-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.bc-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: color 0.2s;
}
.bc-link:hover {
  color: #f59e0b;
}
.bc-sep {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
}
.bc-current {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.8rem;
  font-weight: 500;
}

.article-hero-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #f59e0b;
}
.label-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  animation: pulse-d 1.5s ease-in-out infinite;
}
@keyframes pulse-d {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.6;
  }
}

.article-hero-title {
  font-size: clamp(1.5rem, 4vw, 2.6rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.article-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 100px;
}
.meta-chip i {
  color: #f59e0b;
}

.article-section {
  background: var(--bg-color);
  padding: 3.5rem 0 5rem;
}
.article-body {
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.06);
}

.article-cover-img {
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  display: block;
}

.article-text {
  padding: 2.5rem 2.5rem 2rem;
  font-size: 1.0625rem;
  color: var(--text-primary);
  line-height: 1.9;
  text-align: justify;
}
.article-text :deep(p) {
  margin-bottom: 1.25rem;
}
.article-text :deep(h2),
.article-text :deep(h3) {
  font-weight: 800;
  color: var(--text-primary);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.article-text :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}
.article-text :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: var(--bg-accent-light);
  border-radius: 0 8px 8px 0;
  color: var(--text-secondary);
  font-style: italic;
}

.article-share-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 2.5rem;
}
.share-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.share-buttons {
  display: flex;
  gap: 8px;
}
.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
}
.share-btn.twitter {
  background: #1a1a1a;
  color: white;
}
.share-btn.facebook {
  background: #1877f2;
  color: white;
}
.share-btn.whatsapp {
  background: #25d366;
  color: white;
}
.share-btn.copy {
  background: var(--bg-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}
.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.btn-back {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  border: 1px solid var(--primary-color);
  padding: 10px 22px;
  border-radius: 100px;
  margin: 0 2.5rem 2.5rem;
  transition: all 0.25s ease;
}
.btn-back:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.article-spinner {
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

.sidebar-sticky {
  position: sticky;
  top: 90px;
}
.sidebar-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.sidebar-title {
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.search-wrapper {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s;
  background: var(--bg-color);
}
.search-input:focus {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
}
.btn-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px -3px rgba(217, 119, 6, 0.4);
  letter-spacing: 0.01em;
}
.btn-search:hover {
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -5px rgba(217, 119, 6, 0.45);
}

.recent-news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.recent-item {
  display: flex;
  gap: 12px;
  text-decoration: none;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.25s;
}
.recent-item:hover,
.recent-item.active {
  background: var(--bg-accent-light);
  border-color: var(--border-amber-20);
}
.recent-thumb {
  flex-shrink: 0;
  width: 68px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  background: #1c1917;
}
.recent-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.recent-info {
  flex: 1;
  min-width: 0;
}
.recent-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0 0 4px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  transition: color 0.2s;
}
.recent-item:hover .recent-title {
  color: var(--primary-color);
}
.recent-date {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 600;
  display: flex;
  align-items: center;
}
.recent-date i {
  color: var(--primary-color);
}

@media (max-width: 991px) {
  .article-hero-content {
    padding-top: 80px;
    padding-bottom: 2.5rem;
  }
  .article-text {
    padding: 1.5rem;
  }
  .article-share-bar {
    padding: 1.25rem 1.5rem;
  }
  .btn-back {
    margin: 0 1.5rem 1.5rem;
  }
  .sidebar-sticky {
    position: static;
  }
}
</style>
