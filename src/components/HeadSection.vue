<template>
  <div class="hero-premium-v2 position-relative overflow-hidden">
    <div class="hero-bg-glow"></div>

    <div class="hero-bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="hero-map-overlay"></div>

    <div class="hero-particles">
      <div v-for="n in 15" :key="n" class="particle" :style="particleStyle(n)"></div>
    </div>

    <div class="hero-bg-lines">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="streak s1"
          d="M-100 600C100 500 300 700 600 600C900 500 1100 600 1300 500"
          stroke="url(#paint0_linear)"
          stroke-opacity="0.3"
          stroke-width="2"
        />
        <path
          class="streak s2"
          d="M-100 400C150 300 450 500 600 400C750 300 1050 500 1300 400"
          stroke="url(#paint1_linear)"
          stroke-opacity="0.2"
          stroke-width="1.5"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="-100"
            y1="600"
            x2="1300"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#d97706" />
            <stop offset="1" stop-color="#f59e0b" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear"
            x1="-100"
            y1="400"
            x2="1300"
            y2="400"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#d97706" stop-opacity="0" />
            <stop offset="0.5" stop-color="#d97706" />
            <stop offset="1" stop-color="#d97706" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div class="hero-grain"></div>

    <div class="hero-floating-elements d-none d-lg-block">
      <!-- <div class="glass-module module-1 fade-in-up" style="animation-delay: 0.2s">
        <i class="bi bi-database-fill me-2 fs-5"></i>
        <span>Data Repository</span>
      </div>
      <div class="glass-module module-2 fade-in-up" style="animation-delay: 0.4s">
        <i class="bi bi-geo-alt-fill me-2 fs-5"></i>
        <span>Regional Insight</span>
      </div> -->
      <!-- <div class="glass-module module-3 fade-in-up" style="animation-delay: 0.6s">
        <i class="bi bi-graph-up-arrow me-2 fs-5"></i>
        <span>Statistical Analytics</span>
      </div> -->
    </div>

    <div class="container hero-container position-relative">
      <div class="hero-content-wrapper text-center mx-auto">
        <div class="hero-badge mb-4 mx-auto">
          <span class="badge-dot"></span>
          PORTAL DATA
        </div>

        <div class="hero-logo-box mb-4 fade-in">
          <img
            src="/assets/images/kasulampua.png"
            alt="Kasulampua"
            class="hero-main-logo"
          />
        </div>

        <div class="hero-event-banner mb-4">
          <span class="event-text">
            <span class="event-title"><b>Konsultasi Regional PDRB Kasulampua 2026</b></span>
            <span class="event-sep mx-2 opacity-50">|</span>
            <span class="event-loc">
              <i class="bi bi-geo-alt-fill text-amber me-1"></i>Tanjung Selor, 14–16 April 2026
            </span>
          </span>
        </div>

        <p class="hero-main-subtitle mb-5 mx-auto">
          Portal Data Terintegrasi Kalimantan, Sulawesi, Maluku &amp; Papua
        </p>

        <div class="hero-actions d-flex flex-wrap justify-content-center gap-4 mb-5">
          <router-link :to="link.href" class="btn btn-hero-primary-v2"> Masuk ke Portal Data </router-link>
        </div>

        <div class="hero-partners mt-3 pt-lg-3 pb-4">
          <p class="partners-label mb-3">DIDUKUNG OLEH</p>
          <div class="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-md-5">
            <img
              src="/assets/images/bank-indonesia.png"
              alt="BI"
              class="partner-logo"
              title="Bank Indonesia"
            />
            <img
              src="/assets/images/pemda/kalimantan-utara.png"
              alt="Kaltara"
              class="partner-logo"
              title="Kalimantan Utara"
            />
            <img
              src="/assets/images/bps.png"
              alt="BPS"
              class="partner-logo"
              title="Badan Pusat Statistik"
            />
            <img
              src="/assets/images/djpb.png"
              alt="DJPb"
              class="partner-logo"
              title="Direktorat Jenderal Perbendaharaan"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="hero-waves">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax-waves">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(217, 119, 6, 0.05)" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(217, 119, 6, 0.03)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(247, 249, 252, 1)" />
        </g>
      </svg>
    </div>

    <div class="regions-section-v2 py-5">
      <div class="container text-center py-4 position-relative z-index-10">
        <p class="section-label text-center">CAKUPAN WILAYAH STRATEGIS</p>
        <div class="row g-4 justify-content-center">
          <div class="col-6 col-md-3" v-for="(item, key) in regions" :key="key">
            <router-link
              :to="{ path: '/regional_insight', query: { region: key } }"
              class="region-card-premium-v2 text-decoration-none"
            >
              <div class="p-4 d-flex flex-column align-items-center text-center">
                <div class="region-icon-wrapper-v4">
                  <img
                    :src="item.icon"
                    :alt="'icon_' + key"
                    class="img-fluid"
                    style="height: 180px; width: auto"
                  />
                </div>
                <h5 class="region-title-v4 text-capitalize">{{ key }}</h5>
                <span class="btn-region-link-v2">
                  <span>Lihat Analisis</span>
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  header: Object,
  link: Object,
  regions: Object,
})

