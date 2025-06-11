import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BeritaView from '@/views/BeritaView.vue'
import DetilBerita from '@/views/BeritaDetil.vue'
import RegionalInsight from '@/views/RegionalInsight.vue'
import About from '@/views/AboutView.vue'
import RegionalInsightDetil from '@/views/RegionalInsightDetil.vue'
import Dataset from '@/views/DatasetViewRoute.vue'
import DatasetDetail from '@/views/DatasetDetail.vue'
import ResourceDetail from '@/views/ResourceDetail.vue'
import VisualisasiData from '@/views/VisualisasiData.vue'

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
      path: '/visualisasi_data',
      name: 'visualisasi_data',
      component: VisualisasiData,
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
      path: '/dataset/:id',
      name: 'dataset-detail',
      component: DatasetDetail
    },
     {
      path: '/resource/:id',
      name: 'resource-detail',
      component: ResourceDetail
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
