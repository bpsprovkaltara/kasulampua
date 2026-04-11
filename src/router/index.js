import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isAuthenticated } from '@/utils/auth.js'

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
      component: () => import('@/views/BeritaView.vue'),
      meta: { title: 'Berita' }
    },
    {
      path: '/berita/:id',
      name: 'berita-detail',
      component: () => import('@/views/BeritaDetil.vue'),
      meta: { title: 'Detail Berita' }
    },
    {
      path: '/regional_insight',
      name: 'regional_insight',
      component: () => import('@/views/RegionalInsight.vue'),
      meta: { title: 'Regional Insight' }
    },
    {
      path: '/visualisasi_data',
      name: 'visualisasi_data',
      component: () => import('@/views/VisualisasiData.vue'),
      meta: { title: 'Visualisasi Data' }
    },
    {
      path: '/regional_insight/:id',
      name: 'regional_insight-detil',
      component: () => import('@/views/RegionalInsightDetil.vue'),
      meta: { title: 'Detail Regional Insight' }
    },
    {
      path: '/dataset',
      name: 'dataset',
      component: () => import('@/views/DatasetViewRoute.vue'),
      meta: { title: 'Subjek' }
    },
    {
      path: '/dataset/:id',
      name: 'dataset-detail',
      component: () => import('@/views/DatasetDetail.vue'),
      meta: { title: 'Detail Dataset' }
    },
    {
      path: '/publication',
      name: 'publication',
      component: () => import('@/views/PublicationView.vue'),
      meta: { title: 'Publikasi' }
    },
    {
      path: '/publikasi/:id',
      name: 'publikasi-detail',
      component: () => import('@/views/PublikasiDetailView.vue'),
      meta: { title: 'Detail Publikasi' }
    },
    {
      path: '/resource/:id',
      name: 'resource-detail',
      component: () => import('@/views/ResourceDetail.vue'),
      meta: { title: 'Detail Resource' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Tentang' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '404 - Halaman Tidak Ditemukan' }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: { title: 'Admin Login', guestOnly: true }
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/ManageUsers.vue'),
          meta: { title: 'Kelola Users' }
        },
        {
          path: 'berita',
          name: 'admin-berita',
          component: () => import('@/views/admin/ManageBerita.vue'),
          meta: { title: 'Kelola Berita' }
        },
        {
          path: 'insight',
          name: 'admin-insight',
          component: () => import('@/views/admin/ManageInsight.vue'),
          meta: { title: 'Kelola Insight' }
        },
        {
          path: 'dataset',
          name: 'admin-dataset',
          component: () => import('@/views/admin/ManageDataset.vue'),
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
