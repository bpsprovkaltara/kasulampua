<template>
  <div class="admin-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-header border-bottom">
        <h4 class="m-0 text-amber fw-bold d-flex align-items-center gap-2" v-if="!isSidebarCollapsed">
          <i class="bi bi-shield-shaded text-amber"></i> <span>Admin</span>
        </h4>
        <h4 class="m-0 text-amber fw-bold mx-auto" v-else>
          <i class="bi bi-shield-shaded text-amber"></i>
        </h4>
        <button class="btn btn-link text-secondary toggle-btn d-md-none p-0" @click="toggleSidebar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div class="sidebar-menu">
        <router-link to="/admin/dashboard" class="menu-item" active-class="active">
          <i class="bi bi-grid-1x2-fill"></i>
          <span v-if="!isSidebarCollapsed">Dashboard</span>
        </router-link>
        
        <router-link to="/admin/users" class="menu-item" active-class="active">
          <i class="bi bi-people-fill"></i>
          <span v-if="!isSidebarCollapsed">Kelola Users</span>
        </router-link>
        
        <router-link to="/admin/berita" class="menu-item" active-class="active">
          <i class="bi bi-newspaper"></i>
          <span v-if="!isSidebarCollapsed">Kelola Berita</span>
        </router-link>

        <router-link to="/admin/insight" class="menu-item" active-class="active">
          <i class="bi bi-lightbulb-fill"></i>
          <span v-if="!isSidebarCollapsed">Kelola Insight</span>
        </router-link>
        
        <router-link to="/admin/dataset" class="menu-item" active-class="active">
          <i class="bi bi-database-fill"></i>
          <span v-if="!isSidebarCollapsed">Kelola Dataset</span>
        </router-link>
      </div>
    </aside>

    <div class="sidebar-overlay d-md-none" v-if="isSidebarCollapsed" @click="toggleSidebar"></div>

   
    <main class="main-content" :class="{ 'expanded': isSidebarCollapsed }">
      <nav class="top-navbar shadow-sm">
        <div class="d-flex align-items-center">
          <button class="btn btn-light toggle-btn d-none d-md-flex align-items-center justify-content-center border-0 me-3" style="width: 40px; height: 40px;" @click="toggleSidebar">
            <i class="bi bi-list fs-5"></i>
          </button>
          <button class="btn btn-light toggle-btn d-md-none d-flex align-items-center justify-content-center border-0 me-3" style="width: 40px; height: 40px;" @click="toggleSidebar">
            <i class="bi bi-list fs-5"></i>
          </button>
          <h5 class="mb-0 fw-semibold text-dark">{{ currentRouteName }}</h5>
        </div>
        
        <div class="d-flex align-items-center gap-4">
          <div class="user-profile dropdown">
            <div class="d-flex align-items-center gap-3 cursor-pointer" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="text-end d-none d-sm-block">
                <p class="mb-0 fw-bold fs-6 text-dark lh-1">{{ currentUser?.us_name || 'Administrator' }}</p>
                <small class="text-muted" style="font-size: 0.8rem;">{{ currentUser?.us_email || 'admin@portal.com' }}</small>
              </div>
              <div class="avatar-circle shadow-sm">
                {{ initials }}
              </div>
            </div>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 rounded-3">
              <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="#" @click.prevent="handleLogout"><i class="bi bi-box-arrow-right text-danger"></i> Logout</a></li>
            </ul>
          </div>
          <div class="vr d-none d-md-block opacity-25" style="height: 30px;"></div>
          <button class="btn bg-white text-danger d-flex align-items-center justify-content-center p-2 rounded-circle shadow-sm logout-nav-btn" @click="handleLogout" title="Logout" style="width: 40px; height: 40px; transition: all 0.3s ease;">
            <i class="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </nav>

      <!-- Content Container -->
      <div class="content-container p-4">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAuthUser, removeAuthToken, removeAuthUser } from '@/utils/auth.js';

const router = useRouter();
const route = useRoute();
const currentUser = ref(getAuthUser());

const isSidebarCollapsed = ref(window.innerWidth < 768);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const currentRouteName = computed(() => {
  return route.meta.title || 'Admin Panel';
});

const initials = computed(() => {
  const name = currentUser.value?.us_name || 'Admin';
  return name.substring(0, 2).toUpperCase();
});

const handleLogout = () => {
  removeAuthToken();
  removeAuthUser();
  router.push('/admin/login');
};
</script>

<style scoped>
.admin-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f4f6f9;
}

.cursor-pointer {
  cursor: pointer;
}

.sidebar {
  width: 260px;
  background: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  box-shadow: 4px 0 15px rgba(0,0,0,0.05);
}

.sidebar.collapsed {
  width: 80px;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.collapsed {
    transform: translateX(0);
    width: 260px;
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1040;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  height: 72px;
}

.sidebar-menu {
  flex-grow: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.sidebar-menu::-webkit-scrollbar {
  display: none;
}
.sidebar-menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  margin: 0.3rem 1rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 600;
  gap: 1rem;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0.8rem 0;
  margin: 0.3rem 0.5rem;
}

.menu-item i {
  font-size: 1.15rem;
  transition: color 0.2s ease;
}

.menu-item:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.menu-item.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.logout-nav-btn:hover {
  background-color: var(--bs-danger) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3) !important;
}

.main-content {
  flex-grow: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
}

.main-content.expanded {
  margin-left: 80px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
}

.top-navbar {
  height: 72px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 1030;
}

@media (max-width: 768px) {
  .top-navbar {
    padding: 0 1rem;
  }
}

.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.content-container {
  flex-grow: 1;
  background-color: #f1f5f9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
