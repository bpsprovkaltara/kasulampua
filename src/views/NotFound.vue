<template>
  <Navbar />
  <div class="not-found-container">
    <div class="container text-center">
      <div class="error-code">404</div>
      <h1 class="error-title">Halaman Tidak Ditemukan</h1>
      <p class="error-description">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
      </p>
      <router-link to="/" class="btn-home">
        <i class="bi bi-house-door me-2"></i> Kembali ke Beranda
      </router-link>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Navbar from '../components/NavSection.vue'
import Footer from '../components/FooterSection.vue'
</script>

<style scoped>
.not-found-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  background: var(--bg-color);
}
.error-code {
  font-size: clamp(5rem, 15vw, 10rem);
  font-weight: 900;
  color: var(--amber-600);
  line-height: 1;
  margin-bottom: 1rem;
  letter-spacing: -0.05em;
  opacity: 0.8;
}
.error-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}
.error-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}
.btn-home {
  display: inline-flex;
  align-items: center;
  background: var(--amber-600);
  color: white;
  padding: 12px 30px;
  border-radius: 100px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
}
.btn-home:hover {
  background: var(--amber-700);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(217, 119, 6, 0.4);
  color: white;
}
</style>
