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
            REGIONAL INSIGHT
          </div>

          <h1 class="hero-v2-title">
            Regional <br />
            <em>Insight</em>
          </h1>

          <p class="hero-v2-subtitle">
            Eksplorasi dinamika sosial ekonomi <strong>Kalimantan</strong>,
            <strong>Sulawesi</strong>, <strong>Maluku</strong>, dan <strong>Papua</strong> melalui
            visualisasi data interaktif.
          </p>
        </div>

        <div class="col-lg-4 d-none d-lg-flex justify-content-end">
          <div class="hero-stats-card">
            <div class="stat-item">
              <span class="stat-num">{{ insights.length }}</span>
              <span class="stat-label">Total Insight</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">4</span>
              <span class="stat-label">Regional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="insight-content-wrapper py-5">
    <div class="container">
      <RegionalFilter @filter-changed="applyFilter" class="mb-5" />
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto mb-3"></div>
        <p class="text-muted small">Memuat insight...</p>
      </div>
      <div v-else-if="!insights.length" class="empty-state text-center py-5">
        <i class="bi bi-bar-chart-line-fill empty-icon mb-3 d-block"></i>
        <h5 class="fw-bold text-stone mb-2">Belum ada insight</h5>
        <p class="text-muted">Coba ubah filter pencarian kamu.</p>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="(item, i) in paginatedInsights" :key="item.id || i">
          <RegionalCard
            :id="item.id"
            :image="item.image"
            :region="item.region_name"
            :badgeColor="item.badge"
            :title="item.title"
            :date="item.created_at"
            :author="item.author"
            :location="item.region_name"
            :slug="item.slug"
            :topic="item.topic"
          />
        </div>

        <PaginationControl
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="(p) => { currentPage = p }"
        />
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, computed, watch } from 'vue'
import RegionalFilter from '../components/RegionalFilter.vue'
import RegionalCard from '../components/RegionalCard.vue'
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import PaginationControl from '../components/PaginationControl.vue'
import { DUMMY_INSIGHTS } from '../utils/dummyInsights'

const insights = ref([])
const loading = ref(true)
const route = useRoute()

const currentPage = ref(1)
const itemsPerPage = 9

const totalPages = computed(() => Math.ceil(insights.value.length / itemsPerPage))
const paginatedInsights = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return insights.value.slice(start, start + itemsPerPage)
})

watch(route, () => {
  currentPage.value = 1
})

const fetchInsight = async (filter = {}) => {
  loading.value = true
  try {
    /* 
    const query = new URLSearchParams(filter).toString()
    const res = await fetch(`${API_ENDPOINTS.INSIGHT}?${query}`)
    const data = await res.json()
    insights.value = data || []
    */

    // DUMMY DATA WITH FRONTEND FILTERING
    let filtered = [...DUMMY_INSIGHTS]

    if (filter.keyword) {
      const k = filter.keyword.toLowerCase()
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(k) || 
        i.description?.toLowerCase().includes(k)
      )
    }

    if (filter.region) {
      filtered = filtered.filter(i => i.region === filter.region)
    }

    if (filter.topik) {
      filtered = filtered.filter(i => i.topic === filter.topik)
    }

    insights.value = filtered
  } catch (err) {
    console.error('Gagal memuat insight:', err)
  } finally {
    loading.value = false
  }
}

const applyFilter = (filter) => {
  currentPage.value = 1
  fetchInsight(filter)
}

onMounted(() => {
  const initialFilter = {}
  if (route.query.region) initialFilter.region = route.query.region
  fetchInsight(initialFilter)
})
</script>

<style scoped>
.hero-stats-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--hero-white-30);
  backdrop-filter: blur(12px);
  border-radius: var(--border-radius);
  padding: 1.5rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.stat-item {
  text-align: center;
}
.stat-num {
  display: block;
  font-size: 2.75rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 4px;
  color: white;
}
.stat-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--hero-white-90);
  text-transform: uppercase;
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--hero-white-30);
}

.insight-content-wrapper {
  background: var(--bg-color);
  min-height: 60vh;
}
.loading-spinner {
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
  color: var(--text-secondary);
}
.empty-icon {
  font-size: 4rem;
  opacity: 0.2;
  color: var(--primary-color);
}
.text-stone {
  color: var(--text-primary) !important;
}

@media (max-width: 992px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-stats-card {
    padding: 1.25rem 2rem;
    gap: 1.5rem;
  }
  .stat-num {
    font-size: 2rem;
  }
}
</style>
