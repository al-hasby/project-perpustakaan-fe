<template>
  <section class="auth-page">
    <form class="panel auth-panel" @submit.prevent="handleSubmit">
      <div>
        <p class="eyebrow">Register</p>
        <h1>Buat Akun</h1>
      </div>

      <label>
        Nama
        <input v-model="form.name" required placeholder="Nama lengkap" />
      </label>
      <label>
        Email
        <input v-model="form.email" type="email" placeholder="Opsional untuk akun dummy" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" placeholder="Opsional untuk akun dummy" />
      </label>
      <label>
        Role
        <select v-model="form.role">
          <option value="member">Member</option>
          <option value="petugas">Petugas</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <p v-if="error" class="alert error">{{ error }}</p>
      <button class="btn primary full" type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Daftar' }}
      </button>
      <RouterLink to="/login">Sudah punya akun? Masuk</RouterLink>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth.js'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'member',
})

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await register(form)
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
