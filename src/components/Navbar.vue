<template>
  <Teleport to="body">
    <div v-if="mobileOpen" class="sidebar-overlay" @click="$emit('close')"></div>
  </Teleport>
  <aside :class="['sidebar', { open: mobileOpen }]">
    <div class="sidebar-brand">
      <svg class="brand-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/>
        <line x1="9" y1="8" x2="15" y2="8"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="12" y2="16"/>
      </svg>
      <span class="brand-text">SMARTEDU</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink class="nav-item" to="/home" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Beranda</span>
      </RouterLink>

      <RouterLink class="nav-item" to="/books" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/>
        </svg>
        <span>Buku</span>
      </RouterLink>

      <RouterLink class="nav-item" to="/borrow" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
        <span>Peminjaman</span>
      </RouterLink>

      <RouterLink v-if="auth.isMember" class="nav-item" to="/ebooks" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span>E-Buku</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" class="nav-item" to="/report" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span>Laporan</span>
      </RouterLink>

      <RouterLink class="nav-item" to="/profile" @click="$emit('close')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Profil</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">{{ userInitials }}</div>
        <div class="user-details">
          <strong>{{ auth.user?.username || auth.user?.name || 'Pengguna' }}</strong>
          <span class="role-badge">{{ auth.role }}</span>
        </div>
      </div>
      <button class="btn btn-danger btn-full logout-btn" type="button" @click="handleLogout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Keluar
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth.js'
import { useAuthStore } from '@/stores/auth.js'

defineProps({
  mobileOpen: { type: Boolean, default: false },
})
defineEmits(['close'])

const router = useRouter()
const auth = useAuthStore()

const userInitials = computed(() => {
  const name = auth.user?.name || auth.user?.username || 'U'
  return name.slice(0, 2).toUpperCase()
})

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar-overlay {
  display: none;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: 30;
  transition: transform 0.25s ease;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid var(--color-border);
}

.brand-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.brand-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #F1F5F9;
}

.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 600;
}

.nav-item svg {
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-details strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.role-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: capitalize;
}

.logout-btn {
  font-size: 13px;
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 29;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
  }

  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
