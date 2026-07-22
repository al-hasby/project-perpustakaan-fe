<template>
  <div class="page">
    <div class="hero-banner">
      <div class="hero-content">
        <div class="hero-greeting">
          <span class="greeting-wave">👋</span>
          <h1>Selamat {{ timeOfDay }}, {{ username }}!</h1>
        </div>
        <p class="hero-subtitle">{{ subtitle }}</p>
        <p class="hero-date">{{ todayDate }}</p>
      </div>
      <div class="hero-decoration">
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
          <line x1="9" y1="16" x2="12" y2="16"/>
        </svg>
      </div>
    </div>

    <div v-if="loading" class="stats-grid">
      <div v-for="n in 4" :key="n" class="stat-card skeleton-card">
        <div class="skeleton" style="width: 80px; height: 14px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 50px; height: 32px;"></div>
      </div>
    </div>

    <div v-else-if="statsError" class="empty-state">
      <div class="empty-icon">⚠️</div>
      <h3>Gagal memuat dashboard</h3>
      <p>{{ statsError }}</p>
      <button class="btn btn-primary" type="button" @click="loadDashboard">Coba Lagi</button>
    </div>

    <div v-else class="stats-grid">
      <div v-for="(stat, idx) in stats" :key="stat.label" class="stat-card" :class="'stat-' + (idx % 4)">
        <div class="stat-icon" v-html="stat.icon"></div>
        <div class="stat-info">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </div>
    </div>

    <div v-if="showQuickActions" class="section-block">
      <h2 class="section-title">Akses Cepat</h2>
      <div class="quick-actions">
        <RouterLink v-for="action in quickActions" :key="action.label" :to="action.to" class="quick-action-card" :class="'qa-' + action.color">
          <div class="qa-icon-wrap" :class="'qa-icon-' + action.color">
            <div class="qa-icon" v-html="action.icon"></div>
          </div>
          <div class="qa-info">
            <h4>{{ action.label }}</h4>
            <span>{{ action.desc }}</span>
          </div>
          <svg class="qa-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchBooks } from '@/api/books.js'
import { fetchEbooks } from '@/api/ebooks.js'
import { fetchBorrows } from '@/api/borrow.js'
import { fetchReports } from '@/api/report.js'
import { useAuthStore } from '@/stores/auth.js'

const auth = useAuthStore()
const loading = ref(true)
const statsError = ref('')
const dashboardData = ref(null)
const booksData = ref([])
const borrowsData = ref([])
const ebooksData = ref([])

const username = computed(() => auth.user?.username || auth.user?.name || 'User')

const timeOfDay = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Pagi'
  if (h < 17) return 'Siang'
  return 'Malam'
})

const todayDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const subtitle = computed(() => {
  if (auth.isAdmin) return 'Kelola dan pantau seluruh sistem perpustakaan'
  if (auth.isPetugas) return 'Kelola inventaris buku dan peminjaman'
  return 'Jelajahi dan pinjam buku dari perpustakaan'
})

const showQuickActions = computed(() => {
  return !loading.value && !statsError.value
})

