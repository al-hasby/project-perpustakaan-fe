<template>
  <div class="panel pdf-viewer">
    <div class="viewer-header">
      <div>
        <p class="eyebrow">Penampil PDF</p>
        <h2>{{ title || 'Pilih buku digital' }}</h2>
      </div>
      <a v-if="src" class="btn ghost" :href="src" target="_blank" rel="noreferrer">Buka Tab Baru</a>
    </div>
    <iframe v-if="src" :src="src" title="PDF buku digital"></iframe>
    <div v-else class="empty-viewer">PDF akan tampil setelah buku dipilih.</div>
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})
</script>
