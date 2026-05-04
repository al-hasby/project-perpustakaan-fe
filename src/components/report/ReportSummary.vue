<template>
  <div class="summary-grid">
    <article class="summary-card">
      <span>Total Peminjaman</span>
      <strong>{{ summary.total_borrowed || 0 }}</strong>
    </article>
    <article class="summary-card">
      <span>Belum Kembali</span>
      <strong>{{ summary.not_returned || 0 }}</strong>
    </article>
    <article class="summary-card">
      <span>Terlambat</span>
      <strong>{{ summary.overdue || 0 }}</strong>
    </article>
    <article class="summary-card">
      <span>Buku Rusak</span>
      <strong>{{ summary.damaged || 0 }}</strong>
    </article>
  </div>
</template>

<script setup>
defineProps({
  summary: {
    type: Object,
    default: () => ({}),
  },
})
</script>
