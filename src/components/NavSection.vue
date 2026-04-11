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
  return '/assets/images/logo-kasulampua.png'
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
  Berita: 'bi bi-newspaper',
  'Regional Insight': 'bi bi-lightbulb-fill',
  Data: 'bi bi-database-fill',
  Publikasi: 'bi bi-journal-text',
  'Visualisasi Data': 'bi bi-bar-chart-line-fill',
  About: 'bi bi-info-circle-fill',
}

const getIcon = (text) => linkIcons[text] || 'bi bi-link-45deg'

/** Nav underline: aktif di path tepat dan halaman turunan. Data vs Publikasi dibedakan lewat query `tab`. */
function isNavSectionActive(link) {
  const path = route.path
  const href = link.href
  if (!href.startsWith('/')) return false

  if (link.text === 'Publikasi') {
    if (path === '/publication') return true
    if (path.startsWith('/publikasi/')) return true
    return false
  }

  if (link.text === 'Data') {
    if (path === '/dataset') return true
    if (path.startsWith('/dataset/')) return true
    if (path.startsWith('/resource/')) return true
    return false
  }

  if (href === '/') {
    return path === '/' || path === ''
  }
  if (path === href) return true
  if (path.startsWith(`${href}/`)) return true
  return false
}
</script>

<template>
  <nav
    :class="['navbar navbar-expand-lg fixed-top transition-all', customNavClass, scrolledClass, { 'mobile-menu-active': isMobileMenuOpen }]"
    style="height: 72px"
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
                v-slot="{ href, navigate }"
                :to="link.href"
                custom
              >
                <a
                  :href="href"
                  class="nav-link fw-semibold px-0 mx-2 position-relative h-100 d-flex align-items-center"
                  :class="{ 'router-link-active': isNavSectionActive(link) }"
                  @click="navigate"
                >
                  <span class="nav-link-text">{{ link.text }}</span>
                </a>
              </router-link>
              <a
                v-else
                class="nav-link fw-semibold px-0 mx-2"
                :class="{
                  'external-nav-link': link.text === 'Pusat Informasi',
                  'no-nav-underline': link.text === 'Pusat Informasi',
                }"
                :href="link.href"
                target="_blank"
              >
                <template v-if="link.text === 'Pusat Informasi'">
                  <span class="external-link-badge">
                    <span class="external-link-badge-text">{{ link.text }}</span>
                    <i class="bi bi-box-arrow-up-right ext-link-icon" aria-hidden="true"></i>
                  </span>
                </template>
                <template v-else>{{ link.text }}</template>
              </a>
            </li>
          </ul>
        </div>

        <button
          class="mobile-toggler d-flex d-lg-none align-items-center justify-content-center"
          :class="{ 'active': isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Buka atau tutup menu navigasi"
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
                v-slot="{ href, navigate }"
                :to="link.href"
                custom
              >
                <a
                  :href="href"
                  class="mobile-nav-link"
                  :class="{ 'router-link-active': isNavSectionActive(link) }"
                  @click="
                    (e) => {
                      navigate(e)
                      closeMobileMenu()
                    }
                  "
                >
                  <div class="icon-wrapper">
                    <i :class="getIcon(link.text)"></i>
                  </div>
                  <span>{{ link.text }}</span>
                  <i class="bi bi-chevron-right ms-auto opacity-50"></i>
                </a>
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
  display: inline-block;
  align-items: center;
  width: auto;
  transition: color 0.3s ease;
  font-size: 1rem;
}

.nav-link-text {
  position: relative;
  display: inline-block;
  line-height: 1.2;
}

.nav-link.router-link-active .nav-link-text {
  color: var(--primary-color) !important;
}

.nav-link-text::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  pointer-events: none;
}

.nav-link:hover .nav-link-text::after,
.nav-link.router-link-active .nav-link-text::after {
  width: 100%;
  opacity: 1;
}

.external-nav-link {
  color: inherit !important;
}

.no-nav-underline::after {
  display: none !important;
}

.external-link-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(217, 119, 6, 0.4);
  background: rgba(245, 158, 11, 0.12);
  color: #92400e;
  font-size: 0.82rem;
  line-height: 1;
  transition: all 0.25s ease;
}

.external-link-badge-text {
  font-weight: 800;
}

.ext-link-icon {
  font-size: 0.72rem;
  opacity: 0.6;
  transform: translateY(-0.5px);
  transition: opacity 0.2s ease;
}

.external-nav-link:hover .external-link-badge {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(217, 119, 6, 0.6);
  box-shadow: 0 8px 16px -10px rgba(217, 119, 6, 0.55);
}

.external-nav-link:hover .ext-link-icon {
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
  padding-top: 108px;
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
  height: 58px;
  width: auto;
  max-width: 280px;
  object-fit: contain;
}

@media (max-width: 991px) {
  .navbar {
    height: 62px !important;
  }
  .nav-logo {
    height: 42px;
    max-width: 180px;
  }
}

@media (max-width: 480px) {
  .nav-logo {
    height: 36px;
    max-width: 150px;
  }
  .container-fluid {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>
