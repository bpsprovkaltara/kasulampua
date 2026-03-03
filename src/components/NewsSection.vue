<template>
  <section class="news-section py-5">
    <div class="container">
      <div class="d-flex align-items-center mb-5">
        <div class="section-label me-4">
          <span class="label-text">BERITA TERKINI</span>
        </div>
        <div class="flex-grow-1 section-line"></div>
        <a
          :href="berita.link_lainnya"
          class="btn btn-sm btn-outline-amber rounded-pill px-4 ms-4 fw-semibold"
        >
          Lihat Semua
        </a>
      </div>

      <div class="headline-card" v-if="berita.judul_headline">
        <div class="row g-0 align-items-stretch">
          <div class="col-lg-5">
            <div class="headline-image-wrapper h-100">
              <img :src="berita.headline_image" alt="headline" class="headline-img" />
              <div class="image-overlay"></div>
              <div class="image-badge">
                <span class="live-dot-sm"></span>
                HEADLINE UTAMA
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="headline-content p-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="category-tag mb-4">BERITA</div>
                <h2 class="headline-title mb-4">{{ berita.judul_headline }}</h2>
                <p class="headline-excerpt">{{ berita.ringkasan_headline }}</p>
              </div>
              <div class="d-flex align-items-center gap-3 mt-4">
                <a :href="berita.href" class="btn btn-amber-solid rounded-pill px-5 py-2 fw-bold">
                  {{ berita.text }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="headline-card p-5 text-center text-muted" v-else>
        <i class="bi bi-newspaper display-1 mb-3 d-block opacity-25"></i>
        <p>Memuat berita terkini...</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ berita: Object })
</script>

<style scoped>
.news-section {
  background: #ffffff;
  padding-top: 5rem !important;
  padding-bottom: 5rem !important;
}

.section-label {
  flex-shrink: 0;
}
.label-text {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--primary-color);
  background: var(--bg-accent);
  border: 1px solid var(--border-amber-20);
  padding: 8px 16px;
  border-radius: 100px;
}
.section-line {
  height: 1px;
  background: linear-gradient(to right, var(--border-color), transparent);
}

.headline-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.08);
  transition: var(--transition-smooth);
  border: 1px solid var(--border-color);
}
.headline-card:hover {
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.headline-image-wrapper {
  position: relative;
  overflow: hidden;
  min-height: 360px;
}
.headline-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.headline-card:hover .headline-img {
  transform: scale(1.05);
}
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 60%);
}
.image-badge {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
}
.live-dot-sm {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: pulse 1.5s ease-in-out infinite;
  display: inline-block;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.6;
  }
}

.headline-content {
  background: white;
  padding: 3rem !important;
}
.category-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--primary-color);
  background: var(--bg-accent);
  padding: 4px 12px;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}
.headline-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 1.5rem;
}
.headline-excerpt {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}

.btn-amber-solid {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px -3px rgba(217, 119, 6, 0.4);
  letter-spacing: 0.01em;
}
.btn-amber-solid:hover {
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  transform: translateY(-3px);
  color: white;
  box-shadow: 0 12px 24px -6px rgba(217, 119, 6, 0.45);
}

.btn-outline-amber {
  color: var(--primary-color);
  border: 1.5px solid var(--primary-color);
  background: transparent;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-outline-amber:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.3);
}

@media (max-width: 992px) {
  .headline-image-wrapper {
    min-height: 280px;
  }
  .headline-content {
    padding: 2rem !important;
  }
  .headline-title {
    font-size: 1.5rem;
  }
}
</style>
