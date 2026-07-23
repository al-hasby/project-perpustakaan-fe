<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>{{ auth.isMember ? 'Peminjaman Saya' : 'Peminjaman' }}</h1>
        <p>{{ auth.isMember ? 'Lacak buku yang dipinjam dan jatuh tempo' : 'Kelola peminjaman dan pengembalian buku' }}</p>
      </div>
      <div v-if="auth.isAdmin || auth.isPetugas" class="page-header-actions">
        <button class="btn btn-primary" type="button" @click="showAddModal = true">
          + Peminjaman Baru
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total</div>
        <div class="stat-value">{{ visibleBorrows.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Menunggu</div>
        <div class="stat-value">{{ pendingCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Aktif</div>
        <div class="stat-value">{{ activeCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Dikembalikan</div>
        <div class="stat-value">{{ returnedCount }}</div>
      </div>
    </div>

    <div class="filter-bar">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        class="filter-tab"
        :class="{ active: statusFilter === opt.value }"
        @click="statusFilter = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <div v-if="error" class="alert alert-error" style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="flex:1">{{ error }}</span>
      <button class="btn btn-ghost btn-sm" type="button" @click="loadData">Coba Lagi</button>
    </div>

    <div v-if="loading" class="card">
      <div v-for="n in 4" :key="n" class="skeleton" style="height: 48px; margin-bottom: 8px;"></div>
    </div>

    <div v-else-if="!filteredBorrows.length" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>Peminjaman tidak ditemukan</h3>
      <p>{{ auth.isMember ? 'Jelajahi buku untuk dipinjam dari perpustakaan' : 'Tidak ada data peminjaman yang sesuai dengan filter' }}</p>
    </div>

    <div v-else class="card" style="padding: 0; overflow: hidden;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Buku</th>
              <th>Peminjam</th>
              <th>Tanggal Pinjam</th>
              <th>Jatuh Tempo</th>
              <th>Kondisi</th>
              <th>Status</th>
              <th v-if="showActions">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="borrow in filteredBorrows" :key="borrow.id">
              <td><strong>{{ borrow.book_title || borrow.book_id }}</strong></td>
              <td>{{ borrow.borrower_name || '-' }}</td>
              <td>{{ borrow.borrow_date || '-' }}</td>
              <td>{{ borrow.due_date || '-' }}</td>
              <td>
                <span :class="['badge', conditionClass(borrow.book_condition)]">
                  {{ conditionLabel(borrow.book_condition) }}
                </span>
              </td>
              <td>
                <span :class="['badge', statusBadgeClass(borrow)]">
                  {{ statusLabel(borrow) }}
                </span>
              </td>
              <td v-if="showActions" class="table-actions">
                <button
                  v-if="canApprove(borrow)"
                  class="btn btn-primary btn-sm"
                  type="button"
                  @click="handleApprove(borrow)"
                >
                  Setujui
                </button>
                <button
                  v-if="canReject(borrow)"
                  class="btn btn-danger btn-sm"
                  type="button"
                  @click="handleReject(borrow)"
                >
                  Tolak
                </button>
                <button
                  v-if="canReturnAction(borrow)"
                  class="btn btn-primary btn-sm"
                  type="button"
                  @click="openReturnModal(borrow)"
                >
                  Kembalikan
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-box">
          <button class="modal-close" type="button" @click="showAddModal = false">✕</button>
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">Peminjaman Baru</h2>
          <form @submit.prevent="submitNewLoan">
            <div class="form-grid">
              <div class="form-group span-2">
                <label for="loan-book">Buku *</label>
                <select id="loan-book" v-model="newLoan.book_id" required>
                  <option value="" disabled>Pilih buku</option>
                  <option v-for="book in availableBooks" :key="book.id" :value="book.id">
                    {{ book.title }} ({{ book.stock }} stok)
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="loan-borrower">Nama Peminjam *</label>
                <input id="loan-borrower" v-model="newLoan.borrower_name" required placeholder="Nama" />
              </div>
              <div class="form-group">
                <label for="loan-member-id">ID Anggota</label>
                <input id="loan-member-id" v-model="newLoan.member_id" type="number" placeholder="Opsional" />
              </div>
              <div class="form-group">
                <label for="loan-date">Tanggal Pinjam *</label>
                <input id="loan-date" v-model="newLoan.tanggal_pinjam" type="date" required />
              </div>
              <div class="form-group">
                <label for="loan-due">Jatuh Tempo *</label>
                <input id="loan-due" v-model="newLoan.tanggal_kembali" type="date" required />
              </div>
              <div class="form-group span-2">
                <label for="loan-condition">Kondisi Buku</label>
                <select id="loan-condition" v-model="newLoan.kondisi_buku">
                  <option value="aman">Aman</option>
                  <option value="sedikit_rusak">Sedikit Rusak</option>
                  <option value="rusak">Rusak</option>
                </select>
              </div>
            </div>
            <p v-if="loanError" class="alert alert-error" style="margin-top: 12px;">{{ loanError }}</p>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="btn btn-ghost" type="button" @click="showAddModal = false">Batal</button>
              <button class="btn btn-primary" type="submit" :disabled="saving">
                {{ saving ? 'Menyimpan...' : 'Buat Peminjaman' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="returnBook" class="modal-overlay" @click.self="closeReturnModal">
        <div class="modal-box">
          <button class="modal-close" type="button" @click="closeReturnModal">✕</button>
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">Kembalikan Buku</h2>
          <p style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 20px;">
            {{ returnBook.book_title || returnBook.book_id }} — {{ returnBook.borrower_name }}
          </p>
          <form @submit.prevent="submitReturn">
            <div class="form-group" style="margin-bottom: 16px;">
              <label for="return-date">Tanggal Kembali *</label>
              <input id="return-date" v-model="returnPayload.dikembalikan_pada" type="date" required />
            </div>
            <div class="form-group" style="margin-bottom: 16px;">
              <label for="return-condition">Kondisi Buku *</label>
              <select id="return-condition" v-model="returnPayload.kondisi_buku" required>
                <option value="aman">Aman</option>
                <option value="sedikit_rusak">Sedikit Rusak</option>
                <option value="rusak">Rusak</option>
              </select>
            </div>
            <p v-if="returnError" class="alert alert-error" style="margin-bottom: 12px;">{{ returnError }}</p>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <button class="btn btn-ghost" type="button" @click="closeReturnModal">Batal</button>
              <button class="btn btn-primary" type="submit" :disabled="saving">
                {{ saving ? 'Memproses...' : 'Konfirmasi Pengembalian' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchBooks } from '@/api/books.js'
import { createBorrow, fetchBorrows, approveBorrow, rejectBorrow, returnBorrow } from '@/api/borrow.js'
import { useAuthStore } from '@/stores/auth.js'
import { useToastStore } from '@/stores/toast.js'

const auth = useAuthStore()
const toast = useToastStore()
const borrows = ref([])
const books = ref([])
const loading = ref(true)
const error = ref('')
const statusFilter = ref('all')
const showAddModal = ref(false)
const saving = ref(false)
const loanError = ref('')
const returnBook = ref(null)
const returnError = ref('')

const today = new Date().toISOString().slice(0, 10)
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)

const newLoan = reactive({
  book_id: '',
  borrower_name: '',
  member_id: '',
  tanggal_pinjam: today,
  tanggal_kembali: nextWeek,
  kondisi_buku: 'aman',
})

const returnPayload = reactive({
  dikembalikan_pada: today,
  kondisi_buku: 'aman',
})

const filterOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'active', label: 'Aktif' },
  { value: 'returned', label: 'Dikembalikan' },
  { value: 'rejected', label: 'Ditolak' },
]

const visibleBorrows = computed(() => borrows.value)

const filteredBorrows = computed(() => {
  let list = visibleBorrows.value
  const f = statusFilter.value
  if (f === 'pending') {
    list = list.filter(b => b.approval_status === 'pending')
  } else if (f === 'active') {
    list = list.filter(b => ['dipinjam', 'terlambat'].includes(b.status) && !b.returned_at)
  } else if (f === 'returned') {
    list = list.filter(b => b.status === 'dikembalikan' || b.returned_at)
  } else if (f === 'rejected') {
    list = list.filter(b => b.approval_status === 'rejected')
  }
  return list
})

const pendingCount = computed(() => visibleBorrows.value.filter(b => b.approval_status === 'pending').length)
const activeCount = computed(() => visibleBorrows.value.filter(b => ['dipinjam', 'terlambat'].includes(b.status) && !b.returned_at).length)
const returnedCount = computed(() => visibleBorrows.value.filter(b => b.status === 'dikembalikan' || b.returned_at).length)

const showActions = computed(() => auth.isAdmin || auth.isPetugas)

const availableBooks = computed(() => books.value.filter(b => Number(b.stock) > 0))

function statusLabel(borrow) {
  if (borrow.returned_at || borrow.status === 'dikembalikan') return 'Dikembalikan'
  if (borrow.approval_status === 'pending') return 'Menunggu'
  if (borrow.approval_status === 'rejected') return 'Ditolak'
  if (borrow.status === 'terlambat') return 'Terlambat'
  return 'Dipinjam'
}

function statusBadgeClass(borrow) {
  if (borrow.returned_at || borrow.status === 'dikembalikan') return 'badge-success'
  if (borrow.approval_status === 'rejected') return 'badge-danger'
  if (borrow.approval_status === 'pending') return 'badge-warning'
  if (borrow.status === 'terlambat') return 'badge-danger'
  return 'badge-info'
}

function conditionClass(cond) {
  if (cond === 'rusak') return 'badge-danger'
  if (cond === 'sedikit_rusak') return 'badge-warning'
  return 'badge-success'
}

function conditionLabel(cond) {
  if (cond === 'sedikit_rusak') return 'Sedikit Rusak'
  if (cond === 'rusak') return 'Rusak'
  return 'Aman'
}

function canApprove(borrow) {
  return auth.isAdmin && borrow.approval_status === 'pending'
}

function canReject(borrow) {
  return auth.isAdmin && borrow.approval_status === 'pending'
}

function canReturnAction(borrow) {
  return auth.canReturnBooks && ['dipinjam', 'terlambat'].includes(borrow.status) && !borrow.returned_at
}

function friendlyError(msg) {
  if (!msg) return 'Terjadi kesalahan yang tidak terduga'
  if (msg === 'INTERNAL_SERVER_ERROR') return 'Kesalahan server. Silakan coba lagi nanti.'
  if (msg === 'TOKEN_REQUIRED' || msg === 'INVALID_TOKEN' || msg === 'UNAUTHENTICATED') return 'Sesi telah berakhir. Silakan masuk kembali.'
  if (msg === 'FORBIDDEN') return 'Anda tidak memiliki izin untuk mengakses data ini.'
  return msg
}

function decodeMemberId() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const [, payload] = token.split('.')
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

async function loadData() {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/login'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const results = await Promise.allSettled([fetchBorrows(), fetchBooks()])
    if (results[0].status === 'fulfilled') {
      let data = results[0].value
      if (auth.isMember) {
        const tokenPayload = decodeMemberId()
        const memberId = String(tokenPayload?.id || auth.user?.id || '')
        data = data.filter(b => String(b.member_id) === memberId)
      }
      borrows.value = data
    } else {
      const errMsg = results[0].reason?.message
      console.log('[BorrowPage] fetchBorrows error:', results[0].reason)
      if (errMsg === 'Cannot connect to server') {
        error.value = 'Tidak dapat terhubung ke server'
      } else if (errMsg === 'FORBIDDEN') {
        error.value = 'Anda tidak memiliki izin untuk mengakses data ini.'
      } else {
        error.value = friendlyError(errMsg)
      }
    }
    if (results[1].status === 'fulfilled') {
      books.value = results[1].value
    }
  } finally {
    loading.value = false
  }
}

async function submitNewLoan() {
  saving.value = true
  loanError.value = ''
  try {
    await createBorrow({
      borrower_name: newLoan.borrower_name,
      id_buku: newLoan.book_id,
      tanggal_pinjam: newLoan.tanggal_pinjam,
      tanggal_kembali: newLoan.tanggal_kembali,
      kondisi_buku: newLoan.kondisi_buku,
      member_id: newLoan.member_id || null,
    })
    showAddModal.value = false
    toast.success('Peminjaman berhasil dibuat')
    await loadData()
  } catch (err) {
    loanError.value = friendlyError(err.message)
    toast.error(friendlyError(err.message))
  } finally {
    saving.value = false
  }
}

async function handleApprove(borrow) {
  try {
    await approveBorrow(borrow.id, borrow.book_condition || 'aman')
    toast.success('Peminjaman disetujui')
    await loadData()
  } catch (err) {
    error.value = friendlyError(err.message)
    toast.error(friendlyError(err.message))
    setTimeout(() => { error.value = '' }, 3000)
  }
}

async function handleReject(borrow) {
  try {
    await rejectBorrow(borrow.id)
    toast.warning('Peminjaman ditolak')
    await loadData()
  } catch (err) {
    error.value = friendlyError(err.message)
    toast.error(friendlyError(err.message))
    setTimeout(() => { error.value = '' }, 3000)
  }
}

function openReturnModal(borrow) {
  returnBook.value = borrow
  returnPayload.dikembalikan_pada = today
  returnPayload.kondisi_buku = borrow.book_condition || 'aman'
  returnError.value = ''
}

function closeReturnModal() {
  returnBook.value = null
  returnError.value = ''
}

async function submitReturn() {
  if (!returnBook.value) return
  saving.value = true
  returnError.value = ''
  try {
    await returnBorrow(
      returnBook.value.id,
      returnPayload.dikembalikan_pada,
      returnPayload.kondisi_buku,
    )
    closeReturnModal()
    toast.success('Buku berhasil dikembalikan')
    await loadData()
  } catch (err) {
    returnError.value = friendlyError(err.message)
    toast.error(friendlyError(err.message))
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.span-2 {
    grid-column: span 1;
  }

  .filter-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
  }

  .filter-tab {
    flex-shrink: 0;
    font-size: 12px;
    padding: 5px 12px;
  }
}
</style>
