import { ref, reactive, onMounted, onUnmounted,computed } from 'vue'
import { API_ENDPOINTS } from '@/config/api'


export function useNavigation() {
  const isScrolledNav = ref(false)
  const urlCkan = ref()

  const handleScroll = () => {
    isScrolledNav.value = window.scrollY > 50
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    fetchData()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const navigation = reactive({
    logo: '/assets/images/logo-nav.png',
  })

  const navigationLinks = computed(() => [
    { text: 'Beranda', href: '/' },
    { text: 'Pusat Informasi', href: 'https://info.kasulampua.id' },
    { text: 'Data Insight', href: '/regional_insight' },
    { text: 'Datasets', href: '/dataset' },
    { text: 'Berita', href:'/berita'},
    { text: 'Tentang', href: '/about' },
  ])

  const fetchData = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.SETELAN + '?set_key=ckan_api_url')
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      const rawUrl = data[0].set_val
      urlCkan.value = rawUrl.replace(/\/api$/, '')
    } else {
      console.warn('Data kosong atau format tidak sesuai')
    }
  } catch (err) {
    console.error('Gagal ambil data setelan:', err)
  }
}

  return { isScrolledNav, navigation, navigationLinks }
}
