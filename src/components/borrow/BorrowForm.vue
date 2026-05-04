<template>
  <form class="panel form-grid" @submit.prevent="submitForm">
    <h2 class="span-2">Input Peminjaman</h2>
    <label>
      ID Buku
      <input v-model="form.book_id" required placeholder="Contoh: 1" />
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
    <div class="form-actions span-2">
      <button class="btn primary" type="submit">Simpan Peminjaman</button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])
const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  book_id: '',
  borrower_name: '',
  borrow_date: today,
  due_date: today,
})

function submitForm() {
  emit('submit', { ...form })
  form.book_id = ''
  form.borrower_name = ''
}
</script>
