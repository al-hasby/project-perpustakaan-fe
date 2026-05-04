<template>
  <section class="auth-page">
    <form class="panel auth-panel" @submit.prevent="handleSubmit">
      <div>
        <p class="eyebrow">Login</p>
        <h1>Masuk ke Perpustakaan</h1>
      </div>

      <label>
        Email / Username
        <input v-model="form.email" placeholder="Kosongkan untuk dummy member" />
      </label>
      <label>
        Password
        Password
        <input v-model="form.password" type="password" placeholder="Boleh kosong untuk dummy" />
      </label>

      <p v-if="error" class="alert error">{{ error }}</p>
      <button class="btn primary full" type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Masuk' }}
      </button>
      <div class="dummy-actions">
        <button class="btn ghost" type="button" @click="loginAs('admin')">Admin</button>
        <button class="btn ghost" type="button" @click="loginAs('petugas')">Petugas</button>
        <button class="btn ghost" type="button" @click="loginAs('member')">Member</button>
      </div>
      <RouterLink to="/register">Belum punya akun? Daftar</RouterLink>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login, loginDummy } from '@/api/auth.js'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({
  email: '',
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

async function loginAs(role) {
  await loginDummy(role)
  router.push(route.query.redirect || '/')
}
</script>
