<script setup>
import { ref, onMounted, computed } from 'vue'
import { MapPin, Phone, Mail } from 'lucide-vue-next'

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const pemdaLinks = [
  { name: 'Kalimantan Selatan', href: 'https://kalselprov.go.id' },
  { name: 'Kalimantan Tengah', href: 'https://kalteng.go.id' },
  { name: 'Kalimantan Timur', href: 'https://kaltimprov.go.id' },
  { name: 'Kalimantan Barat', href: 'https://kalbarprov.go.id' },
  { name: 'Kalimantan Utara', href: 'https://kaltaraprov.go.id' },
  { name: 'Sulawesi Selatan', href: 'https://sulselprov.go.id' },
  { name: 'Sulawesi Tengah', href: 'https://sultengprov.go.id' },
  { name: 'Sulawesi Utara', href: 'https://sulutprov.go.id' },
  { name: 'Sulawesi Barat', href: 'https://sulbarprov.go.id' },
  { name: 'Sulawesi Tenggara', href: 'https://sultraprov.go.id' },
  { name: 'Gorontalo', href: 'https://gorontaloprov.go.id' },
  { name: 'Maluku', href: 'https://malukuprov.go.id' },
  { name: 'Maluku Utara', href: 'https://malutprov.go.id' },
  { name: 'Papua', href: 'https://papua.go.id' },
  { name: 'Papua Barat', href: 'https://papuabaratprov.go.id' },
  { name: 'Papua Tengah', href: 'https://papuatengahprov.go.id' },
  { name: 'Papua Selatan', href: 'https://papuaselatan.go.id' },
  { name: 'Papua Barat Daya', href: 'https://papuabaratdayaprov.go.id' },
  { name: 'Papua Pegunungan', href: 'https://papuapegunungan.go.id' },
]

const bpsLinks = [
  { name: 'BPS Provinsi Kalimantan Selatan', href: 'https://kalsel.bps.go.id' },
  { name: 'BPS Provinsi Kalimantan Tengah', href: 'https://kalteng.bps.go.id' },
  { name: 'BPS Provinsi Kalimantan Timur', href: 'https://kaltim.bps.go.id' },
  { name: 'BPS Provinsi Kalimantan Barat', href: 'https://kalbar.bps.go.id' },
  { name: 'BPS Provinsi Kalimantan Utara', href: 'https://kaltara.bps.go.id' },
  { name: 'BPS Provinsi Sulawesi Selatan', href: 'https://sulsel.bps.go.id' },
  { name: 'BPS Provinsi Sulawesi Tengah', href: 'https://sulteng.bps.go.id' },
  { name: 'BPS Provinsi Sulawesi Utara', href: 'https://sulut.bps.go.id' },
  { name: 'BPS Provinsi Sulawesi Barat', href: 'https://sulbar.bps.go.id' },
  { name: 'BPS Provinsi Gorontalo', href: 'https://gorontalo.bps.go.id' },
  { name: 'BPS Provinsi Maluku', href: 'https://maluku.bps.go.id' },
  { name: 'BPS Provinsi Maluku Utara', href: 'https://malut.bps.go.id' },
  { name: 'BPS Provinsi Papua', href: 'https://papua.bps.go.id' },
  { name: 'BPS Provinsi Papua Barat', href: 'https://papuabarat.bps.go.id' },
]

const biLinks = [
  {
    name: 'BI KP Kalimantan Selatan',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Provinsi-Kalimantan-Selatan.aspx',
  },
  {
    name: 'BI KP Kalimantan Tengah',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Kalimantan-Tengah.aspx',
  },
  {
    name: 'BI KP Kalimantan Timur',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Provinsi-Kalimantan-Timur.aspx',
  },
  {
    name: 'BI KP Kalimantan Barat',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Kalimantan-Barat.aspx',
  },
  {
    name: 'BI KP Kalimantan Utara',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Kalimantan-Utara.aspx',
  },
  {
    name: 'BI KP Sulawesi Selatan',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Selatan.aspx',
  },
  {
    name: 'BI KP Sulawesi Tengah',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Tengah.aspx',
  },
  {
    name: 'BI KP Sulawesi Utara',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Utara.aspx',
  },
  {
    name: 'BI KP Sulawesi Barat',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Barat.aspx',
  },
  {
    name: 'BI KP Gorontalo',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Gorontalo.aspx',
  },
  {
    name: 'BI KP Maluku',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Provinsi-Maluku.aspx',
  },
  {
    name: 'BI KP Maluku Utara',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Maluku-Utara.aspx',
  },
  {
    name: 'BI KP Papua',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Papua.aspx',
  },
  {
    name: 'BI KP Papua Barat',
    href: 'https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Papua-Barat.aspx',
  },
]

