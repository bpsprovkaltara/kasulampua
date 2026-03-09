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
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Beranda' }
    },
    {
      path: '/berita',
      name: 'berita',
      component: BeritaView,
      meta: { title: 'Berita' }
    },
    {
      path: '/berita/:id',
      name: 'berita-detail',
      component: DetilBerita,
      meta: { title: 'Detail Berita' }
    },
    {
      path: '/regional_insight',
      name: 'regional_insight',
      component: RegionalInsight,
      meta: { title: 'Regional Insight' }
    },
    {
      path: '/visualisasi_data',
      name: 'visualisasi_data',
      component: VisualisasiData,
      meta: { title: 'Visualisasi Data' }
    },
    {
      path: '/regional_insight/:id',
      name: 'regional_insight-detil',
      component: RegionalInsightDetil,
      meta: { title: 'Detail Regional Insight' }
    },
    {
      path: '/dataset',
      name: 'dataset',
      component: Dataset,
      meta: { title: 'Dataset' }
    },
    {
      path: '/dataset/:id',
      name: 'dataset-detail',
      component: DatasetDetail,
      meta: { title: 'Detail Dataset' }
    },
     {
      path: '/resource/:id',
      name: 'resource-detail',
      component: ResourceDetail,
      meta: { title: 'Detail Resource' }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: { title: 'Tentang' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { title: '404 - Halaman Tidak Ditemukan' }
    }

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.afterEach((to) => {
  const defaultTitle = 'Konsultasi Regional PDRB Kasulampua'
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }
})

export default router
