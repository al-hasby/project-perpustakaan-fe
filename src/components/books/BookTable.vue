<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Buku</th>
          <th>Judul</th>
          <th>Penulis</th>
          <th>Tahun</th>
          <th>Stok</th>
          <th v-if="isAdmin">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>
            <div class="book-cover table-cover">
              <img v-if="book.cover_url" :src="book.cover_url" alt="" />
              <div v-else class="cover-fallback">{{ getInitial(book.title) }}</div>
            </div>
          </td>
          <td>
            <strong>{{ book.title }}</strong>
            <span class="book-meta">{{ book.publisher || '-' }} · {{ book.category || '-' }}</span>
          </td>
          <td>{{ book.author }}</td>
          <td>{{ book.year || '-' }}</td>
          <td>
            <span class="stock-pill" :class="{ empty: Number(book.stock) === 0 }">
              {{ book.stock }} tersedia
            </span>
          </td>
          <td v-if="isAdmin" class="table-actions">
            <button class="btn small ghost" type="button" @click="$emit('edit', book)">Edit</button>
            <button class="btn small danger" type="button" @click="$emit('delete', book)">Hapus</button>
          </td>
        </tr>
        <tr v-if="!books.length">
          <td :colspan="isAdmin ? 6 : 5" class="empty-cell">Data buku belum tersedia.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  books: {
    type: Array,
    default: () => [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'delete'])

function getInitial(title = 'B') {
  return title.slice(0, 1).toUpperCase()
}
</script>
