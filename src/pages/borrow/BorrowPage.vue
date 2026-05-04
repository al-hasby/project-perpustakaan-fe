<template>
  <section class="page">
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

    <div class="mini-summary">
      <article>
        <span>Total Pinjam</span>
        <strong>{{ visibleBorrows.length }}</strong>
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

    <BorrowForm v-if="!auth.isMember" @submit="saveBorrow" />
    <ReturnForm v-if="!auth.isMember" :borrow="selectedBorrow" @submit="confirmReturn" />

    <div class="panel">
      <div class="toolbar">
        <h2>Daftar Peminjaman</h2>
        <select v-model="statusFilter" class="compact-select">
          <option value="all">Semua status</option>
          <option value="active">Masih dipinjam</option>
          <option value="returned">Sudah kembali</option>
        </select>
      </div>
      <p v-if="success" class="alert success">{{ success }}</p>
      <p v-if="error" class="alert error">{{ error }}</p>
      <BorrowTable :borrows="filteredBorrows" :can-return="auth.canReturnBooks" @return="selectedBorrow = $event" />
      <div v-if="!filteredBorrows.length" class="empty-state inline-empty">
        <h2>Belum ada data peminjaman</h2>
        <p>{{ auth.isMember ? 'Pinjam buku dari halaman Buku.' : 'Tambahkan peminjaman lewat form di atas.' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { createBorrow, fetchBorrows, returnBorrow } from '@/api/borrow.js'
import { useAuthStore } from '@/stores/auth.js'
import BorrowForm from '@/components/borrow/BorrowForm.vue'
import BorrowTable from '@/components/borrow/BorrowTable.vue'
import ReturnForm from '@/components/borrow/ReturnForm.vue'

const auth = useAuthStore()
const borrows = ref([])
const selectedBorrow = ref(null)
const statusFilter = ref('all')
const error = ref('')
const success = ref('')

const visibleBorrows = computed(() => {
  if (!auth.isMember) return borrows.value

  return borrows.value.filter((borrow) => {
    return Number(borrow.member_id) === Number(auth.user?.id) || borrow.borrower_name === auth.user?.name
  })
})

const filteredBorrows = computed(() => {
  if (statusFilter.value === 'active') {
    return visibleBorrows.value.filter((borrow) => !borrow.returned_at)
  }

  if (statusFilter.value === 'returned') {
    return visibleBorrows.value.filter((borrow) => borrow.returned_at)
  }

  return visibleBorrows.value
})

const activeCount = computed(() => visibleBorrows.value.filter((borrow) => !borrow.returned_at).length)
const returnedCount = computed(() => visibleBorrows.value.filter((borrow) => borrow.returned_at).length)

async function loadBorrows() {
  try {
    borrows.value = await fetchBorrows()
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

async function confirmReturn() {
  if (!selectedBorrow.value) return

  try {
    await returnBorrow(selectedBorrow.value.id)
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