function particleStyle() {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const top = Math.random() * 80
  const duration = 15 + Math.random() * 20
  const delay = Math.random() * 10

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: 0.2 + Math.random() * 0.4,
  }
}
</script>

<style scoped>
.hero-premium-v2 {
  min-height: 50vh;
  background: radial-gradient(circle at 50% 50%, #fffbeb 0%, #f7f9fc 100%);
  position: relative;
  overflow: hidden;
  padding-top: 64px;
  display: flex;
  flex-direction: column;
}
.hero-bg-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%);
  filter: blur(60px);
  z-index: 1;
  pointer-events: none;
}

.hero-map-overlay {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 600' opacity='0.03'%3E%3Cpath fill='%23d97706' d='M600,200 Q650,150 700,200 T800,250 Q850,300 800,350 T700,400 Q650,450 600,400 T500,350 Q450,300 500,250 T600,200' /%3E%3Crect x='400' y='100' width='10' height='10' rx='5' /%3E%3Crect x='700' y='500' width='8' height='8' rx='4' /%3E%3C/svg%3E")
    no-repeat center center/contain;
  z-index: 2;
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(1);
}

.hero-bg-shapes,
.hero-bg-lines,
.hero-floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}
.shape-1 {
  top: -10%;
  left: -5%;
  background: rgba(217, 119, 6, 0.03);
  width: 600px;
  height: 600px;
}
.shape-2 {
  bottom: 10%;
  right: -5%;
  background: rgba(217, 119, 6, 0.02);
  width: 500px;
  height: 500px;
}
.shape-3 {
  top: 20%;
  right: 10%;
  background: rgba(217, 119, 6, 0.01);
  width: 400px;
  height: 400px;
}

.streak {
  animation: streak-move 10s infinite linear;
}
@keyframes streak-move {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
.hero-bg-lines svg path {
  stroke-dasharray: 500;
}

.hero-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.03;
  z-index: 4;
  pointer-events: none;
}

.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}
.particle {
  position: absolute;
  background: #d97706;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(1px);
  animation: float-particle linear infinite;
}
@keyframes float-particle {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translate(100px, -200px) scale(0);
    opacity: 0;
  }
}

.hero-container {
  padding: 120px 1rem 40px;
  z-index: 10;
  position: relative;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: #451a03;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
}
.badge-dot {
  width: 8px;
  height: 8px;
  background: #d97706;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.4);
  }
  50% {
    transform: scale(1.4);
    box-shadow: 0 0 0 10px rgba(217, 119, 6, 0);
  }
}

.hero-logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .hero-main-logo {
    max-width: 280px; 
  }
}
.hero-main-logo {
  height: clamp(2.5rem, 8vw, 5.5rem);
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 15px 35px rgba(217, 119, 6, 0.4)) 
          invert(48%) sepia(79%) saturate(2476%) hue-rotate(15deg) brightness(95%) contrast(101%);
  animation: float-logo 6s infinite ease-in-out;
}

@keyframes float-logo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-main-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: #4b5563;
  font-weight: 500;
  max-width: 640px;
  line-height: 1.6;
}

.btn-hero-primary-v2 {
  background: var(--amber-600);
  color: white;
  font-weight: 700;
  padding: 1.1rem 2.75rem;
  border-radius: 16px;
  border: none;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
    0 15px 30px -10px rgba(217, 119, 6, 0.45),
    inset 0 -4px 0 rgba(0, 0, 0, 0.12);
  letter-spacing: 0.01em;
}
.btn-hero-primary-v2:hover {
  background: var(--amber-700);
  transform: translateY(-5px);
  box-shadow:
    0 20px 40px -12px rgba(217, 119, 6, 0.55),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  color: white;
}
.btn-hero-outline-v2 {
  background: rgba(255, 255, 255, 0.4);
  color: #451a03;
  font-weight: 700;
  padding: 1.1rem 2.75rem;
  border-radius: 16px;
  border: 1.5px solid #e2e8f0;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
}
.btn-hero-outline-v2:hover {
  background: white;
  border-color: var(--amber-600);
  color: var(--amber-600);
  transform: translateY(-5px);
}

.hero-partners {
  max-width: 800px;
  margin: 0 auto;
}
.partners-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: #94a3b8;
}
.partner-logo {
  height: 68px;
  width: auto;
  object-fit: contain;
  transition: all 0.4s ease;
  opacity: 0.9;
}
.partner-logo:hover {
  opacity: 1;
  transform: translateY(-5px) scale(1.05);
  filter: drop-shadow(0 10px 15px rgba(217, 119, 6, 0.2));
}

