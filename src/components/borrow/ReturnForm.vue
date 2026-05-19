<template>
  <form class="panel return-panel" @submit.prevent="submitForm">
    <div>
      <p class="eyebrow">Pengembalian</p>
      <h2>{{ borrow?.book?.title || borrow?.book_title || 'Pilih data peminjaman' }}</h2>
      <p>{{ borrow?.borrower_name || borrow?.member?.name || 'Klik tombol kembalikan pada tabel.' }}</p>
    </div>
    <label>
      Tanggal Kembali
      <input v-model="returnedAt" required type="date" :disabled="!borrow" />
    </label>
    <label>
      Kondisi Buku
      <select v-model="bookCondition" required :disabled="!borrow">
        <option value="aman">Aman</option>
        <option value="sedikit_rusak">Sedikit rusak</option>
        <option value="rusak">Rusak</option>
      </select>
    </label>
    <button class="btn primary" type="submit" :disabled="!borrow">Konfirmasi Kembali</button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  borrow: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['submit'])
const today = new Date().toISOString().slice(0, 10)
const returnedAt = ref(today)
const bookCondition = ref('aman')

watch(
  () => props.borrow,
  () => {
    returnedAt.value = today
    bookCondition.value = props.borrow?.book_condition || 'aman'
  },
)

function submitForm() {
  emit('submit', {
    returned_at: returnedAt.value,
    book_condition: bookCondition.value,
  })
}
</script>
