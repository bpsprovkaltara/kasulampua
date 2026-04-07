<template>
  <Navbar />

  <header class="hero-v2">
    <div class="hero-v2-glow" aria-hidden="true"></div>
    <div class="hero-v2-dots" aria-hidden="true"></div>
    
    <div class="container position-relative" style="z-index:10;">
      <div class="row align-items-center">
        <div class="col-lg-8 text-center text-lg-start">
          <div class="hero-v2-badge">
            <span class="badge-dot"></span>
            TENTANG KASULAMPUA
          </div>
          
          <h1 class="hero-v2-title">
            Mengenal <br /> 
            <em>Kasulampua</em>
          </h1>
          
          <p class="hero-v2-subtitle">
            Forum konsultasi regional yang menjadi <span class="hero-v2-amp">jembatan data</span> antara
            Kalimantan, Sulawesi, Maluku, dan Papua untuk pembangunan ekonomi yang terintegrasi.
          </p>
        </div>
        
        <div class="col-lg-4 d-none d-lg-flex justify-content-end">
          <div class="deco-globe-v2">
            <div class="globe-v2-inner">
              <i class="bi bi-globe-asia-australia"></i>
            </div>
            <div class="globe-v2-ring"></div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="about-section bg-white py-5">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-5 text-center text-lg-start">
          <div class="about-logo-wrapper">
             <div class="logo-glow-bg"></div>
             <img src="/assets/images/logo-kasulampua-warna.png" alt="Logo Kasulampua" class="img-fluid about-kasulampua-logo fade-in-up" />
          </div>
        </div>
        
        <div class="col-lg-7">
          <div class="section-eyebrow mb-4">APA ITU KASULAMPUA?</div>
          <h2 class="section-title mb-4">
            Konsultasi Regional <br /><span class="text-amber">Lintas Wilayah</span>
          </h2>
          <p class="section-body mb-4">
            Konsultasi Regional Kalimantan, Sulawesi, Maluku, dan Papua (<strong>Kasulampua</strong>)
            merupakan forum bertukar pengetahuan tentang permasalahan dan pembangunan ekonomi
            di wilayah Kasulampua yang diinisiasi oleh <strong>Badan Pusat Statistik</strong>,
            <strong>Bappeda</strong>, dan <strong>Bank Indonesia</strong>.
          </p>
          <p class="section-body">
            Konreg ini menitikberatkan pada pencapaian keselarasan, keserasian, dan keterpaduan
            perencanaan pembangunan antar wilayah, antara pusat dan daerah serta antar sektor
            khususnya di wilayah Kasulampua — menjadi landasan dalam penyusunan kesepahaman
            dan rencana tindak lanjut untuk menggerakkan perekonomian daerah.
          </p>
        </div>
      </div>
    </div>
  </section>


  <section class="about-section bg-faint py-5">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-eyebrow mb-2">FOKUS UTAMA</div>
        <h2 class="section-title">Tiga Pilar <span class="text-amber">Kasulampua</span></h2>
      </div>
      <div class="row g-4">
        <div class="col-md-4" v-for="pillar in pillars" :key="pillar.title">
          <div class="pillar-card h-100">
            <div class="pillar-icon-wrapper" :class="pillar.color">
              <i :class="pillar.icon" class="pillar-icon"></i>
            </div>
            <h5 class="pillar-title mt-4 mb-2">{{ pillar.title }}</h5>
            <p class="pillar-desc">{{ pillar.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

 
  <section class="about-section bg-white py-5">
    <div class="container">
   
      <IndonesiaMap />

      <!-- <div class="row g-4 mt-4">
        <div class="col-md-6 col-lg-3" v-for="region in regions" :key="region.name">
          <div class="region-card h-100">
            <div class="region-card-top" :style="{ background: region.gradient }">
              <img :src="region.icon" :alt="region.name" class="region-icon-img" />
              <div class="region-name">{{ region.name }}</div>
            </div>
            <div class="region-card-body">
              <div class="province-list">
                <div class="province-item" v-for="p in region.provinsi" :key="p">
                  <i class="bi bi-dot text-amber"></i>
                  <span>{{ p }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </section>

  <!-- ===== INSTITUSI SECTION ===== -->
  <!-- <section class="about-section institusi-section py-5">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-eyebrow mb-2" style="color:#fde68a;">PENYELENGGARA</div>
        <h2 class="section-title text-white">Institusi <span class="text-amber">Mitra</span></h2>
      </div>
      <div class="row g-4 justify-content-center">
        <div class="col-md-4" v-for="inst in institusi" :key="inst.name">
          <div class="inst-card text-center">
            <div class="inst-icon-circle mx-auto mb-3">
              <i :class="inst.icon" class="inst-icon"></i>
            </div>
            <h6 class="inst-name text-white fw-bold mb-1">{{ inst.name }}</h6>
            <p class="inst-desc">{{ inst.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section> -->

  <Footer />
</template>

<script setup>
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
import IndonesiaMap from '../components/IndonesiaMap.vue'

const pillars = [
  {
    icon: 'bi bi-diagram-3-fill',
    color: 'amber',
    title: 'Keselarasan Regional',
    desc: 'Mencapai keterpaduan perencanaan pembangunan antar wilayah dan antar sektor di kawasan Kasulampua.',
  },
  {
    icon: 'bi bi-bar-chart-line-fill',
    color: 'blue',
    title: 'Berbasis Data',
    desc: 'Mengintegrasikan data statistik dari BPS, Bappeda, dan Bank Indonesia sebagai landasan perencanaan yang akurat.',
  },
  {
    icon: 'bi bi-people-fill',
    color: 'green',
    title: 'Forum Kolaborasi',
    desc: 'Menjadi platform dialog antara pusat dan daerah untuk mewujudkan pembangunan ekonomi yang inklusif.',
  },
]

</script>

<style scoped>
.deco-globe-v2 {
  position: relative;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.globe-v2-inner {
  width: 100px;
  height: 100px;
  background: var(--hero-white-10);
  border: 1px solid var(--hero-white-30);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.globe-v2-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid var(--hero-white-20);
  border-radius: 50%;
  animation: spin 20s linear infinite;
}

.globe-v2-ring::after {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 100%;
  height: 10px;
  width: 10px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 15px white;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bg-faint { background: #f8f7f6; }

.section-eyebrow {
  font-size: 0.65rem; font-weight: 800; letter-spacing: 3px; color: #d97706;
  text-transform: uppercase;
}
.section-title {
  font-size: 2.2rem; font-weight: 900; color: #1c1917; line-height: 1.2;
}
.section-subtitle { color: #78716c; font-size: 0.95rem; max-width: 500px; margin: 0 auto; }
.section-body { color: #57534e; line-height: 1.8; font-size: 1.05rem; }
.about-logo-wrapper {
  position: relative;
  display: inline-block;
  padding: 1rem;
}
.logo-glow-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 60%);
  z-index: 0;
  border-radius: 50%;
}
.about-kasulampua-logo {
  position: relative;
  z-index: 1;
  max-width: 100%;
  width: auto;
  filter: drop-shadow(0 15px 30px rgba(0,0,0,0.06));
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.about-kasulampua-logo:hover {
  transform: scale(1.05) translateY(-5px);
}


.pillar-card {
  background: white;
  border: 1.5px solid #f0efee;
  border-radius: 1.25rem;
  padding: 2rem;
  transition: all 0.3s ease;
}
.pillar-card:hover {
  border-color: #fde68a;
  box-shadow: 0 10px 30px rgba(217,119,6,0.1);
  transform: translateY(-6px);
}
.pillar-icon-wrapper {
  width: 60px; height: 60px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}
.pillar-icon-wrapper.amber { background: #fffbeb; color: #d97706; border: 1.5px solid #fde68a; }
.pillar-icon-wrapper.blue  { background: #eff6ff; color: #2563eb; border: 1.5px solid #bfdbfe; }
.pillar-icon-wrapper.green { background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; }
.pillar-title { font-size: 1rem; font-weight: 800; color: #1c1917; }
.pillar-desc { font-size: 0.875rem; color: #78716c; line-height: 1.7; }

.region-card {
  background: white;
  border: 1.5px solid #f0efee;
  border-radius: 1.25rem;
  overflow: hidden;
  transition: all 0.35s ease;
}
.region-card:hover {
  border-color: rgba(245,158,11,0.3);
  box-shadow: 0 12px 35px rgba(0,0,0,0.12);
  transform: translateY(-6px);
}
.region-card-top {
  padding: 1.75rem;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  position: relative;
  min-height: 160px; justify-content: center;
}
.region-icon-img {
  height: 80px; width: auto;
  filter: brightness(0) invert(0.85);
  margin-bottom: 0.75rem;
  transition: transform 0.3s ease;
}
.region-card:hover .region-icon-img { transform: scale(1.08); }
.region-name {
  font-size: 1.1rem; font-weight: 900; color: rgba(254,243,199,0.9);
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.region-card-body { padding: 1rem 1.25rem; }
.province-list { display: flex; flex-direction: column; gap: 4px; }
.province-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.8rem; color: #57534e;
}

.institusi-section {
  background: linear-gradient(135deg, #0c0a09 0%, #1c1208 50%, #2d1a0a 100%);
  position: relative;
  overflow: hidden;
}
.institusi-section::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}
.inst-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(245,158,11,0.15);
  border-radius: 1.25rem;
  padding: 2rem 1.5rem;
  transition: all 0.3s ease;
}
.inst-card:hover {
  background: rgba(245,158,11,0.06);
  border-color: rgba(245,158,11,0.35);
  transform: translateY(-6px);
}
.inst-icon-circle {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(245,158,11,0.12);
  border: 1px solid rgba(245,158,11,0.25);
  display: flex; align-items: center; justify-content: center;
}
.inst-icon { font-size: 1.6rem; color: #f59e0b; }
.inst-name { font-size: 0.95rem; }
.inst-desc { font-size: 0.8rem; color: rgba(254,243,199,0.5); line-height: 1.6; }
.text-white { color: white !important; }

@media (max-width: 768px) {
  .section-title { font-size: 1.75rem; }
  .hero-tagline { font-size: 1rem; }
  .min-vh-hero { min-height: auto; }
}
</style>