.glass-module {
  position: absolute;
  padding: 1rem 1.75rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  color: #451a03;
  z-index: 15;
  pointer-events: none;
  transition: transform 0.3s ease;
}
.module-1 {
  top: 12%;
  right: 8%;
  animation: float-v2 7s infinite ease-in-out;
}
.module-2 {
  top: 45%;
  left: 4%;
  animation: float-v2 9s infinite ease-in-out reverse;
}
.module-3 {
  bottom: 25%;
  right: 12%;
  animation: float-v2 8s infinite ease-in-out 1.5s;
}
@keyframes float-v2 {
  0%,
  100% {
    transform: translateY(0) rotate(2deg);
  }
  50% {
    transform: translateY(-30px) rotate(-1deg);
  }
}

.hero-waves {
  position: relative;
  width: 100%;
  height: 100px;
  margin-top: auto;
  overflow: hidden;
  z-index: 10;
}
.waves {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
}
.parallax-waves > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax-waves > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax-waves > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax-waves > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

.regions-section-v2 {
  background: #f7f9fc;
  z-index: 10;
  padding-bottom: 5rem !important;
}
.section-label {
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.4em;
  color: #94a3b8;
  margin-bottom: 2.5rem !important;
}
.region-card-premium-v2 {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 32px;
  display: block;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}
.region-card-premium-v2::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
  opacity: 0;
  transition: opacity 0.4s ease;
}
.region-card-premium-v2:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 30px 60px -15px rgba(217, 119, 6, 0.2);
}
.region-card-premium-v2:hover::before {
  opacity: 1;
}
.region-icon-wrapper-v4 {
  width: auto;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;
  position: relative;
}
.region-card-premium-v2:hover .region-icon-wrapper-v4 {
  transform: translateY(-8px) rotate(4deg) scale(1.32);
  filter: drop-shadow(0 15px 15px rgba(217, 119, 6, 0.2));
}
.region-title-v4 {
  font-weight: 900;
  font-size: 1.4rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  z-index: 2;
  position: relative;
  transition: color 0.3s ease;
}
.region-card-premium-v2:hover .region-title-v4 {
  color: #92400e;
}
.btn-region-link-v2 {
  font-size: 0.85rem;
  font-weight: 800;
  color: #d97706;
  text-decoration: none;
  opacity: 0.6;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-right: 0;
}
.btn-region-link-v2 span {
  display: inline-block;
  transition: transform 0.3s ease;
  transform: translateX(0);
}
.btn-region-link-v2::after {
  content: '→';
  position: absolute;
  left: calc(50% + 48px); 
  opacity: 0;
  transition: all 0.3s ease;
  transform: translateX(-5px);
}
.region-card-premium-v2:hover .btn-region-link-v2 {
  opacity: 1;
}
.region-card-premium-v2:hover .btn-region-link-v2::after {
  opacity: 1;
  transform: translateX(0);
  left: calc(50% + 54px);
}
.region-card-premium-v2:hover .btn-region-link-v2 {
  opacity: 1;
  letter-spacing: 0.05em;
}
.region-card-premium-v2:hover .btn-region-link-v2::after {
  transform: translateX(0);
  opacity: 1;
  right: -24px;
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 1.2s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hero-event-banner {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(217, 119, 6, 0.25);
  border-radius: 100px;
  padding: 10px 20px;
  font-size: 0.875rem;
  color: #451a03;
  box-shadow: 0 4px 20px rgba(217, 119, 6, 0.08);
  animation: fadeInUp 1s ease-out 0.3s both;
}
.event-badge {
  background: #d97706;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 100px;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}
.event-text {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.event-title {
  color: #92400e;
  font-weight: 800;
}
.event-loc {
  font-weight: 500;
  display: flex;
  align-items: center;
}

@media (max-width: 991px) {
  .hero-premium-v2 {
    padding-top: 60px;
    min-height: auto;
  }
  .hero-container {
    padding-top: 40px;
    padding-bottom: 20px;
  }
  .hero-main-logo {
    height: 2.4rem;
    margin-bottom: 0.5rem;
  }
  .hero-main-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem !important;
    padding: 0 1rem;
    max-width: 100%;
  }
  .hero-actions {
    gap: 1rem;
    margin-bottom: 2rem !important;
  }
  .btn-hero-primary-v2,
  .btn-hero-outline-v2 {
    width: 100%;
    padding: 0.85rem 1.5rem;
    font-size: 1rem;
    border-radius: 12px;
  }
  .hero-event-banner {
    flex-wrap: wrap;
    border-radius: 20px;
    text-align: center;
    justify-content: center;
    padding: 10px 18px;
    width: fit-content;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
    gap: 8px;
  }
  .event-text {
    flex-direction: column;
    gap: 4px;
    white-space: normal;
  }
  .event-sep {
    display: none; 
  }
  .event-loc {
    justify-content: center;
  }
  .event-text br {
    display: block;
  }
  .partner-logo {
    height: 40px;
  }
  .hero-partners {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .glass-module {
    display: none; 
  }
}

@media (max-width: 480px) {
  .hero-main-logo {
    height: 2.8rem;
  }
  .hero-main-subtitle {
    font-size: 0.9rem;
  }
  .hero-badge {
    padding: 6px 14px;
    font-size: 0.6rem;
    letter-spacing: 0.2rem;
  }
}
</style>
