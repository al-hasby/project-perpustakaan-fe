<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>E-Buku</h1>
        <p>Jelajahi dan baca buku digital secara online</p>
      </div>
    </div>

    <div v-if="loading" class="card-grid">
      <div v-for="n in 6" :key="n" class="card">
        <div class="skeleton" style="height: 180px; margin-bottom: 12px;"></div>
        <div class="skeleton" style="width: 60%; height: 16px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 40%; height: 14px;"></div>
      </div>
    </div>

    <div v-else-if="error" class="empty-state">
      <div class="empty-icon">⚠️</div>
      <h3>Gagal memuat e-buku</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" type="button" @click="loadEbooks">Coba Lagi</button>
    </div>

    <div v-else-if="!ebooks.length" class="empty-state">
      <div class="empty-icon">📖</div>
      <h3>Tidak ada e-buku tersedia</h3>
      <p>Buku digital belum ditambahkan</p>
    </div>

    <div v-else class="card-grid">
      <article v-for="book in ebooks" :key="book.id" class="card ebook-card" @click="openReader(book)">
        <div class="ebook-cover">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div class="ebook-body">
          <span class="badge badge-info ebook-category">{{ book.category || 'Umum' }}</span>
          <h3 class="ebook-title">{{ book.title }}</h3>
          <p class="ebook-author">{{ book.author }}</p>
          <span class="ebook-year">{{ book.year || '-' }}</span>
        </div>
      </article>
    </div>

    <Teleport to="body">
      <div v-if="selectedBook" class="modal-overlay reader-overlay" @click.self="closeReader">
        <div class="reader-modal">
          <div class="reader-header">
            <div>
              <h2>{{ selectedBook.title }}</h2>
              <p>{{ selectedBook.author }}</p>
            </div>
            <div class="reader-actions">
              <a v-if="pdfSrc" class="btn btn-ghost btn-sm" :href="pdfSrc" target="_blank" rel="noreferrer">Buka di tab baru</a>
              <button class="btn btn-ghost btn-sm" type="button" @click="closeReader">Tutup</button>
            </div>
          </div>
          <div v-if="pdfLoading" class="reader-loading">
            <div class="skeleton" style="width: 100%; height: 500px;"></div>
          </div>
          <iframe v-else-if="pdfSrc" :src="pdfSrc" class="reader-iframe" title="PDF Viewer"></iframe>
          <div v-else class="reader-empty">
            <p>PDF tidak tersedia untuk e-buku ini</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchEbooks, fetchPdfAccess } from '@/api/ebooks.js'
import { resolveApiAssetUrl } from '@/api/index.js'

const ebooks = ref([])
const loading = ref(true)
const error = ref('')
const selectedBook = ref(null)
const pdfSrc = ref('')
const pdfLoading = ref(false)

function friendlyError(msg) {
  if (!msg) return 'Terjadi kesalahan yang tidak terduga'
  if (msg === 'INTERNAL_SERVER_ERROR') return 'Kesalahan server. Silakan coba lagi nanti.'
  if (msg === 'FORBIDDEN') return 'Anda tidak memiliki izin untuk mengakses data ini.'
  return msg
}

async function loadEbooks() {
  loading.value = true
  error.value = ''
  try {
    ebooks.value = await fetchEbooks()
  } catch (err) {
    error.value = friendlyError(err.message)
  } finally {
    loading.value = false
  }
}

async function openReader(book) {
  selectedBook.value = book
  pdfSrc.value = ''
  pdfLoading.value = true

  const url = book.pdf_url || ''
  if (url) {
    pdfSrc.value = resolveApiAssetUrl(url)
    pdfLoading.value = false
  } else {
    try {
      const data = await fetchPdfAccess(book.id)
      const fileUrl = data.pdf_url || data.file_url || data.url || ''
      pdfSrc.value = fileUrl ? resolveApiAssetUrl(fileUrl) : ''
    } catch {
      pdfSrc.value = ''
    } finally {
      pdfLoading.value = false
    }
  }
}

function closeReader() {
  selectedBook.value = null
  pdfSrc.value = ''
}

onMounted(loadEbooks)
</script>

<style scoped>
.ebook-card {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.ebook-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.ebook-cover {
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
}

.ebook-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ebook-category {
  font-size: 10px;
  margin-bottom: 4px;
}

.ebook-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.ebook-author {
  font-size: 13px;
  color: var(--color-text-muted);
}

.ebook-year {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Reader modal */
.reader-overlay {
  padding: 0;
  align-items: stretch;
}

.reader-modal {
  width: 100%;
  max-width: 100%;
  height: 100vh;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
}

.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

.reader-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.reader-header p {
  font-size: 13px;
  color: var(--color-text-muted);
}

.reader-actions {
  display: flex;
  gap: 8px;
}

.reader-iframe {
  flex: 1;
  width: 100%;
  border: none;
}

.reader-loading {
  flex: 1;
  padding: 24px;
}

.reader-empty {
  flex: 1;
  display: grid;
  place-items: center;
  color: var(--color-text-muted);
  font-size: 16px;
}

@media (max-width: 640px) {
  .reader-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
  }

  .reader-header h2 {
    font-size: 14px;
  }

  .reader-actions {
    width: 100%;
  }

  .reader-actions .btn {
    flex: 1;
  }
}
</style>
