import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let toastId = 0

  function add(message, type = 'success', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }

  function success(message, duration = 3000) {
    return add(message, 'success', duration)
  }

  function error(message, duration = 4000) {
    return add(message, 'error', duration)
  }

  function warning(message, duration = 3500) {
    return add(message, 'warning', duration)
  }

  function info(message, duration = 3000) {
    return add(message, 'info', duration)
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function clear() {
    toasts.value = []
  }

  return { toasts, add, success, error, warning, info, remove, clear }
})
