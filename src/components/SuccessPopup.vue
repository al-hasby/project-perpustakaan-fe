<template>
  <Transition name="success-popup">
    <aside v-if="message" class="success-popup" role="status" aria-live="polite">
      <span class="success-icon" aria-hidden="true"></span>
      <p>{{ message }}</p>
      <button class="close-button" type="button" aria-label="Tutup notifikasi" @click="$emit('close')">
        <span aria-hidden="true"></span>
      </button>
    </aside>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 2600,
  },
})

const emit = defineEmits(['close'])

let timerId

function clearTimer() {
  if (timerId) {
    clearTimeout(timerId)
    timerId = undefined
  }
}

watch(
  () => props.message,
  (message) => {
    clearTimer()

    if (message) {
      timerId = setTimeout(() => {
        clearTimer()
        emit('close')
      }, props.duration)
    }
  },
  { immediate: true },
)

onBeforeUnmount(clearTimer)
</script>

<style scoped>
.success-popup {
  position: fixed;
  top: 84px;
  right: clamp(1rem, 4vw, 2rem);
  z-index: 60;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  width: min(420px, calc(100vw - 2rem));
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.85rem;
  color: #14532d;
  background: #f0fdf4;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.success-icon {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 999px;
  background: #16a34a;
}

.success-icon::before {
  width: 11px;
  height: 6px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  content: '';
  transform: rotate(-45deg) translate(1px, -1px);
}

.success-popup p {
  margin: 0;
  font-weight: 800;
  line-height: 1.35;
}

.close-button {
  display: grid;
  width: 28px;
  height: 28px;
  position: relative;
  place-items: center;
  border: 0;
  border-radius: 8px;
  color: #166534;
  cursor: pointer;
  background: transparent;
  font-weight: 900;
}

.close-button span,
.close-button span::after {
  position: absolute;
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.close-button span {
  transform: rotate(45deg);
}

.close-button span::after {
  transform: rotate(90deg);
}

.close-button:hover {
  background: #dcfce7;
}

.success-popup-enter-active,
.success-popup-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.success-popup-enter-from,
.success-popup-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 640px) {
  .success-popup {
    top: 76px;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}
</style>
