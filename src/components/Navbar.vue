<template>
  <header class="navbar">
    <RouterLink class="brand" to="/">
      <span class="brand-mark">P</span>
      <span>Perpustakaan</span>
    </RouterLink>

    <nav class="nav-links">
      <RouterLink class="nav-item" to="/books">Buku</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" class="nav-item" to="/borrow">Peminjaman</RouterLink>
      <RouterLink v-if="auth.isMember" class="nav-item" to="/ebooks">E-Book</RouterLink>
      <RouterLink v-if="auth.isAdmin" class="nav-item" to="/report">Laporan</RouterLink>
    </nav>

    <div class="nav-actions">
      <RouterLink v-if="auth.isAuthenticated" class="user-badge" to="/profile">
        <span class="avatar">{{ (auth.user?.name || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase() }}</span>
        <div class="user-info">
          <strong>{{ auth.user?.name || 'User' }}</strong>
          <span class="muted">{{ auth.role }}</span>
        </div>
      </RouterLink>
      <div v-if="!auth.isAuthenticated" class="auth-actions">
        <RouterLink class="btn ghost" to="/login">Masuk</RouterLink>
        <RouterLink class="btn primary" to="/register">Daftar</RouterLink>
      </div>
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
