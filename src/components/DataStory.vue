<template>
  <section class="data-story-section py-5">
    <div class="container">
      <div class="d-flex align-items-center mb-5">
        <div class="section-label me-4">REGIONAL INSIGHT</div>
        <div class="flex-grow-1 section-line"></div>
        <!-- <a href="/regional_insight" class="btn-premium-cta btn-premium-cta-outline px-4 py-2 ms-4">
          Semua Insight
        </a> -->
      </div>

      <div class="row g-5 align-items-start">
        <div class="col-lg-8">
          <div class="insight-card" v-if="dataSection.judul">
            <div class="insight-image-banner position-relative">
              <img :src="dataSection.gambar" alt="insight cover" class="insight-cover-img" />
              <div class="insight-image-overlay"></div>
              <div class="insight-floating-tags">
                <span class="insight-tag" v-if="dataSection.topik">
                  <i class="bi bi-tag me-1"></i>{{ dataSection.topik }}
                </span>
                <span class="insight-tag-region" v-if="dataSection.wilayah">
                  <i class="bi bi-geo-alt me-1"></i>{{ dataSection.wilayah }}
                </span>
              </div>
            </div>

            <div class="insight-body p-5">
              <h2 class="insight-title mb-3">{{ dataSection.judul }}</h2>
              <p class="insight-desc mb-4">
                {{ dataSection.deskripsi }}
                <a class="insight-read-more" :href="dataSection.link_lainnya">
                  {{ dataSection.text_lainnya }}
                </a>
              </p>

              <div v-if="dataset && dataset.length" class="related-section">
                <h6 class="related-title"><i class="bi bi-layers me-2"></i> Dataset Terkait</h6>
                <div class="related-list">
                  <a
                    v-for="link in dataset"
                    :key="link.title"
                    :href="link.url"
                    class="related-item"
                  >
                    <i class="bi bi-file-earmark-text related-icon"></i>
                    <span>{{ link.title }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="insight-card p-5 text-center text-muted" v-else>
            <i class="bi bi-bar-chart-line display-1 mb-3 d-block opacity-25"></i>
            <p>Memuat regional insight...</p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="meta-stack mb-4" v-if="dataSection.judul">
            <div class="meta-item">
              <div class="meta-icon amber">
                <i class="bi bi-journal-text"></i>
              </div>
              <div>
                <div class="meta-label">Topik</div>
                <div class="meta-value">{{ dataSection.topik || 'Tidak tersedia' }}</div>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-icon stone">
                <i class="bi bi-building"></i>
              </div>
              <div>
                <div class="meta-label">Regional</div>
                <div class="meta-value">{{ dataSection.region || 'Tidak tersedia' }}</div>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-icon amber">
                <i class="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <div class="meta-label">Wilayah</div>
                <div class="meta-value">{{ dataSection.wilayah || 'Tidak tersedia' }}</div>
              </div>
            </div>
          </div>

          <div class="cta-sidebar">
            <div class="cta-glow"></div>
            <div class="cta-content">
              <p class="cta-eyebrow">KASULAMPUA INSIGHT</p>
              <h4 class="cta-title">Eksplorasi Regional Insight</h4>
              <p class="cta-text">
                Temukan visualisasi data mendalam untuk mendukung pengambilan keputusan di wilayah
                Kasulampua.
              </p>
              <div class="data-viz-decoration mb-3">
                <svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" width="100%">
                  <g opacity="0.2">

                    <circle cx="20" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="50" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="80" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="110" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="140" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="170" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="200" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="230" cy="15" r="2" fill="#f59e0b" />
                    <circle cx="20" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="50" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="80" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="110" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="140" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="170" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="200" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="230" cy="35" r="2" fill="#f59e0b" />
                    <circle cx="20" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="50" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="80" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="110" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="140" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="170" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="200" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="230" cy="55" r="2" fill="#f59e0b" />
                    <circle cx="20" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="50" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="80" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="110" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="140" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="170" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="200" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="230" cy="75" r="2" fill="#f59e0b" />
                    <circle cx="20" cy="95" r="2" fill="#f59e0b" />
                    <circle cx="50" cy="95" r="2" fill="#f59e0b" />
                    <circle cx="80" cy="95" r="2" fill="#f59e0b" />
                    <circle cx="110" cy="95" r="2" fill="#f59e0b" />
                    <circle cx="140" cy="95" r="2" fill="#f59e0b" />
                    <circle cx="170" cy="95" r="2" fill="#f59e0b" />
                    <circle cx="200" cy="95" r="2" fill="#f59e0b" />
                    <circle cx="230" cy="95" r="2" fill="#f59e0b" />
                  </g>
                  <polyline
                    points="20,80 60,60 100,65 140,40 180,30 230,18"
                    fill="none"
                    stroke="#f59e0b"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    opacity="0.7"
                  />
                  <circle cx="20" cy="80" r="4" fill="#f59e0b" opacity="0.9" />
                  <circle cx="60" cy="60" r="4" fill="#f59e0b" opacity="0.9" />
                  <circle cx="100" cy="65" r="4" fill="#f59e0b" opacity="0.9" />
                  <circle cx="140" cy="40" r="4" fill="#f59e0b" opacity="0.9" />
                  <circle cx="180" cy="30" r="4" fill="#f59e0b" opacity="0.9" />
                  <circle cx="230" cy="18" r="5" fill="#f59e0b" />
                  <rect
                    x="160"
                    y="70"
                    width="12"
                    height="25"
                    rx="3"
                    fill="#f59e0b"
                    opacity="0.25"
                  />
                  <rect
                    x="178"
                    y="60"
                    width="12"
                    height="35"
                    rx="3"
                    fill="#f59e0b"
                    opacity="0.35"
                  />
                  <rect
                    x="196"
                    y="50"
                    width="12"
                    height="45"
                    rx="3"
                    fill="#f59e0b"
                    opacity="0.45"
                  />
                  <rect
                    x="214"
                    y="40"
                    width="12"
                    height="55"
                    rx="3"
                    fill="#f59e0b"
                    opacity="0.55"
                  />
                  <rect x="232" y="28" width="12" height="67" rx="3" fill="#f59e0b" opacity="0.7" />
                </svg>
              </div>
              <a
                href="/regional_insight"
                class="btn-premium-cta btn-premium-cta-primary w-100 py-3"
              >
                Jelajahi Insight
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ dataSection: Object, dataset: Array })
</script>

