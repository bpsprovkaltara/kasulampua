import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BeritaView from '@/views/BeritaView.vue'
import DetilBerita from '@/views/BeritaDetil.vue'
import RegionalInsight from '@/views/RegionalInsight.vue'
import About from '@/views/AboutView.vue'
import RegionalInsightDetil from '@/views/RegionalInsightDetil.vue'
import Dataset from '@/views/DatasetViewRoute.vue'
import DatasetDetail from '@/views/DatasetDetail.vue'
import PublikasiDetailView from '@/views/PublikasiDetailView.vue'
import PublicationView from '@/views/PublicationView.vue'
import ResourceDetail from '@/views/ResourceDetail.vue'
import VisualisasiData from '@/views/VisualisasiData.vue'
import NotFound from '@/views/NotFound.vue'
import { isAuthenticated } from '@/utils/auth.js'

import AdminLayout from '@/views/admin/AdminLayout.vue'
import LoginView from '@/views/admin/LoginView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import ManageUsers from '@/views/admin/ManageUsers.vue'
import ManageBerita from '@/views/admin/ManageBerita.vue'
import ManageInsight from '@/views/admin/ManageInsight.vue'
import ManageDataset from '@/views/admin/ManageDataset.vue'

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
      meta: { title: 'Subjek' }
    },
    {
      path: '/dataset/:id',
      name: 'dataset-detail',
      component: DatasetDetail,
      meta: { title: 'Detail Dataset' }
    },
    {
      path: '/publication',
      name: 'publication',
      component: PublicationView,
      meta: { title: 'Publikasi' }
    },
    {
      path: '/publikasi/:id',
      name: 'publikasi-detail',
      component: PublikasiDetailView,
      meta: { title: 'Detail Publikasi' }
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
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: LoginView,
      meta: { title: 'Admin Login', guestOnly: true }
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard' }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: ManageUsers,
          meta: { title: 'Kelola Users' }
        },
        {
          path: 'berita',
          name: 'admin-berita',
          component: ManageBerita,
          meta: { title: 'Kelola Berita' }
        },
        {
          path: 'insight',
          name: 'admin-insight',
          component: ManageInsight,
          meta: { title: 'Kelola Insight' }
        },
        {
          path: 'dataset',
          name: 'admin-dataset',
          component: ManageDataset,
          meta: { title: 'Kelola Dataset' }
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.path === from.path) {
      return
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuth) {
      next({ name: 'admin-login' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    if (isAuth) {
      next({ name: 'admin-dashboard' });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  const defaultTitle = 'Konsultasi Regional PDRB Kasulampua'
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }
})

export default router
