<template>
  <section class="page">
    <SuccessPopup :message="success" @close="success = ''" />

    <div class="page-header">
      <div>
        <p class="eyebrow">TASK-002</p>
        <h1>{{ auth.isMember ? 'Peminjaman Saya' : 'Peminjaman Buku' }}</h1>
        <p>
          {{
            auth.isMember
              ? 'Pantau buku yang sedang kamu pinjam dan tanggal pengembaliannya.'
              : 'Petugas dan admin mencatat peminjaman serta pengembalian buku.'
          }}
        </p>
      </div>
    </div>

    <div class="mini-summary borrow-summary">
      <article>
        <span>Total Pinjam</span>
        <strong>{{ visibleBorrows.length }}</strong>
      </article>
      <article>
        <span>Menunggu Admin</span>
        <strong>{{ pendingCount }}</strong>
      </article>
      <article>
        <span>Masih Dipinjam</span>
        <strong>{{ activeCount }}</strong>
      </article>
      <article>
        <span>Sudah Kembali</span>
        <strong>{{ returnedCount }}</strong>
      </article>
    </div>

    <BorrowForm v-if="!auth.isMember" :books="books" @submit="saveBorrow" />
    <ReturnForm v-if="!auth.isMember" :borrow="selectedBorrow" @submit="confirmReturn" />

    <div class="panel">
      <div class="toolbar">
        <h2>Daftar Peminjaman</h2>
        <select v-model="statusFilter" class="compact-select">
          <option value="all">Semua status</option>
          <option value="pending">Menunggu admin</option>
          <option value="active">Masih dipinjam</option>
          <option value="returned">Sudah kembali</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>
      <p v-if="error" class="alert error">{{ error }}</p>
      <BorrowTable
        :borrows="filteredBorrows"
        :can-approve="auth.isAdmin"
        :can-return="auth.canReturnBooks"
        @approve="approveSelectedBorrow"
        @reject="rejectSelectedBorrow"
        @return="selectedBorrow = $event"
      />
      <div v-if="!filteredBorrows.length" class="empty-state inline-empty">
        <h2>Belum ada data peminjaman</h2>
        <p>{{ auth.isMember ? 'Pinjam buku dari halaman Buku.' : 'Tambahkan peminjaman lewat form di atas.' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchBooks } from '@/api/books.js'
import { approveBorrow, createBorrow, fetchBorrows, rejectBorrow, returnBorrow } from '@/api/borrow.js'
import { useAuthStore } from '@/stores/auth.js'
import BorrowForm from '@/components/borrow/BorrowForm.vue'
import BorrowTable from '@/components/borrow/BorrowTable.vue'
import ReturnForm from '@/components/borrow/ReturnForm.vue'
import SuccessPopup from '@/components/SuccessPopup.vue'

const auth = useAuthStore()
const borrows = ref([])
const books = ref([])
const selectedBorrow = ref(null)
const statusFilter = ref('all')
const error = ref('')
const success = ref('')

const visibleBorrows = computed(() => {
  if (!auth.isMember) return borrows.value

  return borrows.value.filter((borrow) => {
    return String(borrow.member_id) === String(auth.user?.id) || borrow.borrower_name === auth.user?.name
  })
})

const filteredBorrows = computed(() => {
  if (statusFilter.value === 'active') {
    return visibleBorrows.value.filter((borrow) => ['dipinjam', 'terlambat'].includes(borrow.status) && !borrow.returned_at)
  }

  if (statusFilter.value === 'returned') {
    return visibleBorrows.value.filter((borrow) => borrow.status === 'dikembalikan' || borrow.returned_at)
  }

  if (statusFilter.value === 'pending') {
    return visibleBorrows.value.filter((borrow) => borrow.approval_status === 'pending')
  }

  if (statusFilter.value === 'rejected') {
    return visibleBorrows.value.filter((borrow) => borrow.approval_status === 'rejected')
  }

  return visibleBorrows.value
})

const pendingCount = computed(() => visibleBorrows.value.filter((borrow) => borrow.approval_status === 'pending').length)
const activeCount = computed(() => {
  return visibleBorrows.value.filter((borrow) => ['dipinjam', 'terlambat'].includes(borrow.status) && !borrow.returned_at).length
})
const returnedCount = computed(() => visibleBorrows.value.filter((borrow) => borrow.status === 'dikembalikan' || borrow.returned_at).length)

async function loadBorrows() {
  try {
    const [borrowData, bookData] = await Promise.all([fetchBorrows(), fetchBooks()])
    borrows.value = borrowData
    books.value = bookData
  } catch (err) {
    error.value = err.message
  }
}

async function saveBorrow(payload) {
  try {
    await createBorrow(payload)
    success.value = 'Peminjaman berhasil disimpan.'
    error.value = ''
    await loadBorrows()
  } catch (err) {
    error.value = err.message
  }
}

async function approveSelectedBorrow(borrow) {
  try {
    await approveBorrow(borrow.id, borrow.book_condition || 'aman')
    success.value = 'Peminjaman berhasil disetujui.'
    error.value = ''
    await loadBorrows()
  } catch (err) {
    error.value = err.message
  }
}

async function rejectSelectedBorrow(borrow) {
  try {
    await rejectBorrow(borrow.id)
    success.value = 'Peminjaman berhasil ditolak.'
    error.value = ''
    await loadBorrows()
  } catch (err) {
    error.value = err.message
  }
}

async function confirmReturn(payload) {
  if (!selectedBorrow.value) return

  try {
    await returnBorrow(selectedBorrow.value.id, payload.returned_at, payload.book_condition)
    success.value = 'Pengembalian berhasil diproses.'
    error.value = ''
    selectedBorrow.value = null
    await loadBorrows()
  } catch (err) {
    error.value = err.message
  }
}

onMounted(loadBorrows)
</script>
