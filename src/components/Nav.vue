<script setup>
import { useNavigation } from '../composables/useNavigation'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const { background_class } = defineProps({
  background_class: String,
})

const { isScrolledNav, navigation, navigationLinks } = useNavigation()

const customNavClass = computed(() => {

  if(background_class){
    return background_class
  }else{
     switch (route.name) {
      case 'about':
        return 'bg-default'
      case 'berita':
        return 'bg-default'
      default:
        return ''
    }
  }
})

const scrolledClass = computed(() => {
  return isScrolledNav.value ? `scrolled-${route.name}` : ''
})



</script>

<template>
  <nav :class="['navbar navbar-expand-lg navbar-light', customNavClass,scrolledClass]">
    <div class="container">
      <a class="navbar-brand img-nav  mb-2 mt-3" href="#"><img :src="navigation.logo" alt="Logo"
          style="height: 90px;" /></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item text-center" v-for="link in navigationLinks" :key="link.text">
            <a class="nav-link" style="color:#000" :href="link.href">{{ link.text }}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
