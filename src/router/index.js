import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BeritaView from '@/views/BeritaView.vue'
import DetilBerita from '@/views/DetilBerita.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/berita',
      name: 'berita',
      component: BeritaView,
    },
    {
      path: '/berita/:id',
      name: 'berita-detail',
      component: DetilBerita,
    },
  ],
})

export default router
