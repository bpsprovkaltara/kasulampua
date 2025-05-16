<template>
  <Navbar />
  <div class="container py-5">
  <Breadcump title="Tentang kami" :title_detil="['about']" />

    <div class="text-center mb-5">
          <img src="@/assets/images/logo.svg" alt="Logo Konreg" class="mb-3  ms-auto" style="height: 200px;" />
      <p class="text-muted mx-auto" style="max-width: 700px;">
          Konsultasi Regional Kalimantan, Sulawesi, Maluku, dan Papua (Kasulampua) merupakan forum bertukar pengetahuan tentang permasalahan dan pembangunan ekonomi di wilayah Kasulampua yang diinisiasi oleh Badan Pusat Statistik, Bappeda, dan Bank Indonesia. Konreg ini menitikberatkan pada pencapaian keselarasan, keserasian dan keterpaduan perencanaan pembangunan antar wilayah, antara pusat dan daerah serta antar sektor khususnya di wilayah Kasulampua. Konreg ini akan menjadi landasan dalam penyusunan kesepahaman/kesepakatan dan rencana tindak lanjut sekaligus menggerakkan perekonomian daerah sebagai upaya pencapaian pembangunan regional maupun nasional.
      </p>
    </div>

  </div>

  <Kontak />
  <Footer />
</template>

<script setup>
import RegionalFilter from '../components/RegionalFilter.vue'
import RegionalCard from '../components/RegionalCard.vue'
import Navbar from '../components/Nav.vue'
import Footer from '../components/Footer.vue'
import Kontak from '../components/KontakSection.vue'
import Breadcump from '../components/Breadc.vue'



</script>
