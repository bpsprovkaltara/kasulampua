import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/css/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// import { MATOMO_ENDPOINT } from './config/api'

const app = createApp(App)

/* 
app.mixin({
  mounted() {
    if (this.$root !== this) return
    if (window._paq) return

    const _paq = (window._paq = window._paq || [])
    _paq.push(['trackPageView'])
    _paq.push(['enableLinkTracking'])

    const u = MATOMO_ENDPOINT.BASE_URL
    _paq.push(['setTrackerUrl', u + '/matomo.php'])
    _paq.push(['setSiteId', '1'])

    const d = document
    const g = d.createElement('script')
    const s = d.getElementsByTagName('script')[0]
    g.async = true
    g.src = u + '/matomo.js'
    s.parentNode.insertBefore(g, s)
  }
})

router.afterEach(() => {
  if (window._paq) {
    window._paq.push(['setCustomUrl', window.location.href])
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['trackPageView'])
  }
})
*/

app.use(router)

app.mount('#app')
