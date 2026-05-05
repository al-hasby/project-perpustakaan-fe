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
          <th v-if="showActions">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="borrow in borrows" :key="borrow.id">
          <td>{{ borrow.book?.title || borrow.book_title || borrow.book_id }}</td>
          <td>{{ borrow.borrower_name || borrow.member?.name || '-' }}</td>
          <td>{{ borrow.borrow_date || '-' }}</td>
          <td>{{ borrow.due_date || '-' }}</td>
          <td>
            <span class="status" :class="getStatusClass(borrow)">
              {{ getStatusLabel(borrow) }}
            </span>
          </td>
          <td v-if="showActions">
            <div class="table-actions">
              <button
                v-if="canApprove && borrow.approval_status === 'pending'"
                class="btn small primary"
                type="button"
                @click="$emit('approve', borrow)"
              >
                Setujui
              </button>
              <button
                v-if="canApprove && borrow.approval_status === 'pending'"
                class="btn small danger"
                type="button"
                @click="$emit('reject', borrow)"
              >
                Tolak
              </button>
              <button
                v-if="canReturn && borrow.approval_status === 'approved'"
                class="btn small primary"
                type="button"
                :disabled="Boolean(borrow.returned_at)"
                @click="$emit('return', borrow)"
              >
                Kembalikan
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!borrows.length">
          <td :colspan="showActions ? 6 : 5" class="empty-cell">Data peminjaman belum tersedia.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  borrows: {
    type: Array,
    default: () => [],
  },
  canReturn: {
    type: Boolean,
    default: false,
  },
  canApprove: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['approve', 'reject', 'return'])

const showActions = computed(() => props.canApprove || props.canReturn)

function getStatusLabel(borrow) {
  if (borrow.returned_at) return 'Kembali'
  if (borrow.approval_status === 'pending') return 'Menunggu'
  if (borrow.approval_status === 'rejected') return 'Ditolak'
  return 'Dipinjam'
}

function getStatusClass(borrow) {
  if (borrow.returned_at) return 'success'
  if (borrow.approval_status === 'rejected') return 'danger'
  if (borrow.approval_status === 'pending') return 'warning'
  return 'primary'
}
</script>
