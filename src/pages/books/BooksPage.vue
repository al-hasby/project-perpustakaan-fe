<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Books</h1>
        <p>Manage the library book catalog</p>
      </div>
      <div v-if="auth.isAdmin || auth.isPetugas" class="page-header-actions">
        <button class="btn btn-primary" type="button" @click="openCreate">
          + Add Book
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Books</div>
        <div class="stat-value">{{ books.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Available</div>
        <div class="stat-value">{{ availableCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Stock</div>
        <div class="stat-value">{{ totalStock }}</div>
      </div>
    </div>

    <div class="filter-bar">
      <div class="search-bar">
        <span class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input v-model="search" placeholder="Search by title, author, or category..." />
      </div>
      <select v-model="selectedCategory" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <button class="btn btn-ghost btn-sm" type="button" @click="resetFilters">Reset</button>
    </div>

    <div v-if="loading" class="card-grid">
      <div v-for="n in 6" :key="n" class="card">
        <div class="skeleton" style="height: 180px; margin-bottom: 12px;"></div>
        <div class="skeleton" style="width: 60%; height: 16px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 40%; height: 14px; margin-bottom: 12px;"></div>
        <div class="skeleton" style="width: 80px; height: 24px;"></div>
      </div>
    </div>

    <div v-else-if="!filteredBooks.length" class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>No books found</h3>
      <p v-if="search || selectedCategory">Try adjusting your search or filters</p>
      <p v-else>Add a book to get started</p>
      <button v-if="search || selectedCategory" class="btn btn-ghost" type="button" @click="resetFilters">Clear Filters</button>
    </div>

    <div v-else class="card-grid">
      <article v-for="book in filteredBooks" :key="book.id" class="card book-card-item">
        <div class="book-card-cover" @click="openDetail(book)">
          <div v-if="book.cover_url" class="cover-img" :style="{ backgroundImage: `url(${book.cover_url})` }"></div>
          <div v-else class="cover-fallback">{{ getInitial(book.title) }}</div>
        </div>
        <div class="book-card-body">
          <div class="book-category">{{ book.category || 'General' }}</div>
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <div class="book-meta-row">
            <span>{{ book.year || '-' }}</span>
            <span :class="['badge', Number(book.stock) > 0 ? 'badge-success' : 'badge-danger']">
              {{ book.stock }} in stock
            </span>
          </div>
          <div class="book-card-actions">
            <button class="btn btn-ghost btn-sm" type="button" @click="openDetail(book)">Details</button>
            <button
              v-if="auth.isMember && Number(book.stock) > 0"
              class="btn btn-primary btn-sm"
              type="button"
              :disabled="borrowingId === book.id"
              @click="borrowBook(book)"
            >
              {{ borrowingId === book.id ? '...' : 'Borrow' }}
            </button>
            <template v-if="auth.isAdmin || auth.isPetugas">
              <button class="btn btn-ghost btn-sm" type="button" @click="openEdit(book)">Edit</button>
              <button class="btn btn-danger btn-sm" type="button" @click="removeBook(book)">Delete</button>
            </template>
          </div>
        </div>
      </article>
    </div>

    <Teleport to="body">
      <div v-if="detailBook" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-box">
          <button class="modal-close" type="button" @click="closeDetail">✕</button>
          <div class="detail-layout">
            <div class="detail-cover-section">
              <div v-if="detailBook.cover_url" class="detail-cover-img" :style="{ backgroundImage: `url(${detailBook.cover_url})` }"></div>
              <div v-else class="detail-cover-fallback">{{ getInitial(detailBook.title) }}</div>
            </div>
            <div class="detail-info">
              <span class="badge badge-info">{{ detailBook.category || 'General' }}</span>
              <h2>{{ detailBook.title }}</h2>
              <p class="detail-author-text">{{ detailBook.author }}</p>

              <div class="detail-fields">
                <div class="detail-field">
                  <span class="field-label">Publisher</span>
                  <span class="field-value">{{ detailBook.publisher || '-' }}</span>
                </div>
                <div class="detail-field">
                  <span class="field-label">Year</span>
                  <span class="field-value">{{ detailBook.year || '-' }}</span>
                </div>
                <div class="detail-field">
                  <span class="field-label">Category</span>
                  <span class="field-value">{{ detailBook.category || 'General' }}</span>
                </div>
                <div class="detail-field">
                  <span class="field-label">Stock</span>
                  <span :class="['field-value', 'badge', Number(detailBook.stock) > 0 ? 'badge-success' : 'badge-danger']">
                    {{ detailBook.stock }} available
                  </span>
                </div>
              </div>

              <p v-if="detailError" class="alert alert-error">{{ detailError }}</p>

              <div class="detail-actions">
                <button
                  v-if="auth.isMember && Number(detailBook.stock) > 0"
                  class="btn btn-primary"
                  type="button"
                  :disabled="borrowingId === detailBook.id"
                  @click="borrowBook(detailBook)"
                >
                  {{ borrowingId === detailBook.id ? 'Processing...' : 'Borrow Book' }}
                </button>
                <button v-if="auth.isAdmin || auth.isPetugas" class="btn btn-primary" type="button" @click="openEditFromDetail">
                  Edit Book
                </button>
                <button class="btn btn-ghost" type="button" @click="closeDetail">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-box">
          <button class="modal-close" type="button" @click="closeForm">✕</button>
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">{{ editingBook ? 'Edit Book' : 'Add Book' }}</h2>
          <form @submit.prevent="saveBook">
            <div class="form-grid">
              <div class="form-group">
                <label for="book-title">Title *</label>
                <input id="book-title" v-model="form.title" required placeholder="Book title" />
              </div>
              <div class="form-group">
                <label for="book-author">Author *</label>
                <input id="book-author" v-model="form.author" required placeholder="Author name" />
              </div>
              <div class="form-group">
                <label for="book-publisher">Publisher</label>
                <input id="book-publisher" v-model="form.publisher" placeholder="Publisher" />
              </div>
              <div class="form-group">
                <label for="book-year">Year</label>
                <input id="book-year" v-model.number="form.year" type="number" min="1900" placeholder="2026" />
              </div>
              <div class="form-group">
                <label for="book-stock">Stock *</label>
                <input id="book-stock" v-model.number="form.stock" type="number" min="0" required />
              </div>
              <div class="form-group">
                <label for="book-category">Category</label>
                <input id="book-category" v-model="form.category" placeholder="e.g. Novel, Technology" />
              </div>
              <div class="form-group span-2">
                <label for="book-pdf">PDF File URL</label>
                <input id="book-pdf" v-model="form.pdf_url" placeholder="filename.pdf" />
              </div>
            </div>
            <p v-if="formError" class="alert alert-error" style="margin-top: 12px;">{{ formError }}</p>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="btn btn-ghost" type="button" @click="closeForm">Cancel</button>
              <button class="btn btn-primary" type="submit" :disabled="saving">
                {{ saving ? 'Saving...' : editingBook ? 'Update' : 'Add Book' }}
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
import { fetchBooks, addBook, updateBook, deleteBook } from '@/api/books.js'
import { createBorrow } from '@/api/borrow.js'
import { useAuthStore } from '@/stores/auth.js'

const auth = useAuthStore()
const books = ref([])
const search = ref('')
const selectedCategory = ref('')
const loading = ref(true)
const detailBook = ref(null)
const detailError = ref('')
const borrowingId = ref(null)
const showForm = ref(false)
const editingBook = ref(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  title: '',
  author: '',
  publisher: '',
  year: new Date().getFullYear(),
  stock: 1,
  category: '',
  pdf_url: '',
})

const categories = computed(() => {
  return [...new Set(books.value.map(b => b.category).filter(Boolean))].sort()
})

const filteredBooks = computed(() => {
  const keyword = search.value.toLowerCase().trim()
  return books.value.filter(book => {
    const matchSearch = !keyword || [book.title, book.author, book.publisher, book.category]
      .filter(Boolean)
      .some(v => v.toLowerCase().includes(keyword))
    const matchCat = !selectedCategory.value || book.category === selectedCategory.value
    return matchSearch && matchCat
  })
})

const availableCount = computed(() => books.value.filter(b => Number(b.stock) > 0).length)
const totalStock = computed(() => books.value.reduce((s, b) => s + Number(b.stock || 0), 0))

function getInitial(title = 'B') {
  return title.slice(0, 1).toUpperCase()
}

async function loadBooks() {
  loading.value = true
  try {
    books.value = await fetchBooks()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  search.value = ''
  selectedCategory.value = ''
}

function openDetail(book) {
  detailBook.value = book
  detailError.value = ''
}

function closeDetail() {
  detailBook.value = null
  detailError.value = ''
}

function openCreate() {
  editingBook.value = null
  Object.assign(form, {
    title: '',
    author: '',
    publisher: '',
    year: new Date().getFullYear(),
    stock: 1,
    category: '',
    pdf_url: '',
  })
  showForm.value = true
}

function openEdit(book) {
  editingBook.value = book
  Object.assign(form, {
    title: book.title || '',
    author: book.author || '',
    publisher: book.publisher || '',
    year: book.year || new Date().getFullYear(),
    stock: book.stock ?? 1,
    category: book.category || '',
    pdf_url: book.pdf_url || '',
  })
  showForm.value = true
}

function openEditFromDetail() {
  openEdit(detailBook.value)
  closeDetail()
}

function closeForm() {
  showForm.value = false
  editingBook.value = null
  formError.value = ''
}

async function saveBook() {
  saving.value = true
  try {
    if (editingBook.value?.id) {
      await updateBook(editingBook.value.id, { ...form })
    } else {
      await addBook({ ...form })
    }
    closeForm()
    await loadBooks()
  } catch (err) {
    formError.value = friendlyError(err.message)
  } finally {
    saving.value = false
  }
}

async function removeBook(book) {
  if (!confirm(`Delete "${book.title}"?`)) return
  try {
    await deleteBook(book.id)
    await loadBooks()
  } catch (err) {
    console.error(err)
  }
}

function friendlyError(msg) {
  if (!msg) return 'An unexpected error occurred'
  if (msg === 'INTERNAL_SERVER_ERROR') return 'Server error. Please try again later.'
  if (msg === 'FORBIDDEN') return 'You do not have permission to perform this action.'
  return msg
}

async function borrowBook(book) {
  if (Number(book.stock) <= 0) {
    detailError.value = 'Book is out of stock'
    return
  }
  borrowingId.value = book.id
  detailError.value = ''

  const today = new Date().toISOString().slice(0, 10)
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 7)

  try {
    await createBorrow({
      borrower_name: auth.user?.username || auth.user?.name || 'User',
      id_buku: book.id,
      tanggal_pinjam: today,
      tanggal_kembali: dueDate.toISOString().slice(0, 10),
      kondisi_buku: 'aman',
      member_id: auth.user?.id || null,
    })
    await loadBooks()
    if (detailBook.value) {
      detailBook.value = books.value.find(b => String(b.id) === String(book.id)) || null
    }
  } catch (err) {
    const msg = err.message || ''
    if (msg === 'BOOK_OUT_OF_STOCK') {
      detailError.value = 'This book is currently out of stock'
    } else {
      detailError.value = friendlyError(msg)
    }
  } finally {
    borrowingId.value = null
  }
}

onMounted(loadBooks)
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-bar .search-bar {
  flex: 1;
  min-width: 220px;
}

.filter-select {
  width: auto;
  min-width: 180px;
}

.book-card-item {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.book-card-cover {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.cover-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #1E293B, var(--color-primary));
  color: #fff;
  font-size: 32px;
  font-weight: 700;
}

.book-card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-category {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.book-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.book-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
  margin-top: auto;
}

.book-card-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* Detail modal */
.detail-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}

.detail-cover-section {
  border-radius: var(--radius-sm);
  overflow: hidden;
  height: 280px;
}

.detail-cover-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.detail-cover-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #1E293B, var(--color-primary));
  color: #fff;
  font-size: 48px;
  font-weight: 700;
}

.detail-info h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 8px 0 4px;
}

.detail-author-text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.detail-fields {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.field-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.field-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.detail-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

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
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-cover-section {
    height: 200px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.span-2 {
    grid-column: span 1;
  }
}
</style>
