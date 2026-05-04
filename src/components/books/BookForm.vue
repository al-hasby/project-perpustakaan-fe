<template>
  <form class="panel form-grid" @submit.prevent="submitForm">
    <h2>{{ modelValue?.id ? 'Edit Buku' : 'Tambah Buku' }}</h2>

    <label>
      Judul
      <input v-model="form.title" required placeholder="Judul buku" />
    </label>
    <label>
      Penulis
      <input v-model="form.author" required placeholder="Nama penulis" />
    </label>
    <label>
      Penerbit
      <input v-model="form.publisher" placeholder="Nama penerbit" />
    </label>
    <label>
      Tahun
      <input v-model.number="form.year" min="1900" type="number" placeholder="2026" />
    </label>
    <label>
      Stok
      <input v-model.number="form.stock" min="0" type="number" required />
    </label>
    <label>
      Kategori
      <input v-model="form.category" placeholder="Novel, Teknologi, Sejarah" />
    </label>
    <label class="span-2">
      File / URL PDF
      <input v-model="form.pdf_url" placeholder="nama-file.pdf atau https://contoh.com/buku.pdf" />
    </label>
    <label class="span-2">
      URL Cover
      <input v-model="form.cover_url" placeholder="https://contoh.com/cover.jpg" />
    </label>

    <div class="form-preview span-2">
      <div class="book-cover preview-cover">
        <img v-if="form.cover_url" :src="form.cover_url" alt="" />
        <div v-else class="cover-fallback">{{ initial }}</div>
      </div>
      <div>
        <p class="eyebrow">Preview</p>
        <h3>{{ form.title || 'Judul buku' }}</h3>
        <p>{{ form.author || 'Nama penulis' }}</p>
      </div>
    </div>

    <div class="form-actions span-2">
      <button class="btn primary" type="submit">{{ modelValue?.id ? 'Simpan' : 'Tambah' }}</button>
      <button class="btn ghost" type="button" @click="$emit('cancel')">Batal</button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '',
  author: '',
  publisher: '',
  year: new Date().getFullYear(),
  stock: 1,
  category: '',
  pdf_url: '',
  cover_url: '',
})

const initial = computed(() => (form.title || 'B').slice(0, 1).toUpperCase())

watch(
  () => props.modelValue,
  (book) => {
    Object.assign(form, {
      title: book?.title || '',
      author: book?.author || '',
      publisher: book?.publisher || '',
      year: book?.year || new Date().getFullYear(),
      stock: book?.stock ?? 1,
      category: book?.category || '',
      pdf_url: book?.pdf_url || book?.pdf_file || book?.pdfUrl || '',
      cover_url: book?.cover_url || book?.coverUrl || '',
    })
  },
  { immediate: true },
)

function submitForm() {
  emit('submit', { ...form })
}
</script>
