<template>
  <div class="insight-card h-100">
    <div class="card-image-wrapper">
      <img :src="urlImage(props.image)" class="card-img" alt="Insight cover" />
      <div class="image-overlay"></div>
      <div
        class="region-badge"
        :style="{ background: badgeColorMap[props.badgeColor] || '#6c757d' }"
      >
        {{ props.region || 'Regional' }}
      </div>

      <div class="topic-tag" v-if="props.topic">
        <i class="bi bi-tag me-1"></i>{{ props.topic }}
      </div>
    </div>
    <div class="card-body-content">
      <h5 class="card-title">
        <router-link :to="`/regional_insight/${props.slug}`" class="title-link">
          {{ props.title }}
        </router-link>
      </h5>

      <div class="card-meta">
        <div class="meta-row" v-if="props.date">
          <i class="bi bi-calendar3 meta-icon"></i>
          <span>{{ formatLongDate(props.date) }}</span>
        </div>
        <div class="meta-row" v-if="props.author">
          <i class="bi bi-person meta-icon"></i>
          <span>{{ props.author }}</span>
        </div>
        <div class="meta-row" v-if="props.location">
          <i class="bi bi-geo-alt meta-icon"></i>
          <span>{{ props.location }}</span>
        </div>
      </div>

      <router-link
        :to="`/regional_insight/${props.slug}`"
        class="btn-premium-cta btn-premium-cta-outline px-4 py-2 mt-auto"
      >
        Lihat Insight
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { API_ENDPOINTS } from '../config/api'
import { formatLongDate } from '../utils/dates'

const props = defineProps({
  id: [String, Number],
  slug: String,
  image: String,
  region: String,
  title: String,
  date: String,
  author: String,
  location: String,
  topic: String,
  badgeColor: { type: String, default: 'success' },
})

function urlImage(image) {
  if (!image) return 'https://placehold.co/600x400/1c1208/f59e0b?text=Insight'
  if (image.startsWith('http')) return image
  return `${API_ENDPOINTS.INSIGHT_IMAGE}/${image}`
}

const badgeColorMap = {
  success: '#16a34a',
  danger: '#dc2626',
  info: '#0891b2',
  warning: '#d97706',
  primary: '#2563eb',
  secondary: '#6c757d',
}
</script>

<style scoped>
.insight-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
}
.insight-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 20px 40px -12px rgba(217, 119, 6, 0.15);
  transform: translateY(-6px);
}

.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #1c1917;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  display: block;
}
.insight-card:hover .card-img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 60%);
  pointer-events: none;
}

.region-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 100px;
  text-transform: uppercase;
}
.topic-tag {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.card-body-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  margin: 0;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.title-link {
  text-decoration: none;
  color: inherit;
  transition: var(--transition-smooth);
}
.insight-card:hover .title-link {
  color: var(--primary-color);
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.meta-icon {
  color: var(--primary-color);
  font-size: 0.875rem;
  flex-shrink: 0;
  width: 16px;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  border: 1px solid var(--primary-color);
  background: transparent;
  padding: 8px 20px;
  border-radius: 100px;
  transition: var(--transition-smooth);
  align-self: flex-start;
  margin-top: auto;
}
.read-more-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}
</style>
