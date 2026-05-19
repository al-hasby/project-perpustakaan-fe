<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">TASK-003</p>
        <h1>Akses Buku Digital</h1>
        <p>Member dapat melihat daftar buku digital dan membuka file PDF.</p>
      </div>
    </div>

    <div class="ebook-layout">
      <aside class="panel ebook-list">
        <button
          v-for="book in ebooks"
          :key="book.id"
          class="ebook-item"
          type="button"
          @click="selectBook(book)"
        >
          <strong>{{ book.title }}</strong>
          <span>{{ book.author || 'Penulis belum diisi' }}</span>
        </button>
        <p v-if="!ebooks.length" class="empty-cell">Daftar buku digital belum tersedia.</p>
      </aside>

      <PdfViewer :src="selectedPdf" :title="selectedBook?.title" />
    </div>

    <p v-if="error" class="alert error">{{ error }}</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchEbooks, fetchPdfAccess } from '@/api/ebooks.js'
import PdfViewer from '@/components/ebooks/PdfViewer.vue'

const ebooks = ref([])
const selectedBook = ref(null)
const selectedPdf = ref('')
const error = ref('')

async function loadEbooks() {
  try {
    ebooks.value = await fetchEbooks()
  } catch (err) {
    error.value = err.message
  }
}

async function selectBook(book) {
  selectedBook.value = book
  selectedPdf.value = book.pdf_url || book.pdfUrl || ''

  if (!selectedPdf.value) {
    try {
      const data = await fetchPdfAccess(book.id)
      selectedPdf.value = data.pdf_url || data.pdfUrl || data.url || ''
    } catch (err) {
      error.value = err.message
    }
  }

  if (selectedPdf.value && !selectedPdf.value.startsWith('http') && !selectedPdf.value.startsWith('/')) {
    selectedPdf.value = `/uploads/${selectedPdf.value}`
  }
}

onMounted(loadEbooks)
</script>
