<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Buku</th>
          <th>Peminjam</th>
          <th>Pinjam</th>
          <th>Jatuh Tempo</th>
          <th>Status</th>
          <th v-if="canReturn">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="borrow in borrows" :key="borrow.id">
          <td>{{ borrow.book?.title || borrow.book_title || borrow.book_id }}</td>
          <td>{{ borrow.borrower_name || borrow.member?.name || '-' }}</td>
          <td>{{ borrow.borrow_date || '-' }}</td>
          <td>{{ borrow.due_date || '-' }}</td>
          <td>
            <span class="status" :class="borrow.returned_at ? 'success' : 'warning'">
              {{ borrow.returned_at ? 'Kembali' : 'Dipinjam' }}
            </span>
          </td>
          <td v-if="canReturn">
            <button
              class="btn small primary"
              type="button"
              :disabled="Boolean(borrow.returned_at)"
              @click="$emit('return', borrow)"
            >
              Kembalikan
            </button>
          </td>
        </tr>
        <tr v-if="!borrows.length">
          <td :colspan="canReturn ? 6 : 5" class="empty-cell">Data peminjaman belum tersedia.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  borrows: {
    type: Array,
    default: () => [],
  },
  canReturn: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['return'])
</script>
