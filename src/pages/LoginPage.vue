<template>
  <div class="auth-wrapper">
    <div class="auth-left">
      <div class="auth-left-content">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
        <div class="brand-section">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/>
            <line x1="9" y1="8" x2="15" y2="8"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="12" y2="16"/>
          </svg>
          <h1>Perpustakaan</h1>
          <p>Sistem Manajemen Perpustakaan Digital</p>
        </div>
        <div class="features-list">
          <div class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Koleksi buku lengkap & terbaru</span>
          </div>
          <div class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Peminjaman mudah & cepat</span>
          </div>
          <div class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Akses e-book kapan saja</span>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-header">
          <div class="mobile-brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="9" y1="12" x2="15" y2="12"/>
              <line x1="9" y1="16" x2="12" y2="16"/>
            </svg>
          </div>
          <h2>Selamat Datang</h2>
          <p>Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input id="username" v-model="form.username" type="text" placeholder="Masukkan username" required />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="password" v-model="form.password" type="password" placeholder="Masukkan password" required />
            </div>
          </div>

          <p v-if="error" class="alert alert-error">{{ error }}</p>

          <button class="btn btn-primary btn-full btn-lg" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>

        <div class="demo-accounts">
          <p class="demo-label">Demo Accounts:</p>
          <div class="demo-chips">
            <button class="demo-chip" type="button" @click="fillDemo('admin', 'admin123')">
              <span class="chip-role admin">Admin</span>
            </button>
            <button class="demo-chip" type="button" @click="fillDemo('petugas', 'petugas123')">
              <span class="chip-role petugas">Petugas</span>
            </button>
            <button class="demo-chip" type="button" @click="fillDemo('budi', 'budi123')">
              <span class="chip-role member">Budi</span>
            </button>
          </div>
        </div>

        <p class="auth-footer">
          Belum punya akun? <RouterLink to="/register">Daftar sekarang</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth.js'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({
  username: '',
  password: '',
})

function fillDemo(username, password) {
  form.username = username
  form.password = password
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await login(form)
    router.push('/home')
  } catch (err) {
    const msg = err.message || ''
    if (msg === 'INVALID_CREDENTIALS') {
      error.value = 'Username atau password salah'
    } else {
      error.value = 'Gagal masuk. Silakan coba lagi.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  background: var(--color-bg);
}

.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 48px;
}

.auth-left-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 400px;
}

.floating-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -80px;
  right: -80px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -60px;
  left: -60px;
  animation: float 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 20%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.brand-section {
  margin-bottom: 48px;
}

.brand-section svg {
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
}

.brand-section h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.brand-section p {
  font-size: 16px;
  opacity: 0.85;
  line-height: 1.5;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  opacity: 0.9;
}

.feature-item svg {
  flex-shrink: 0;
  background: rgba(255,255,255,0.2);
  padding: 4px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
}

.auth-right {
  width: 480px;
  min-width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  margin-bottom: 36px;
}

.mobile-brand {
  display: none;
  margin-bottom: 24px;
}

.auth-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 6px;
}

.auth-header p {
  font-size: 14px;
  color: var(--color-text-muted);
}

.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.input-wrapper input {
  padding-left: 40px;
  height: 44px;
  border-radius: var(--radius-md);
}

.btn-lg {
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--radius-md);
  margin-top: 8px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transition: all 0.25s ease;
}

.btn-lg:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}

.auth-card form {
  margin-bottom: 24px;
}

.demo-accounts {
  margin-bottom: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.demo-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.demo-chip {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-chip:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.chip-role {
  font-size: 12px;
  font-weight: 600;
}

.chip-role.admin { color: #7c3aed; }
.chip-role.petugas { color: #0891b2; }
.chip-role.member { color: #16a34a; }

.auth-footer {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .auth-wrapper {
    flex-direction: column;
  }

  .auth-left {
    min-height: 200px;
    padding: 32px 24px;
  }

  .auth-left-content {
    text-align: center;
  }

  .brand-section h1 {
    font-size: 24px;
  }

  .features-list {
    display: none;
  }

  .auth-right {
    width: 100%;
    min-width: unset;
    padding: 32px 24px;
  }

  .mobile-brand {
    display: block;
    text-align: center;
  }
}
</style>
