<template>
  <section class="auth-page">
    <form class="panel auth-panel" @submit.prevent="handleSubmit">
      <div>
        <p class="eyebrow">Login</p>
        <h1>Masuk ke Perpustakaan</h1>
      </div>

      <label>
        Username
        <input v-model="form.username" required placeholder="admin" />
      </label>
      <label>
        Password
        <input v-model="form.password" required type="password" placeholder="Password" />
      </label>

      <p v-if="error" class="alert error">{{ error }}</p>
      <button class="btn primary full" type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Masuk' }}
      </button>
      <p class="muted">Jika belum punya akun, daftar dulu — pendaftaran akan membuat akun member.</p>
    </form>
  </section>
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
    router.push(route.query.redirect || '/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

</script>
