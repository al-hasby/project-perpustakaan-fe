<template>
  <section class="page">
    <SuccessPopup :message="success" @close="success = ''" />

    <div class="page-header">
      <div>
        <p class="eyebrow">TASK-001</p>
        <h1>Manajemen Data Buku</h1>
        <p>Admin mengelola data buku. Member dapat melihat rincian dan meminjam buku.</p>
      </div>
      <button v-if="auth.isAdmin && !showForm" class="btn primary" type="button" @click="openCreate">
        Tambah Buku
      </button>
    </div>

    <BookForm
      v-if="auth.isAdmin && showForm"
      :model-value="selectedBook"
      @submit="saveBook"
      @cancel="closeForm"
    />

    <div class="mini-summary">
      <article>
        <span>Total Buku</span>
        <strong>{{ books.length }}</strong>
      </article>
      <article>
        <span>Total Stok</span>
        <strong>{{ totalStock }}</strong>
      </article>
      <article>
        <span>Bisa Dipinjam</span>
        <strong>{{ availableBooks }}</strong>
      </article>
    </div>

    <div class="panel catalog-toolbar">
      <input v-model="search" placeholder="Cari judul, penulis, penerbit, atau kategori" />
      <select v-model="selectedCategory">
        <option value="">Semua kategori</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <button class="btn ghost" type="button" @click="resetFilters">Reset</button>
    </div>

    <div class="catalog-grid">
      <article v-for="book in filteredBooks" :key="`card-${book.id}`" class="book-card">
        <button class="book-card-click" type="button" @click="openDetail(book)">
          <div class="book-cover card-cover">
            <img v-if="book.cover_url" :src="book.cover_url" alt="" />
            <div v-else class="cover-fallback">{{ getInitial(book.title) }}</div>
          </div>
        </button>
        <div class="book-card-body">
          <span class="category-chip">{{ book.category || 'Umum' }}</span>
          <h2>{{ book.title }}</h2>
          <p>{{ book.author }}</p>
          <div class="card-footer">
            <span>{{ book.year || '-' }}</span>
            <span>{{ book.stock }} stok</span>
          </div>
          <button class="btn ghost full" type="button" @click="openDetail(book)">Rincian</button>
        </div>
      </article>
    </div>

    <div v-if="!filteredBooks.length" class="panel empty-state">
      <h2>Buku tidak ditemukan</h2>
      <p>Coba ganti kata kunci atau kategori pencarian.</p>
      <button class="btn primary" type="button" @click="resetFilters">Tampilkan Semua</button>
    </div>

    <div v-if="detailBook" class="detail-backdrop" @click.self="closeDetail">
      <article class="detail-panel">
        <div class="book-cover detail-cover">
          <img v-if="detailBook.cover_url" :src="detailBook.cover_url" alt="" />
          <div v-else class="cover-fallback">{{ getInitial(detailBook.title) }}</div>
        </div>
        <div class="detail-content">
          <div>
            <p class="eyebrow">Rincian Buku</p>
            <h2>{{ detailBook.title }}</h2>
            <p class="detail-author">{{ detailBook.author }}</p>
          </div>
          <dl class="detail-list">
            <div>
              <dt>Penerbit</dt>
              <dd>{{ detailBook.publisher || '-' }}</dd>
            </div>
            <div>
              <dt>Tahun Terbit</dt>
              <dd>{{ detailBook.year || '-' }}</dd>
            </div>
            <div>
              <dt>Kategori</dt>
              <dd>{{ detailBook.category || 'Umum' }}</dd>
            </div>
            <div>
              <dt>Stok</dt>
              <dd>{{ detailBook.stock }} buku</dd>
            </div>
          </dl>
          <p v-if="error" class="alert error">{{ error }}</p>
          <div class="detail-actions">
            <button
              v-if="auth.isMember"
              class="btn primary"
              type="button"
              :disabled="Number(detailBook.stock) <= 0 || borrowing"
              @click="borrowSelectedBook"
            >
              {{ borrowing ? 'Memproses...' : 'Pinjam Buku' }}
            </button>
            <button v-if="auth.isAdmin" class="btn primary" type="button" @click="openEditFromDetail">
              Edit Buku
            </button>
            <button class="btn ghost" type="button" @click="closeDetail">Tutup</button>
          </div>
        </div>
      </article>
    </div>

    <div class="panel">
      <div class="toolbar">
        <h2>Data Buku</h2>
        <span class="muted">{{ filteredBooks.length }} dari {{ books.length }} buku</span>
      </div>
      <p v-if="error" class="alert error">{{ error }}</p>
      <BookTable :books="filteredBooks" :is-admin="auth.isAdmin" @edit="openEdit" @delete="removeBook" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { createBorrow } from '@/api/borrow.js'
