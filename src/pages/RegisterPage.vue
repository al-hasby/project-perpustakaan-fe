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
        <input v-model="form.email" type="email" placeholder="Email" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" placeholder="Password" />
      </label>
      <!-- Role diset otomatis ke 'member' untuk pendaftaran publik -->
      <input type="hidden" v-model="form.role" />

      <p v-if="error" class="alert error">{{ error }}</p>
      <button class="btn primary full" type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Daftar' }}
      </button>
      <RouterLink to="/login">Sudah punya akun? Masuk</RouterLink>
      <SuccessPopup v-if="successMessage" :message="successMessage" @close="successMessage = ''" />
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth.js'
import SuccessPopup from '@/components/SuccessPopup.vue'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'member',
})
const successMessage = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    const res = await register(form)
    successMessage.value = 'Akun berhasil dibuat. Anda sudah masuk.'

    setTimeout(() => {
      router.push('/')
    }, 900)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
