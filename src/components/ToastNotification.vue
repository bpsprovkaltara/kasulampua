<template>
  <Teleport to="body">
    <div class="toast-container" role="alert" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
        >
          <i :class="iconMap[toast.type]" class="toast-icon" aria-hidden="true"></i>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click="remove(toast.id)" aria-label="Tutup notifikasi">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()

const iconMap = {
  success: 'bi bi-check-circle-fill',
  error: 'bi bi-x-circle-fill',
  warning: 'bi bi-exclamation-triangle-fill',
  info: 'bi bi-info-circle-fill',
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: calc(100vw - 48px);
}
.toast-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.15);
  cursor: default;
}
.toast-success {
  background: rgba(22, 163, 74, 0.95);
  color: white;
}
.toast-error {
  background: rgba(220, 38, 38, 0.95);
  color: white;
}
.toast-warning {
  background: rgba(217, 119, 6, 0.95);
  color: white;
}
.toast-info {
  background: rgba(37, 99, 235, 0.95);
  color: white;
}
.toast-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}
.toast-message {
  flex: 1;
  line-height: 1.4;
}
.toast-close {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 6px;
  font-size: 0.75rem;
  flex-shrink: 0;
  transition: color 0.2s;
}
.toast-close:hover {
  color: white;
}

/* Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(60px) scale(0.95);
}
</style>