import { addBook, deleteBook, fetchBooks, updateBook } from '@/api/books.js'
import { useAuthStore } from '@/stores/auth.js'
import BookForm from '@/components/books/BookForm.vue'
import BookTable from '@/components/books/BookTable.vue'
import SuccessPopup from '@/components/SuccessPopup.vue'

const auth = useAuthStore()
const books = ref([])
const search = ref('')
const selectedCategory = ref('')
const selectedBook = ref(null)
const detailBook = ref(null)
const showForm = ref(false)
const borrowing = ref(false)
const error = ref('')
const success = ref('')

const categories = computed(() => {
  return [...new Set(books.value.map((book) => book.category).filter(Boolean))].sort()
})

const filteredBooks = computed(() => {
  const keyword = search.value.toLowerCase().trim()

  return books.value.filter((book) => {
    const matchesKeyword =
      !keyword ||
      [book.title, book.author, book.publisher, book.category].filter(Boolean).some((value) => {
        return value.toLowerCase().includes(keyword)
      })

    const matchesCategory = !selectedCategory.value || book.category === selectedCategory.value
    return matchesKeyword && matchesCategory
  })
})

const totalStock = computed(() => books.value.reduce((total, book) => total + Number(book.stock || 0), 0))
const availableBooks = computed(() => books.value.filter((book) => Number(book.stock) > 0).length)

async function loadBooks() {
  try {
    books.value = await fetchBooks()
  } catch (err) {
    error.value = err.message
  }
}

function resetFilters() {
  search.value = ''
  selectedCategory.value = ''
}

function openCreate() {
  selectedBook.value = null
  showForm.value = true
}

function openEdit(book) {
  selectedBook.value = book
  showForm.value = true
}

function openDetail(book) {
  detailBook.value = book
  error.value = ''
  success.value = ''
}

function closeDetail() {
  detailBook.value = null
  error.value = ''
  success.value = ''
}

function openEditFromDetail() {
  selectedBook.value = detailBook.value
  showForm.value = true
  closeDetail()
}

function closeForm() {
  selectedBook.value = null
  showForm.value = false
}

async function saveBook(payload) {
  try {
    const isEdit = Boolean(selectedBook.value?.id)

    if (selectedBook.value?.id) {
      await updateBook(selectedBook.value.id, payload)
    } else {
      await addBook(payload)
    }
    success.value = isEdit ? 'Buku berhasil diperbarui.' : 'Buku berhasil ditambahkan.'
    error.value = ''
    closeForm()
    await loadBooks()
  } catch (err) {
    error.value = err.message
  }
}

async function removeBook(book) {
  if (!confirm(`Hapus buku "${book.title}"?`)) return

  try {
    await deleteBook(book.id)
    success.value = 'Buku berhasil dihapus.'
    error.value = ''
    await loadBooks()
  } catch (err) {
    error.value = err.message
  }
}

onMounted(loadBooks)

async function borrowSelectedBook() {
  if (!detailBook.value) return

  borrowing.value = true
  error.value = ''
  success.value = ''

  const borrowDate = new Date()
  const dueDate = new Date()
  dueDate.setDate(borrowDate.getDate() + 7)

  try {
    await createBorrow({
      book_id: detailBook.value.id,
      borrower_name: auth.user?.name || auth.user?.username || 'User',
      member_id: auth.user?.id || null,
      borrow_date: borrowDate.toISOString().slice(0, 10),
      due_date: dueDate.toISOString().slice(0, 10),
      book_condition: 'aman',
    })

    success.value = 'Permintaan peminjaman dikirim. Tunggu persetujuan admin.'
    await loadBooks()
    detailBook.value = books.value.find((book) => String(book.id) === String(detailBook.value.id))
  } catch (err) {
    error.value = err.message
  } finally {
    borrowing.value = false
  }
}

function getInitial(title = 'B') {
  return title.slice(0, 1).toUpperCase()
}
</script>
