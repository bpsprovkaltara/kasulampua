<template>
  <section :class="['footer-section py-5', customNavClass]">
    <div class="container">
      <div class="row gy-4">
        <!-- Sekretariat -->
        <div class="col-lg-3 col-md-6">
          <img src="@/assets/images/logo.svg" alt="Logo Konreg" class="mb-3 d-block" style="height: 70px;" />
          <h6 class="fw-bold mb-3">Sekretariat Konreg PDRB Kasulampua</h6>
          <ul class="list-unstyled small">
            <li class="mb-2">
              <i class="bi bi-geo-alt-fill text-orange me-2"></i>
              BPS Provinsi Kalimantan Selatan, Jalan Soekarno Hatta No. 7 (Trikora) Banjarbaru Kalimantan Selatan
            </li>
            <li class="mb-2">
              <i class="bi bi-telephone-fill text-orange me-2"></i>
              (0511) 6749001
            </li>
            <li class="mb-2">
              <i class="bi bi-envelope-fill text-orange me-2"></i>
              bps63000@bps.go.id
            </li>
          </ul>
        </div>

        <!-- Link Group -->
        <div class="col-lg-9 col-md-6">
          <div class="row">
            <div class="col-md-3 col-6 footer-links">
              <h6>Bappeda</h6>
              <ul class="ps-0">
                <li v-for="(link, index) in bapperida" :key="index">
                  <a :href="link.url" target="_blank" rel="nofollow">{{ link.name }}</a>
                </li>
              </ul>
            </div>
            <div class="col-md-3 col-6 footer-links">
              <h6>BPS</h6>
              <ul class="ps-0">
                <li v-for="(link, index) in bps" :key="index">
                  <a :href="link.url" target="_blank" rel="nofollow">{{ link.name }}</a>
                </li>
              </ul>
            </div>
            <div class="col-md-3 col-6 footer-links">
              <h6>Bank Indonesia</h6>
              <ul class="ps-0">
                <li v-for="(link, index) in bi" :key="index">
                  <a :href="link.url" target="_blank" rel="nofollow">{{ link.name }}</a>
                </li>
              </ul>
            </div>
            <div class="col-md-3 col-6 footer-links">
              <h6>Ditjen Perbendaharaan</h6>
              <ul class="ps-0">
                <li v-for="(link, index) in djpb" :key="index">
                  <a :href="link.url" target="_blank" rel="nofollow">{{ link.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const bapperida = [
  { name: "Kalimantan Selatan", url: "http://bappeda.kalselprov.go.id" },
  { name: "Kalimantan Barat", url: "https://bappeda.kalbarprov.go.id" },
  { name: "Kalimantan Tengah", url: "http://bappeda.kalteng.go.id" },
  { name: "Kalimantan Timur", url: "https://bappeda.kaltimprov.go.id" },
  { name: "Kalimantan Utara", url: "https://bappedalitbang.kaltaraprov.go.id/" },
  { name: "Sulawesi Utara", url: "http://bappeda.sulutprov.go.id" },
  { name: "Sulawesi Tengah", url: "http://bappeda.sultengprov.go.id" },
  { name: "Sulawesi Selatan", url: "https://bappelitbangda.sulselprov.go.id/" },
  { name: "Sulawesi Tenggara", url: "https://bappedasultra.go.id" },
  { name: "Gorontalo", url: "https://bappeda.gorontaloprov.go.id/" },
  { name: "Sulawesi Barat", url: "http://bappeda.sulbarprov.go.id" },
  { name: "Maluku", url: "https://malukuprov.go.id" },
  { name: "Maluku Utara", url: "https://bappeda.malutprov.go.id" },
  { name: "Papua Barat", url: "https://bappeda.papuabaratprov.go.id" },
  { name: "Papua", url: "https://bappeda.papua.go.id" },
];


const bps = [
  { name: "BPS Kalimantan Selatan", url: "https://kalsel.bps.go.id" },
  { name: "BPS Kalimantan Barat", url: "https://kalbar.bps.go.id" },
  { name: "BPS Kalimantan Tengah", url: "https://kalteng.bps.go.id" },
  { name: "BPS Kalimantan Timur", url: "https://kaltim.bps.go.id" },
  { name: "BPS Kalimantan Utara", url: "https://kaltara.bps.go.id" },
  { name: "BPS Sulawesi Utara", url: "https://sulut.bps.go.id" },
  { name: "BPS Sulawesi Tengah", url: "https://sulteng.bps.go.id" },
  { name: "BPS Sulawesi Selatan", url: "https://sulsel.bps.go.id" },
  { name: "BPS Sulawesi Tenggara", url: "https://sultra.bps.go.id" },
  { name: "BPS Gorontalo", url: "https://gorontalo.bps.go.id" },
  { name: "BPS Sulawesi Barat", url: "https://sulbar.bps.go.id" },
  { name: "BPS Maluku", url: "https://maluku.bps.go.id" },
  { name: "BPS Maluku Utara", url: "https://malut.bps.go.id" },
  { name: "BPS Papua Barat", url: "https://papuabarat.bps.go.id" },
  { name: "BPS Papua", url: "https://papua.bps.go.id" },
];


const bi = [
  { name: "KP Kalimantan Selatan", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Provinsi-Kalimantan-Selatan.aspx" },
  { name: "KP Kalimantan Barat", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Kalimantan-Barat.aspx" },
  { name: "KP Kalimantan Tengah", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Kalimantan-Tengah.aspx" },
  { name: "KP Kalimantan Timur", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Provinsi-Kalimantan-Timur.aspx" },
  { name: "KP Kalimantan Utara", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Kalimantan-Utara.aspx" },
  { name: "KP Sulawesi Utara", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Utara.aspx" },
  { name: "KP Sulawesi Tengah", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Tengah.aspx" },
  { name: "KP Sulawesi Selatan", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Selatan.aspx" },
  { name: "KP Sulawesi Tenggara", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Tenggara.aspx" },
  { name: "KP Gorontalo", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Gorontalo.aspx" },
  { name: "KP Sulawesi Barat", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Sulawesi-Barat.aspx" },
  { name: "KP Maluku", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Provinsi-Maluku.aspx" },
  { name: "KP Maluku Utara", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Maluku-Utara.aspx" },
  { name: "KP Papua Barat", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Papua-Barat.aspx" },
  { name: "KP Papua", url: "https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Papua.aspx" },
];


const djpb = [
  { name: "Kanwil Kalimantan Selatan", url: "https://djpb.kemenkeu.go.id/kanwil/kalsel/id/" },
  { name: "Kanwil Kalimantan Barat", url: "https://djpb.kemenkeu.go.id/kanwil/kalbar/id/" },
  { name: "Kanwil Kalimantan Tengah", url: "https://djpb.kemenkeu.go.id/kanwil/kalteng/id/" },
  { name: "Kanwil Kalimantan Timur", url: "https://djpb.kemenkeu.go.id/kanwil/kaltim/id/" },
  { name: "Kanwil Kalimantan Utara", url: "https://djpb.kemenkeu.go.id/kanwil/kaltara/id/" },
  { name: "Kanwil Sulawesi Utara", url: "https://djpb.kemenkeu.go.id/kanwil/sulut/id/" },
  { name: "Kanwil Sulawesi Tengah", url: "https://djpb.kemenkeu.go.id/kanwil/sulteng/id/" },
  { name: "Kanwil Sulawesi Selatan", url: "https://djpb.kemenkeu.go.id/kanwil/sulsel/id/" },
  { name: "Kanwil Sulawesi Tenggara", url: "https://djpb.kemenkeu.go.id/kanwil/sultra/id/" },
  { name: "Kanwil Gorontalo", url: "https://djpb.kemenkeu.go.id/kanwil/gorontalo/id/" },
  { name: "Kanwil Sulawesi Barat", url: "https://djpb.kemenkeu.go.id/kanwil/sulbar/id/" },
  { name: "Kanwil Maluku", url: "https://djpb.kemenkeu.go.id/kanwil/maluku/id/" },
  { name: "Kanwil Maluku Utara", url: "https://djpb.kemenkeu.go.id/kanwil/malut/id/" },
  { name: "Kanwil Papua Barat", url: "https://djpb.kemenkeu.go.id/kanwil/papuabarat/id/" },
  { name: "Kanwil Papua", url: "https://djpb.kemenkeu.go.id/kanwil/papua/id/" },
];


const customNavClass = computed(() => {
  switch (route.name) {
    case 'regional_insight':
      return 'footer-section-insight'
    case 'regional_insight-detil':
      return 'footer-section-insight'
    default:
      return ''
  }
})

</script>

<style scoped>
.footer-section {
  background-color: #e7f5ec;
  font-size: 0.95rem;
}

.footer-section-insight {
  background-color: #E1E4CF;
  font-size: 0.95rem;
}

.text-orange {
  color: #f26522;
}

.footer-links h6 {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.footer-links ul {
  list-style: none;
  padding-left: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #0077b6;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #00b4d8;
}
</style>
