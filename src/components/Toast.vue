<template>
  <div class="toast-container">
    <TransitionGroup tag="div" name="toast" class="toast-list">
      <div
        v-for="t in toastStore.toasts"
        :key="t.id"
        :class="['toast-item', 'toast-' + t.type]"
      >
        <div class="toast-icon" v-html="iconFor(t.type)"></div>
        <span class="toast-message">{{ t.message }}</span>
        <button class="toast-close" @click="toastStore.remove(t.id)">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast.js'

const toastStore = useToastStore()

function iconFor(type) {
  if (type === 'success') {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  }
  if (type === 'error') {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  }
  if (type === 'warning') {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  }
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 380px;
}

.toast-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  backdrop-filter: blur(8px);
}

.toast-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  color: inherit;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.06);
}

/* Types */
.toast-success {
  background: #F0FDF4;
  color: #166534;
  border-color: #BBF7D0;
}

.toast-success .toast-icon {
  color: #16A34A;
}

.toast-error {
  background: #FEF2F2;
  color: #991B1B;
  border-color: #FECACA;
}

.toast-error .toast-icon {
  color: #DC2626;
}

.toast-warning {
  background: #FFFBEB;
  color: #92400E;
  border-color: #FDE68A;
}

.toast-warning .toast-icon {
  color: #D97706;
}

.toast-info {
  background: #EFF6FF;
  color: #1E40AF;
  border-color: #BFDBFE;
}

.toast-info .toast-icon {
  color: #2563EB;
}

/* Transition */
.toast-enter-active {
  animation: toastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  animation: toastSlideOut 0.25s ease forwards;
  position: absolute;
  right: 0;
  left: 0;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(40px) scale(0.9);
  }
}

@media (max-width: 480px) {
  .toast-container {
    left: 12px;
    right: 12px;
    max-width: none;
  }
}
</style>