const djpbLinks = [
  { name: 'DJPb Kalimantan Selatan', href: 'https://djpb.kemenkeu.go.id/kanwil/kalsel/id/' },
  { name: 'DJPb Kalimantan Tengah', href: 'https://djpb.kemenkeu.go.id/kanwil/kalteng/id/' },
  { name: 'DJPb Kalimantan Timur', href: 'https://djpb.kemenkeu.go.id/kanwil/kaltim/id/' },
  { name: 'DJPb Kalimantan Barat', href: 'https://djpb.kemenkeu.go.id/kanwil/kalbar/id/' },
  { name: 'DJPb Kalimantan Utara', href: 'https://djpb.kemenkeu.go.id/kanwil/kaltara/id/' },
  { name: 'DJPb Sulawesi Selatan', href: 'https://djpb.kemenkeu.go.id/kanwil/sulsel/id/' },
  { name: 'DJPb Sulawesi Tengah', href: 'https://djpb.kemenkeu.go.id/kanwil/sulteng/id/' },
  { name: 'DJPb Sulawesi Utara', href: 'https://djpb.kemenkeu.go.id/kanwil/sulut/id/' },
  { name: 'DJPb Sulawesi Barat', href: 'https://djpb.kemenkeu.go.id/kanwil/sulbar/id/' },
  { name: 'DJPb Gorontalo', href: 'https://djpb.kemenkeu.go.id/kanwil/gorontalo/id/' },
  { name: 'DJPb Maluku', href: 'https://djpb.kemenkeu.go.id/kanwil/maluku/id/' },
  { name: 'DJPb Maluku Utara', href: 'https://djpb.kemenkeu.go.id/kanwil/malut/id/' },
  { name: 'DJPb Papua', href: 'https://djpb.kemenkeu.go.id/kanwil/papua/id/' },
  { name: 'DJPb Papua Barat', href: 'https://djpb.kemenkeu.go.id/kanwil/papuabarat/id/' },
]

const partnerLogos = [
  { name: 'Badan Pusat Statistik', href: 'https://www.bps.go.id', logo: '/assets/images/bps.png' },
  {
    name: 'Bank Indonesia',
    href: 'https://www.bi.go.id',
    logo: '/assets/images/bank-indonesia.png',
  },
  { name: 'DJPb', href: 'https://djpb.kemenkeu.go.id', logo: '/assets/images/djpb.png' },
]

const pemdaLogos = pemdaLinks.map((p) => ({
  name: p.name,
  href: p.href,
  logo: `/assets/images/pemda/${p.name.toLowerCase().replaceAll(' ', '-')}.png`,
}))

const allPartnerLogos = computed(() => [...partnerLogos, ...pemdaLogos])

const activeFooterSection = ref(null)

const toggleFooterSection = (title) => {
  if (activeFooterSection.value === title) {
    activeFooterSection.value = null
  } else {
    activeFooterSection.value = title
  }
}

const footerSections = [
  { title: 'Pemerintah Daerah', links: pemdaLinks },
  { title: 'Badan Pusat Statistik', links: bpsLinks },
  { title: 'Bank Indonesia', links: biLinks },
  { title: 'DJPB', links: djpbLinks },
]
</script>

