<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
          <line x1="9" y1="16" x2="12" y2="16"/>
        </svg>
        <h1>Library Login</h1>
        <p>Sign in to access the library system</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="form.username" type="text" placeholder="Enter your username" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="form.password" type="password" placeholder="Enter your password" required />
        </div>

        <p v-if="error" class="alert alert-error">{{ error }}</p>

        <button class="btn btn-primary btn-full" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account? <RouterLink to="/register">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/api/auth.js'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({
  username: '',
  password: '',
})

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await login(form)
    router.push('/home')
  } catch (err) {
    const msg = err.message || ''
    if (msg === 'INVALID_CREDENTIALS') {
      error.value = 'Incorrect username or password'
    } else {
      error.value = 'Login failed. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 40px 32px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header svg {
  margin-bottom: 16px;
}

.auth-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.auth-header p {
  font-size: 14px;
  color: var(--color-text-muted);
}

.form-group {
  margin-bottom: 20px;
}

.auth-card form {
  margin-bottom: 16px;
}

.auth-card .btn-full {
  margin-top: 8px;
}

.auth-footer {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
