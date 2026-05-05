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

      <RouterLink v-if="!auth.isAuthenticated" class="btn ghost" to="/login">
        Masuk
      </RouterLink>

      <RouterLink v-if="!auth.isAuthenticated" class="btn primary" to="/register">
        Daftar
      </RouterLink>

      <button v-else class="btn ghost" type="button" @click="handleLogout">
        Keluar
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);

  border-bottom: 1px solid rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;

  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
}

/* BRAND */
.brand {
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: 800;
  font-size: 25px;
  text-decoration: none;
  color: #111;
}

.brand-mark {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;

  border-radius: 10px;
  color: white;
  font-weight: bold;

  background: linear-gradient(135deg, #6366f1, #06b6d4);
  box-shadow: 0 6px 15px rgba(99,102,241,0.3);
}

/* NAV LINKS */
.nav-links {
  display: flex;
  gap: 50px;
}

.nav-links a {
  text-decoration: none;
  color: #444;
  font-weight: bold;
  position: relative;
  transition: 0.25s ease;
  padding: 6px 4px;
}

.nav-links a:hover {
  color: #06b6d4;
}

/* underline animasi */
.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  transition: 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

/* ACTIVE ROUTE (Vue otomatis) */
.router-link-active {
  color: black;
  font-weight: 600;
}

/* ACTIONS */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-badge {
  display: flex;
  flex-direction: column;
  text-align: right;
  font-size: 12px;
  color: #555;
}

.user-badge strong {
  font-size: 14px;
  color: #111;
}

/* BUTTON */
.btn {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: 0.2s ease;
  text-decoration: none;
}

/* primary button */
.btn.primary {
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  color: white;
  box-shadow: 0 8px 20px rgba(99,102,241,0.25);
}

.btn.primary:hover {
  transform: translateY(-1px);
  opacity: 0.95;
}

/* ghost button */
.btn.ghost {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.15);
  color: #333;
}

.btn.ghost:hover {
  background: rgba(0,0,0,0.05);
}

/* RESPONSIVE (optional tapi bagus banget) */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
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
