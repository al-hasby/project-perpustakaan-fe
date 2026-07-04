<template>
  <div class="page">
    <div class="welcome-header">
      <h1>Hello, {{ username }}! 👋</h1>
      <p>{{ subtitle }}</p>
    </div>

    <div v-if="loading" class="stats-grid">
      <div v-for="n in 4" :key="n" class="stat-card">
        <div class="skeleton" style="width: 80px; height: 14px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 50px; height: 32px;"></div>
      </div>
    </div>

    <div v-else-if="statsError" class="empty-state">
      <div class="empty-icon">⚠️</div>
      <h3>Failed to load dashboard</h3>
      <p>{{ statsError }}</p>
      <button class="btn btn-primary" type="button" @click="loadDashboard">Retry</button>
    </div>

    <div v-else class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
      </div>
    </div>

    <div v-if="showQuickActions" class="quick-actions">
      <RouterLink v-for="action in quickActions" :key="action.label" :to="action.to" class="quick-action-card">
        <div class="qa-icon" v-html="action.icon"></div>
        <div class="qa-info">
          <h4>{{ action.label }}</h4>
          <span>{{ action.desc }}</span>
        </div>
      </RouterLink>
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

const subtitle = computed(() => {
  if (auth.isAdmin) return 'Manage and monitor the library system'
  if (auth.isPetugas) return 'Manage book inventory and borrowing'
  return 'Browse and borrow books from the library'
})

const showQuickActions = computed(() => {
  return !loading.value && !statsError.value
})

const stats = computed(() => {
  if (!dashboardData.value && !booksData.value.length) return []

  if (auth.isAdmin && dashboardData.value) {
    const d = dashboardData.value
    return [
      { label: 'Total Books', value: d.total_books || 0 },
      { label: 'Total Borrowed', value: d.total_borrowed || d.total_pinjam || 0 },
      { label: 'Returned', value: d.total_returned || d.total_kembali || 0 },
      { label: 'Damaged', value: d.damaged || 0 },
    ]
  }

  if (auth.isPetugas) {
    const totalBooks = booksData.value.length
    const activeBorrows = borrowsData.value.filter(b => ['dipinjam', 'terlambat'].includes(b.status)).length
    const pendingBorrows = borrowsData.value.filter(b => b.approval_status === 'pending').length
    const returnedBorrows = borrowsData.value.filter(b => b.status === 'dikembalikan').length
    return [
      { label: 'Total Books', value: totalBooks },
      { label: 'Currently Borrowed', value: activeBorrows },
      { label: 'Pending Approval', value: pendingBorrows },
      { label: 'Returned', value: returnedBorrows },
    ]
  }

  const availableBooks = booksData.value.filter(b => Number(b.stock) > 0).length
  const myBorrows = borrowsData.value.filter(b => {
    return String(b.member_id) === String(auth.user?.id) || b.borrower_name === auth.user?.name
  })
  const activeLoans = myBorrows.filter(b => ['dipinjam', 'terlambat'].includes(b.status)).length
  return [
    { label: 'Available Books', value: availableBooks },
    { label: 'My Active Loans', value: activeLoans },
    { label: 'Available E-Books', value: ebooksData.value.length },
  ]
})

const quickActions = computed(() => {
  if (auth.isAdmin) {
    return [
      { to: '/books', label: 'Manage Books', desc: 'Add, edit, and manage book catalog', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>' },
      { to: '/borrow', label: 'Manage Borrowing', desc: 'Approve, reject, and track loans', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' },
      { to: '/report', label: 'Reports', desc: 'View library reports and analytics', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
    ]
  }
  if (auth.isPetugas) {
    return [
      { to: '/books', label: 'Manage Books', desc: 'Manage book inventory', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>' },
      { to: '/borrow', label: 'Manage Borrowing', desc: 'Process book returns', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' },
    ]
  }
  return [
    { to: '/books', label: 'Browse Books', desc: 'Explore the book catalog', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>' },
    { to: '/borrow', label: 'My Loans', desc: 'View your borrowed books', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' },
    { to: '/ebooks', label: 'E-Books', desc: 'Read digital books online', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  ]
})

function friendlyError(msg) {
  if (!msg) return 'An unexpected error occurred'
  if (msg === 'INTERNAL_SERVER_ERROR') return 'Server error. Please try again later.'
  if (msg === 'FORBIDDEN') return 'You do not have permission to access this data.'
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
