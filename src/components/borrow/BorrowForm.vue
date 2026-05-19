<template>
  <form class="panel form-grid" @submit.prevent="submitForm">
    <h2 class="span-2">Input Peminjaman</h2>
    <label>
      Buku
      <select v-model="form.book_id" required>
        <option value="" disabled>Pilih buku</option>
        <option v-for="book in availableBooks" :key="book.id" :value="book.id">
          {{ book.title }} - {{ book.stock }} stok
        </option>
      </select>
    </label>
    <label>
      Nama Peminjam
      <input v-model="form.borrower_name" required placeholder="Nama siswa/member" />
    </label>
    <label>
      Tanggal Pinjam
      <input v-model="form.borrow_date" required type="date" />
    </label>
    <label>
      Tanggal Jatuh Tempo
      <input v-model="form.due_date" required type="date" />
    </label>
    <label class="span-2">
      Kondisi Buku
      <select v-model="form.book_condition" required>
        <option value="aman">Aman</option>
        <option value="sedikit_rusak">Sedikit rusak</option>
        <option value="rusak">Rusak</option>
      </select>
    </label>
    <div class="form-actions span-2">
      <button class="btn primary" type="submit">Simpan Peminjaman</button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive } from 'vue'

const props = defineProps({
  books: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['submit'])
const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  book_id: '',
  borrower_name: '',
  borrow_date: today,
  due_date: today,
  book_condition: 'aman',
})

const availableBooks = computed(() => props.books.filter((book) => Number(book.stock) > 0))

function submitForm() {
  emit('submit', { ...form })
  form.book_id = ''
  form.borrower_name = ''
}
</script>
