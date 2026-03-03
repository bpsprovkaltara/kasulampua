<script setup>
import { useNavigation } from '../composables/useNavigation'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  background_class: String,
})

const { isScrolledNav, navigation, navigationLinks } = useNavigation()

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
</script>

<template>
  <nav
    :class="['navbar navbar-expand-lg fixed-top transition-all', customNavClass, scrolledClass]"
    style="height: 64px"
  >
    <div class="container-fluid px-4 px-lg-5">
      <div class="container mx-auto d-flex align-items-center justify-content-between p-0">
        <router-link class="navbar-brand d-flex align-items-center p-0" to="/">
          <img :src="navLogo" alt="Logo" class="nav-logo transition-all" />
        </router-link>

        <button
          class="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
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
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.navbar-transparent {
  background: transparent !important;
  box-shadow: none !important;
}

.navbar-transparent .nav-link {
  color: var(--text-primary) !important;
}

.navbar-transparent .nav-link:hover {
  color: var(--primary-color) !important;
}

.navbar-scrolled {
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.navbar-scrolled .nav-link {
  color: var(--text-secondary) !important;
}

.navbar-scrolled .nav-link:hover,
.navbar-scrolled .nav-link.router-link-active {
  color: var(--primary-color) !important;
}

.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 12px);
  height: 3px;
  background-color: var(--primary-color, #d97706);
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 991px) {
  .nav-link.router-link-active::after {
    display: none;
  }
}

.nav-logo {
  height: 48px;
  width: 256px;
  object-fit: contain;
  transition: var(--transition-smooth);
}

.navbar-scrolled .nav-logo {
  height: 48px;
  width: 256px;
}

@media (max-width: 991px) {
  .navbar-collapse {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-top: 1rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
  }

  .navbar-collapse .nav-link {
    color: var(--text-primary) !important;
    padding: 0.75rem 1rem !important;
    border-radius: 8px;
  }

  .navbar-collapse .nav-link:hover {
    background-color: var(--secondary-color);
  }
}
</style>
