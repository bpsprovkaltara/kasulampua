import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BeritaView from '@/views/BeritaView.vue'
import DetilBerita from '@/views/BeritaDetil.vue'
import RegionalInsight from '@/views/RegionalInsight.vue'
import About from '@/views/AboutView.vue'
import RegionalInsightDetil from '@/views/RegionalInsightDetil.vue'
import Dataset from '@/views/DatasetViewRoute.vue'

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
    {
      path: '/regional_insight',
      name: 'regional_insight',
      component: RegionalInsight,
    },
    {
      path: '/regional_insight/:id',
      name: 'regional_insight-detil',
      component: RegionalInsightDetil,
    },
    {
      path: '/dataset',
      name: 'dataset',
      component: Dataset,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
  ],
})

export default router
