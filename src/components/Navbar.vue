<template>
  <header class="navbar">
    <RouterLink class="brand" to="/">
      <span class="brand-mark">P</span>
      <span>Perpustakaan</span>
    </RouterLink>

    <nav class="nav-links">
      <RouterLink to="/books">Buku</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" to="/borrow">Peminjaman</RouterLink>
      <RouterLink v-if="auth.role === 'member'" to="/ebooks">E-Book</RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/report">Laporan</RouterLink>
    </nav>

    <div class="nav-actions">
      <span v-if="auth.isAuthenticated" class="user-badge">
        <strong>{{ auth.user?.name || 'User' }}</strong>
        <span>{{ auth.role }}</span>
      </span>
      <RouterLink v-if="!auth.isAuthenticated" class="btn ghost" to="/login">Masuk</RouterLink>
      <RouterLink v-if="!auth.isAuthenticated" class="btn primary" to="/register">Daftar</RouterLink>
      <button v-else class="btn ghost" type="button" @click="handleLogout">Keluar</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth.js'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>
