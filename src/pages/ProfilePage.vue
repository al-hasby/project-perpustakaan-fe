<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Profil</h1>
        <p>Informasi akun Anda</p>
      </div>
    </div>

    <div class="profile-card card">
      <div class="profile-avatar-section">
        <div class="profile-avatar">{{ initials }}</div>
        <div>
          <h2>{{ displayName }}</h2>
          <span :class="['badge', roleBadgeClass]">{{ auth.role }}</span>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-row">
          <span class="detail-label">Nama Pengguna</span>
          <span class="detail-value">{{ auth.user?.username || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Peran</span>
          <span class="detail-value">{{ auth.role || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tipe Akun</span>
          <span class="detail-value">{{ auth.isAdmin ? 'Administrator' : auth.isPetugas ? 'Petugas' : 'Anggota' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">ID Pengguna</span>
          <span class="detail-value">{{ auth.user?.id || '-' }}</span>
        </div>
      </div>

      <div class="profile-actions">
        <button class="btn btn-danger" type="button" @click="showLogoutConfirm = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar
        </button>
      </div>
    </div>

    <ConfirmModal
      v-model="showLogoutConfirm"
      title="Keluar?"
      message="Apakah kamu yakin ingin keluar dari akun ini?"
      confirm-text="Keluar"
      cancel-text="Batal"
      type="danger"
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth.js'
import { useAuthStore } from '@/stores/auth.js'
import { useToastStore } from '@/stores/toast.js'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()
const showLogoutConfirm = ref(false)

const displayName = computed(() => auth.user?.username || auth.user?.name || 'Pengguna')

const initials = computed(() => {
  const name = displayName.value
  return name.slice(0, 2).toUpperCase()
})

const roleBadgeClass = computed(() => {
  if (auth.isAdmin) return 'badge-danger'
  if (auth.isPetugas) return 'badge-warning'
  return 'badge-info'
})

async function handleLogout() {
  try {
    await logout()
    toast.success('Berhasil logout. Sampai jumpa!')
    router.push('/login')
  } catch {
    auth.clearAuth()
    router.push('/login')
  }
}
</script>

<style scoped>
.profile-card {
  max-width: 520px;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: grid;
  place-items: center;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}

.profile-avatar-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.profile-details {
  display: grid;
  gap: 0;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: var(--color-text-muted);
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.profile-actions {
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}
</style>
