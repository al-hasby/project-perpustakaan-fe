<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  if (username.value === '' || password.value === '') {
    error.value = 'Username dan password wajib diisi.'
    return
  }
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    const data = await response.json()
    if (response.ok && data.success) {
      error.value = ''
      // buat token nanti
      router.push('/')
    } else {
      error.value = data.message || 'Login gagal.'
    }
  } catch (e) {
    error.value = 'Terjadi kesalahan pada server.'
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Login Perpustakaan</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username</label>
        <input id="username" v-model="username" type="text" placeholder="Masukkan username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" placeholder="Masukkan password" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  text-align: center;
}
h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}
.form-group {
  margin-bottom: 1.2rem;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  color: #333;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
button {
  width: 100%;
  padding: 0.7rem;
  background: #2c3e50;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #34495e;
}
.error {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
</style>