<template>
  <footer class="main-footer overflow-visible">
    <div class="container py-5">
      <div class="row g-4 text-start">
        <div class="col-12 col-lg-3 mb-4 mb-lg-0">
          <div class="mb-4" style="height: 80px; width: 192px">
            <img
              src="/assets/images/logo-kasulampua-PUTIH.png"
              alt="Logo Kasulampua"
              class="h-100 w-100"
              style="object-fit: contain; object-position: left"
            />
          </div>

          <p class="opacity-75 fs-small leading-relaxed mb-4 text-secondary-light">
            Pusat Informasi Peserta Konsultasi Regional PDRB Kalimantan, Sulawesi, Maluku, dan Papua
            (Kasulampua)
          </p>

          <div class="contact-section">
            <h4 class="h5 fw-bold text-white mb-3">Kontak</h4>
            <div class="d-flex align-items-start mb-3">
              <div class="icon-box me-3">
                <MapPin size="16" class="text-amber" />
              </div>
              <p class="opacity-75 fs-xs mb-0 text-secondary-light">
                Jl. Gubernur Syarkawi No. 123, Tanjung Selor, Kalimantan Utara 77212
              </p>
            </div>
            <div class="d-flex align-items-start mb-3">
              <div class="icon-box me-3">
                <Phone size="16" class="text-amber" />
              </div>
              <div class="opacity-75 fs-xs text-secondary-light">
                <p class="mb-1">+62 551 21234</p>
                <p class="mb-0">+62 551 21235</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <div class="icon-box me-3">
                <Mail size="16" class="text-amber" />
              </div>
              <p class="opacity-75 fs-xs mb-0 text-secondary-light">bps6500@bps.go.id</p>
            </div>
          </div>
        </div>

        <div
          class="col-12 col-md-6 col-lg-2"
          v-for="section in footerSections"
          :key="section.title"
        >
          <div class="footer-collapsible">
            <h4
              @click="toggleFooterSection(section.title)"
              class="h6 fw-bold text-white mb-3 mb-md-4 d-flex justify-content-between align-items-center cursor-pointer-mobile"
            >
              {{ section.title }}
              <i
                class="bi bi-chevron-down d-md-none transition-all"
                :class="{ 'rotate-180': activeFooterSection === section.title }"
              ></i>
            </h4>
            <ul
              :class="[
                'list-unstyled footer-list-mobile',
                {
                  'd-none d-md-block': activeFooterSection !== section.title,
                  'd-block': activeFooterSection === section.title,
                },
              ]"
            >
              <li v-for="(link, i) in section.links" :key="i" class="mb-2">
                <a :href="link.href" target="_blank" class="footer-link">
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="py-5 marquee-bg border-top border-stone position-relative">
      <h4 class="text-center h6 fw-semibold opacity-50 mb-4 text-white">Didukung Oleh</h4>

      <div v-if="mounted" class="marquee-wrapper overflow-visible position-relative">
        <div class="marquee-inner flex-nowrap align-items-center">
          <template v-for="loopIndex in 2" :key="'loop-' + loopIndex">
            <div
              v-for="(partner, i) in allPartnerLogos"
              :key="'partner-' + loopIndex + '-' + i"
              class="mx-4 flex-shrink-0 logo-container group position-relative"
            >
              <a :href="partner.href" target="_blank" class="d-block">
                <div
                  class="partner-logo-box d-flex align-items-center justify-content-center transition bg-white-opacity-10"
                >
                  <img
                    :src="partner.logo"
                    :alt="partner.name"
                    class="img-fluid p-2"
                    style="max-height: 100%; max-width: 100%; object-fit: contain"
                  />
                </div>
              </a>
              <div class="custom-tooltip">
                {{ partner.name }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="bg-darker py-4 text-center border-top border-stone">
      <div class="container">
        <p class="opacity-50 fs-xs mb-0 text-white">
          © 2026 Rekonsiliasi PDRB Kalimantan Utara. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.main-footer {
  background-color: #000000 !important;
  color: #d1d5db !important;
}

.bg-darker {
  background-color: #0a0a0a !important;
}

.text-white {
  color: #ffffff !important;
}

.text-amber {
  color: #f59e0b !important;
}

.footer-link {
  color: #9ca3af !important;
  text-decoration: none !important;
  font-size: 0.85rem !important;
  line-height: 1.8;
  transition: var(--transition-smooth);
  display: inline-block;
  padding: 4px 0;
}

.footer-link:hover {
  color: #f59e0b !important;
  transform: translateX(4px);
}

.rotate-180 {
  transform: rotate(180deg);
}

.transition-all {
  transition: all 0.3s ease;
}

@media (max-width: 767px) {
  .cursor-pointer-mobile {
    cursor: pointer;
  }
}

.fs-xs {
  font-size: 0.8rem !important;
}

.fs-small {
  font-size: var(--font-sm) !important;
}

.icon-box {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition-smooth);
}

.icon-box:hover {
  background-color: rgba(245, 158, 11, 0.1);
}

.marquee-bg {
  background-color: #050505 !important;
}

.border-stone {
  border-color: #111827 !important;
}

.bg-white-opacity-10 {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.marquee-inner {
  display: flex !important;
  width: max-content !important;
  animation: scroll 40s linear infinite !important;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-wrapper:hover .marquee-inner {
  animation-play-state: paused !important;
}

.partner-logo-box {
  width: 72px !important;
  height: 72px !important;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  border-radius: 12px !important;
}

@media (min-width: 1024px) {
  .partner-logo-box {
    width: 96px !important;
    height: 96px !important;
  }
}

.logo-container:hover .partner-logo-box {
  border-color: rgba(245, 158, 11, 0.3) !important;
  background-color: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-4px);
}

.logo-container .custom-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.75rem;
  display: none;
  background-color: #111827;
  color: #ffffff;
  font-size: 11px;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(245, 158, 11, 0.2);
  white-space: nowrap;
  z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.logo-container:hover .custom-tooltip {
  display: block;
}

.text-start {
  text-align: left !important;
}

.leading-relaxed {
  line-height: 1.625;
}
</style>
