import { ref, reactive, onMounted, onUnmounted } from 'vue'

export function useNavigation() {
  const isScrolledNav = ref(false)

  const handleScroll = () => {
    isScrolledNav.value = window.scrollY > 50
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const navigation = reactive({
    logo: '/assets/images/logo.svg',
  })

  const navigationLinks = [
    { text: 'Beranda', href: '/' },
    { text: 'Pusat Informasi', href: 'https://info-kasulampua.vercel.app/' },
    { text: 'Regional Insight', href: '#' },
    { text: 'Data', href: '#' },
    { text: 'Tentang', href: '#' },
  ]

  return { isScrolledNav, navigation, navigationLinks }
}