const stats = computed(() => {
  if (!dashboardData.value && !booksData.value.length) return []

  if (auth.isAdmin && dashboardData.value) {
    const d = dashboardData.value
    return [
      { label: 'Total Buku', value: d.total_books || 0, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>' },
      { label: 'Sedang Dipinjam', value: d.total_borrowed || d.total_pinjam || 0, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' },
      { label: 'Dikembalikan', value: d.total_returned || d.total_kembali || 0, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' },
      { label: 'Rusak', value: d.damaged || 0, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' },
    ]
  }

  if (auth.isPetugas) {
    const totalBooks = booksData.value.length
    const activeBorrows = borrowsData.value.filter(b => ['dipinjam', 'terlambat'].includes(b.status)).length
    const pendingBorrows = borrowsData.value.filter(b => b.approval_status === 'pending').length
    const returnedBorrows = borrowsData.value.filter(b => b.status === 'dikembalikan').length
    return [
      { label: 'Total Buku', value: totalBooks, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>' },
      { label: 'Sedang Dipinjam', value: activeBorrows, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' },
      { label: 'Menunggu Persetujuan', value: pendingBorrows, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
      { label: 'Dikembalikan', value: returnedBorrows, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' },
    ]
  }

  const availableBooks = booksData.value.filter(b => Number(b.stock) > 0).length
  const myBorrows = borrowsData.value.filter(b => {
    return String(b.member_id) === String(auth.user?.id) || b.borrower_name === auth.user?.name
  })
  const activeLoans = myBorrows.filter(b => ['dipinjam', 'terlambat'].includes(b.status)).length
  return [
    { label: 'Buku Tersedia', value: availableBooks, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>' },
    { label: 'Pinjaman Aktif', value: activeLoans, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' },
    { label: 'E-Books', value: ebooksData.value.length, icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  ]
})

const quickActions = computed(() => {
  const bookIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>'
  const borrowIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>'
  const reportIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
  const ebookIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'

  if (auth.isAdmin) {
    return [
      { to: '/books', label: 'Kelola Buku', desc: 'Tambah, edit, dan kelola katalog buku', icon: bookIcon, color: 'blue' },
      { to: '/borrow', label: 'Kelola Peminjaman', desc: 'Setujui, tolak, dan lacak pinjaman', icon: borrowIcon, color: 'purple' },
      { to: '/report', label: 'Laporan', desc: 'Lihat laporan dan analitik perpustakaan', icon: reportIcon, color: 'green' },
    ]
  }
  if (auth.isPetugas) {
    return [
      { to: '/books', label: 'Kelola Buku', desc: 'Kelola inventaris buku', icon: bookIcon, color: 'blue' },
      { to: '/borrow', label: 'Kelola Peminjaman', desc: 'Proses pengembalian buku', icon: borrowIcon, color: 'purple' },
    ]
  }
  return [
    { to: '/books', label: 'Jelajahi Buku', desc: 'Temukan buku di katalog', icon: bookIcon, color: 'blue' },
    { to: '/borrow', label: 'Pinjaman Saya', desc: 'Lihat buku yang sedang dipinjam', icon: borrowIcon, color: 'purple' },
    { to: '/ebooks', label: 'E-Books', desc: 'Baca buku digital secara online', icon: ebookIcon, color: 'teal' },
  ]
})

function friendlyError(msg) {
  if (!msg) return 'Terjadi kesalahan yang tidak terduga'
  if (msg === 'INTERNAL_SERVER_ERROR') return 'Kesalahan server. Silakan coba lagi nanti.'
  if (msg === 'FORBIDDEN') return 'Anda tidak memiliki izin untuk mengakses data ini.'
  return msg
}

async function loadDashboard() {
  loading.value = true
  statsError.value = ''

  try {
    if (auth.isAdmin) {
      const result = await fetchReports()
      dashboardData.value = result.summary || {}
    } else {
      const results = await Promise.allSettled([fetchBooks(), fetchBorrows()])
      if (results[0].status === 'fulfilled') {
        booksData.value = results[0].value
      }
      if (results[1].status === 'fulfilled') {
        borrowsData.value = results[1].value
      }
      if (results[0].status === 'rejected' && results[1].status === 'rejected') {
        statsError.value = friendlyError(results[0].reason?.message)
      }

      if (auth.isMember) {
        try {
          ebooksData.value = await fetchEbooks()
        } catch {
          ebooksData.value = []
        }
      }
    }
  } catch (err) {
    statsError.value = friendlyError(err.message)
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.page {
  padding: 24px;
  max-width: 1200px;
}

.hero-banner {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #60a5fa 100%);
  border-radius: var(--radius-xl);
  padding: 40px 48px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  color: white;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  z-index: 1;
  opacity: 0.6;
  transform: rotate(10deg);
}

.hero-greeting {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.greeting-wave {
  font-size: 32px;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(15deg); }
}

.hero-greeting h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.hero-subtitle {
  font-size: 15px;
  opacity: 0.85;
  margin-bottom: 6px;
}

.hero-date {
  font-size: 13px;
  opacity: 0.65;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.stat-0 .stat-icon { background: #dbeafe; color: #2563eb; }
.stat-1 .stat-icon { background: #f3e8ff; color: #7c3aed; }
.stat-2 .stat-icon { background: #dcfce7; color: #16a34a; }
.stat-3 .stat-icon { background: #fef3c7; color: #d97706; }

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.1;
}

.section-block {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.quick-action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.quick-action-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.qa-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.qa-icon-blue { background: #dbeafe; color: #2563eb; }
.qa-icon-purple { background: #f3e8ff; color: #7c3aed; }
.qa-icon-green { background: #dcfce7; color: #16a34a; }
.qa-icon-teal { background: #ccfbf1; color: #0d9488; }

.qa-info {
  flex: 1;
  min-width: 0;
}

.qa-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 2px;
}

.qa-info span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.qa-arrow {
  color: var(--color-text-muted);
  opacity: 0;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.quick-action-card:hover .qa-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.skeleton-card {
  min-height: 88px;
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 28px 24px;
  }

  .hero-greeting h1 {
    font-size: 22px;
  }

  .hero-decoration {
    display: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .page {
    padding: 16px;
  }
}
</style>