<style scoped>
.data-story-section {
  background: white;
  padding: 6rem 0;
}
.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--primary-color);
  background: rgba(217, 119, 6, 0.08);
  border: 1px solid var(--border-amber-20);
  padding: 6px 16px;
  border-radius: 100px;
}
.section-line {
  height: 1px;
  background: linear-gradient(to right, var(--border-color), transparent);
}
.btn-outline-amber {
  color: var(--primary-color);
  border: 1.5px solid var(--primary-color);
  background: transparent;
  transition: var(--transition-smooth);
}
.btn-outline-amber:hover {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.insight-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  transition: var(--transition-smooth);
}
.insight-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
}

.insight-image-banner {
  height: 300px;
  overflow: hidden;
}
.insight-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}
.insight-card:hover .insight-cover-img {
  transform: scale(1.05);
}
.insight-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 60%);
}
.insight-floating-tags {
  position: absolute;
  bottom: 20px;
  left: 24px;
  display: flex;
  gap: 10px;
}
.insight-tag,
.insight-tag-region {
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  backdrop-filter: blur(8px);
}
.insight-tag {
  background: var(--primary-color);
  color: white;
}
.insight-tag-region {
  background: rgba(0, 0, 0, 0.6);
  color: var(--secondary-color);
  border: 1px solid var(--border-amber-20);
}

.insight-body {
  padding: 3rem !important;
}
.insight-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
}
.insight-desc {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.0625rem;
}
.insight-read-more {
  color: var(--primary-color);
  font-weight: 700;
  text-decoration: none;
  transition: var(--transition-smooth);
}
.insight-read-more:hover {
  text-decoration: underline;
}

.related-section {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}
.related-title {
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.related-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.related-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: var(--transition-smooth);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
}
.related-item:hover {
  background: var(--bg-accent-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateX(4px);
}
.related-icon {
  color: var(--primary-color);
  font-size: 1.125rem;
  flex-shrink: 0;
}
.related-arrow {
  color: var(--text-secondary);
  opacity: 0.5;
  transition: var(--transition-smooth);
}
.related-item:hover .related-arrow {
  color: var(--primary-color);
  opacity: 1;
  transform: translateX(4px);
}

.meta-stack {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition-smooth);
}
.meta-item:last-child {
  border-bottom: none;
}
.meta-item:hover {
  background: var(--bg-accent-light);
}
.meta-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.meta-icon.amber {
  background: var(--bg-accent);
  color: var(--primary-color);
  border: 1px solid var(--border-amber-20);
}
.meta-icon.stone {
  background: var(--bg-color);
  color: var(--text-secondary);
}
.meta-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.meta-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.cta-sidebar {
  background: var(--bg-accent-light);
  border-radius: var(--border-radius);
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border-color);
}
.cta-glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.cta-content {
  padding: 2.5rem;
  position: relative;
}
.cta-eyebrow {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}
.cta-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
}
.cta-text {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
.btn-cta {
  background: var(--primary-color);
  color: white;
  font-weight: 700;
  border: none;
  transition: var(--transition-smooth);
  padding: 12px;
}
.btn-cta:hover {
  transform: translateY(-3px);
  background: var(--primary-hover);
  color: white;
  box-shadow: 0 8px 20px -5px rgba(217, 119, 6, 0.3);
}

@media (max-width: 991px) {
  .data-story-section {
    padding: 3rem 0;
  }
  .insight-image-banner {
    height: 220px;
  }
  .insight-body {
    padding: 2rem 1.5rem !important;
  }
  .insight-title {
    font-size: 1.5rem;
    line-height: 1.3;
  }
  .insight-desc {
    font-size: 0.9375rem;
  }
  .cta-content {
    padding: 2rem 1.5rem;
  }
  .cta-title {
    font-size: 1.35rem;
  }
}

@media (max-width: 480px) {
  .insight-title {
    font-size: 1.25rem;
  }
  .section-label {
    font-size: 0.7rem;
    padding: 4px 12px;
  }
  .meta-item {
    padding: 1rem;
    gap: 12px;
  }
  .meta-icon {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
  .meta-value {
    font-size: 0.9rem;
  }
}
</style>
