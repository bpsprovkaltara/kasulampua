import { reactive } from 'vue'

const toasts = reactive([])
let nextId = 0

export function useToast() {
  const show = (message, type = 'info', duration = 4000) => {
    const id = nextId++
    toasts.push({ id, message, type })
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  const remove = (id) => {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
  }

  const success = (msg, duration) => show(msg, 'success', duration)
  const error = (msg, duration) => show(msg, 'error', duration)
  const warning = (msg, duration) => show(msg, 'warning', duration)
  const info = (msg, duration) => show(msg, 'info', duration)

  return { toasts, show, remove, success, error, warning, info }
}
