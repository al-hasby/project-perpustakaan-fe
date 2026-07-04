<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <h1>Create Account</h1>
        <p>Register to access the library system</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="form.username" type="text" placeholder="Choose a username" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="form.password" type="password" placeholder="Create a password" required minlength="6" />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirm your password" required />
          <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
        </div>

        <p v-if="error" class="alert alert-error">{{ error }}</p>

        <button class="btn btn-primary btn-full" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account? <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth.js'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const confirmPassword = ref('')
const form = reactive({
  username: '',
  password: '',
})

const passwordError = computed(() => {
  if (confirmPassword.value && form.password !== confirmPassword.value) {
    return 'Passwords do not match'
  }
  return ''
})

async function handleSubmit() {
  error.value = ''

  if (form.password !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true

  try {
    await register({
      name: form.username,
      username: form.username,
      password: form.password,
      role: 'member',
    })
    router.push('/home')
  } catch (err) {
    const msg = err.message || ''
    if (msg.includes('already') || msg.includes('exists') || msg.includes('duplicate')) {
      error.value = 'Username already taken'
    } else {
      error.value = 'Registration failed. Please try again later.'
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

.field-error {
  font-size: 12px;
  color: var(--color-danger);
  margin-top: 4px;
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
