<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="cancel">
      <div class="confirm-modal">
        <div class="confirm-icon" :class="'confirm-icon-' + type">
          <div v-html="iconSvg"></div>
        </div>
        <h3 class="confirm-title">{{ title }}</h3>
        <p class="confirm-message">{{ message }}</p>
        <div class="confirm-actions">
          <button class="btn btn-ghost" @click="cancel" :disabled="loading">
            {{ cancelText }}
          </button>
          <button
            :class="['btn', confirmBtnClass]"
            @click="confirm"
            :disabled="loading"
          >
            <svg v-if="loading" class="confirm-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Apakah kamu yakin?' },
  confirmText: { type: String, default: 'Ya' },
  cancelText: { type: String, default: 'Batal' },
  type: { type: String, default: 'danger' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const iconSvg = computed(() => {
  if (props.type === 'danger') {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  }
  if (props.type === 'warning') {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  }
  if (props.type === 'info') {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  }
  return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
})

const confirmBtnClass = computed(() => {
  if (props.type === 'danger') return 'btn-danger'
  if (props.type === 'warning') return 'btn-warning'
  return 'btn-primary'
})

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<style scoped>
.confirm-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
}

.confirm-icon-danger {
  background: #FEE2E2;
  color: #DC2626;
}

.confirm-icon-warning {
  background: #FEF3C7;
  color: #D97706;
}

.confirm-icon-info {
  background: #DBEAFE;
  color: #2563EB;
}

.confirm-icon-success {
  background: #DCFCE7;
  color: #16A34A;
}

.confirm-modal {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.confirm-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.confirm-message {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.confirm-actions .btn {
  min-width: 100px;
}

.btn-warning {
  color: #fff;
  background: var(--color-warning);
  border-color: var(--color-warning);
}

.btn-warning:hover:not(:disabled) {
  background: #B45309;
  border-color: #B45309;
}

.confirm-spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transition */
.modal-enter-active {
  animation: modalIn 0.25s ease;
}

.modal-leave-active {
  animation: modalIn 0.2s ease reverse;
}

@keyframes modalIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-enter-active .confirm-modal {
  animation: modalBoxIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .confirm-modal {
  animation: modalBoxIn 0.2s ease reverse;
}

@keyframes modalBoxIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
