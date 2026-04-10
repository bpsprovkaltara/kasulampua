<template>
  <Navbar />

  <header class="hero-v2 hero-publication">
    <div class="hero-v2-glow" aria-hidden="true"></div>
    <div class="hero-v2-dots" aria-hidden="true"></div>

    <div class="container position-relative" style="z-index: 10">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="hero-v2-badge">
            <span class="badge-dot"></span>
            OPEN DATA KASULAMPUA
          </div>

          <h1 class="hero-v2-title">
            Publikasi <br />
            <em>BPS Regional</em>
          </h1>

          <p class="hero-v2-subtitle">
            Katalog publikasi statistik sektoral dari provinsi di wilayah
            <strong>Kalimantan</strong>, <strong>Sulawesi</strong>, <strong>Maluku</strong>, dan
            <strong>Papua</strong>.
          </p>
        </div>

        <div class="col-lg-4 d-flex justify-content-lg-end justify-content-center mt-4 mt-lg-0">
          <div class="hero-meta-card hero-meta-card--single">
            <div class="hero-meta-item">
              <span class="hm-num"><i class="bi bi-journal-text" aria-hidden="true"></i></span>
              <span class="hm-label">Publikasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="dataset-content py-5">
    <div class="container-xl">
      <PublikasiGrid />
    </div>
  </div>

  <Footer />
</template>

<script setup>
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import PublikasiGrid from '../components/PublikasiGrid.vue'
</script>

<style scoped>
.hero-publication .hm-num {
  font-size: 2rem;
  line-height: 1.2;
}

.hero-meta-card--single .hm-divider {
  display: none;
}

.hero-meta-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--hero-white-30);
  backdrop-filter: blur(12px);
  border-radius: var(--border-radius);
  padding: 1.5rem 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.hero-meta-item {
  text-align: center;
}

.hm-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--hero-white-90);
  text-transform: uppercase;
  margin-top: 6px;
}

.dataset-content {
  background: var(--bg-color);
  min-height: 50vh;
}
</style>
