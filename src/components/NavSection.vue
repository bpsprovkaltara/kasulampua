<script setup>
import { useNavigation } from '../composables/useNavigation'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const props = defineProps({
  background_class: String,
})

const { isScrolledNav, navigationLinks } = useNavigation()

const customNavClass = computed(() => {
  if (props.background_class) {
    return props.background_class
  }
  return ''
})

const isHomePage = computed(() => route.path === '/')

const shouldShowScrolled = computed(() => {
  return isScrolledNav.value || !isHomePage.value
})

const scrolledClass = computed(() => {
  return shouldShowScrolled.value ? 'navbar-scrolled' : 'navbar-transparent'
})

const navLogo = computed(() => {
  return '/assets/images/logo-nav.png'
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const linkIcons = {
  'Berita': 'bi bi-newspaper',
  'Regional Insight': 'bi bi-lightbulb-fill',
  'Data': 'bi bi-database-fill',
  'Visualisasi Data': 'bi bi-bar-chart-line-fill',
  'About': 'bi bi-info-circle-fill'
}

const getIcon = (text) => linkIcons[text] || 'bi bi-link-45deg'
</script>

<template>
  <nav
    :class="['navbar navbar-expand-lg fixed-top transition-all', customNavClass, scrolledClass, { 'mobile-menu-active': isMobileMenuOpen }]"
    style="height: 64px"
  >
    <div class="container-fluid px-4 px-lg-5">
      <div class="container mx-auto d-flex align-items-center justify-content-between p-0">
        <router-link class="navbar-brand d-flex align-items-center p-0" to="/" @click="closeMobileMenu">
          <img :src="navLogo" alt="Logo" class="nav-logo transition-all" />
        </router-link>

        <div class="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item px-2" v-for="link in navigationLinks" :key="link.text">
              <router-link
                v-if="link.href.startsWith('/')"
                :to="link.href"
                class="nav-link fw-semibold px-0 mx-2 position-relative h-100 d-flex align-items-center"
              >
                {{ link.text }}
              </router-link>
              <a v-else class="nav-link fw-semibold px-0 mx-2" :href="link.href" target="_blank">
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>

        <button
          class="mobile-toggler d-flex d-lg-none align-items-center justify-content-center"
          :class="{ 'active': isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Toggle navigation"
        >
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="mobile-overlay d-lg-none">
        <div class="mobile-menu-content">
          <ul class="mobile-nav-list">
            <li v-for="(link, index) in navigationLinks" :key="link.text" 
                :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
                class="mobile-nav-item">
              <router-link
                v-if="link.href.startsWith('/')"
                :to="link.href"
                class="mobile-nav-link"
                @click="closeMobileMenu"
              >
                <div class="icon-wrapper">
                  <i :class="getIcon(link.text)"></i>
                </div>
                <span>{{ link.text }}</span>
                <i class="bi bi-chevron-right ms-auto opacity-50"></i>
              </router-link>
              <a v-else :href="link.href" class="mobile-nav-link" target="_blank" @click="closeMobileMenu">
                <div class="icon-wrapper">
                  <i :class="getIcon(link.text)"></i>
                </div>
                <span>{{ link.text }}</span>
                <i class="bi bi-box-arrow-up-right ms-auto opacity-50"></i>
              </a>
            </li>
          </ul>
          
          <div class="mobile-menu-footer mt-auto p-4 text-center">
            <p class="small text-muted mb-0">© 2026 Portal Kasulampua</p>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.navbar {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: 2000;
}

.navbar-transparent {
  background: transparent !important;
  box-shadow: none !important;
}

.navbar-transparent .nav-link {
  color: var(--text-primary) !important;
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.08) !important;
  border-bottom: 1px solid rgba(217, 119, 6, 0.1);
}

.navbar-scrolled .nav-link {
  color: var(--text-secondary) !important;
}

.nav-link {
  position: relative;
  transition: color 0.3s ease;
  font-size: 0.9375rem;
}

.nav-link.router-link-active {
  color: var(--primary-color) !important;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: calc(100% - 12px);
  opacity: 1;
}

.mobile-toggler {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 10px;
  z-index: 2100;
  outline: none !important;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.mobile-toggler:hover {
  border-color: var(--primary-color);
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2.5px;
  background-color: var(--text-primary);
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-scrolled .hamburger span {
  background-color: var(--primary-color);
}

.mobile-toggler.active .hamburger span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
  background-color: var(--primary-color);
}
.mobile-toggler.active .hamburger span:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}
.mobile-toggler.active .hamburger span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
  background-color: var(--primary-color);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  z-index: 2050;
  display: flex;
  flex-direction: column;
}

.mobile-menu-content {
  padding-top: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-nav-list {
  list-style: none;
  padding: 0 1.5rem;
  margin: 0;
}

.mobile-nav-item {
  margin-bottom: 0.75rem;
  opacity: 0;
  animation: slideInRight 0.5s ease forwards;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: var(--text-primary);
  background: white;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 1.125rem;
  transition: all 0.3s ease;
}

.mobile-nav-link .icon-wrapper {
  width: 40px;
  height: 40px;
  background: var(--bg-accent);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: var(--primary-color);
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.mobile-nav-link:active,
.mobile-nav-link.router-link-active {
  background: var(--bg-accent);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: scale(0.98);
}

.mobile-nav-link.router-link-active .icon-wrapper {
  background: var(--primary-color);
  color: white;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.4s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-logo {
  height: 54px;
  width: auto;
  max-width: 280px;
  object-fit: contain;
}

@media (max-width: 991px) {
  .nav-logo {
    height: 44px;
    max-width: 220px;
  }
}
</style>
