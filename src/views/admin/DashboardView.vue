<template>
  <div class="dashboard-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
      <div>
        <h3 class="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
          Dashboard Overview
        </h3>
        <p class="text-muted mb-0 small text-uppercase tracking-wider">Welcome to your admin control center</p>
      </div>
      <div>
        <button class="btn btn-light bg-white border shadow-sm d-flex align-items-center gap-2 text-primary fw-medium" @click="fetchAnalytics" :disabled="isLoading">
          <i class="bi bi-arrow-clockwise" :class="{'spin': isLoading}"></i>
          Sync Data
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-3 col-sm-6" v-for="stat in quickStats" :key="stat.title">
        <div class="card stat-card border-0 shadow-sm h-100 position-relative overflow-hidden bg-white">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="icon-box shadow-sm" :class="stat.colorClass">
                <i :class="stat.icon"></i>
              </div>
              <span class="badge rounded-pill fw-medium" :class="stat.trend > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'" v-if="stat.trend">
                <i :class="stat.trend > 0 ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i> {{ Math.abs(stat.trend) }}%
              </span>
            </div>
            <h6 class="text-muted fw-semibold mb-1 small">{{ stat.title }}</h6>
            <h3 class="fw-bold mb-0 text-dark">{{ stat.value }}</h3>
          </div>
          <div class="card-bg-icon">
             <i :class="stat.icon"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-8 mb-4">
        <div class="card welcome-card border-0 shadow-sm overflow-hidden text-white h-100">
          <div class="card-body p-sm-5 p-4 position-relative z-1 d-flex flex-column justify-content-center h-100">
            <span class="badge bg-white text-amber rounded-pill mb-3" style="width: max-content;">Admin Portal v2.0</span>
            <h2 class="fw-bold mb-3 display-6">Manage Your Portal Seamlessly</h2>
            <p class="mb-4 opacity-75 fs-5" style="max-width: 600px; line-height: 1.6;">
              Everything from dataset configurations, content management, and user permissions is right at your fingertips. Get started by exploring the sidebar modules!
            </p>
            <div class="d-flex gap-3 mt-auto">
              <router-link to="/admin/berita" class="btn btn-light fw-bold text-amber px-4 py-2 shadow-sm rounded-pill">
                Kelola Konten <i class="bi bi-arrow-right-short fs-5 ms-1 align-middle"></i>
              </router-link>
              <router-link to="/admin/settings" class="btn btn-outline-light fw-bold px-4 py-2 rounded-pill">
                <i class="bi bi-gear-fill me-2 align-middle"></i> Settings
              </router-link>
            </div>
          </div>
          <div class="blob blob-1"></div>
          <div class="blob blob-2"></div>
        </div>
      </div>

      <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-sm h-100 rounded-4 overflow-hidden bg-white">
          <div class="card-header bg-transparent border-0 pt-4 pb-0 px-4">
            <h6 class="fw-bold mb-0 text-dark">Recent Activity</h6>
          </div>
          <div class="card-body p-4">
            <div class="timeline">
              <div class="timeline-item pb-3 mb-3 border-bottom border-light">
                <div class="d-flex gap-3">
                  <div class="timeline-icon bg-primary-subtle text-primary rounded-circle"><i class="bi bi-check-circle-fill"></i></div>
                  <div>
                    <h6 class="mb-1 text-dark text-sm fw-semibold">Dataset Updated</h6>
                    <p class="text-muted small mb-0">Demografi Kaltara 2026 was synced.</p>
                    <small class="text-secondary mt-1 d-block"><i class="bi bi-clock me-1"></i>2 hours ago</small>
                  </div>
                </div>
              </div>
              <div class="timeline-item pb-3 mb-3 border-bottom border-light">
                <div class="d-flex gap-3">
                  <div class="timeline-icon bg-success-subtle text-success rounded-circle"><i class="bi bi-person-fill-add"></i></div>
                  <div>
                    <h6 class="mb-1 text-dark text-sm fw-semibold">New User Joined</h6>
                    <p class="text-muted small mb-0">Admin editor_x registered successfully.</p>
                    <small class="text-secondary mt-1 d-block"><i class="bi bi-clock me-1"></i>5 hours ago</small>
                  </div>
                </div>
              </div>
               <div class="timeline-item">
                <div class="d-flex gap-3">
                  <div class="timeline-icon bg-warning-subtle text-warning rounded-circle"><i class="bi bi-newspaper"></i></div>
                  <div>
                    <h6 class="mb-1 text-dark text-sm fw-semibold">News Published</h6>
                    <p class="text-muted small mb-0">Rilis PDRB Kaltara Tw I dipublikasikan.</p>
                    <small class="text-secondary mt-1 d-block"><i class="bi bi-clock me-1"></i>Yesterday</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAuth } from '@/utils/auth.js';
import { API_ENDPOINTS } from '@/config/api.js';

const isLoading = ref(false);

const quickStats = ref([
  { title: 'Total Visitors (API)', value: '0', icon: 'bi bi-people-fill', colorClass: 'bg-primary-subtle text-primary', trend: 15 },
  { title: 'Registered Users', value: '45', icon: 'bi bi-person-check-fill', colorClass: 'bg-success-subtle text-success', trend: 5 },
  { title: 'Published Berita', value: '328', icon: 'bi bi-file-earmark-text-fill', colorClass: 'bg-warning-subtle text-warning' },
  { title: 'Datasets Managed', value: '156', icon: 'bi bi-database-fill', colorClass: 'bg-info-subtle text-info', trend: 8 }
]);

const fetchAnalytics = async () => {
  isLoading.value = true;
  try {
    const res = await fetchAuth(API_ENDPOINTS.ANALYTICS_VISITORS);
    if (res.ok) {
       const data = await res.json();
       const totalVisitors = data.total || data.count || data.visitors || (Array.isArray(data) ? data.length : "Err");
       quickStats.value[0].value = totalVisitors;
    } else {
       console.warn('API error:', res.status);
    }
  } catch(e) {
    console.warn("Analytics fetch error:", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAnalytics();
});
</script>

<style scoped>
.dashboard-wrapper {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 1.25rem;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.06) !important;
}

.card-bg-icon {
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 8rem;
  opacity: 0.03;
  color: #000;
  transform: rotate(-15deg);
  transition: transform 0.3s ease;
}

.stat-card:hover .card-bg-icon {
  transform: rotate(0deg) scale(1.1);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.welcome-card {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #d97706 100%);
  border-radius: 1.5rem;
  position: relative;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.5;
  z-index: 0;
}

.blob-1 {
  width: 350px;
  height: 350px;
  background: rgba(255, 255, 255, 0.25);
  top: -100px;
  right: -100px;
}

.blob-2 {
  width: 250px;
  height: 250px;
  background: rgba(251, 146, 60, 0.4);
  bottom: -50px;
  right: 150px;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
</style>
