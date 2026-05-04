<template>
  <form class="panel return-panel" @submit.prevent="$emit('submit')">
    <div>
      <p class="eyebrow">Pengembalian</p>
      <h2>{{ borrow?.book?.title || borrow?.book_title || 'Pilih data peminjaman' }}</h2>
      <p>{{ borrow?.borrower_name || borrow?.member?.name || 'Klik tombol kembalikan pada tabel.' }}</p>
    </div>
    <button class="btn primary" type="submit" :disabled="!borrow">Konfirmasi Kembali</button>
  </form>
</template>

<script setup>
defineProps({
  borrow: {
    type: Object,
    default: null,
  },
})

defineEmits(['submit'])
</script>
