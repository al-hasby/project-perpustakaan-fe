<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Buku</th>
          <th>Peminjam</th>
          <th>Pinjam</th>
          <th>Jatuh Tempo</th>
          <th>Kondisi</th>
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
          <td>{{ getConditionLabel(borrow.book_condition) }}</td>
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
                v-if="canReturn && ['dipinjam', 'terlambat'].includes(borrow.status)"
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
          <td :colspan="showActions ? 7 : 6" class="empty-cell">Data peminjaman belum tersedia.</td>
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
  if (borrow.status === 'dikembalikan' || borrow.returned_at) return 'Kembali'
  if (borrow.approval_status === 'pending') return 'Menunggu'
  if (borrow.approval_status === 'rejected') return 'Ditolak'
  if (borrow.status === 'terlambat') return 'Terlambat'
  return 'Dipinjam'
}

function getStatusClass(borrow) {
  if (borrow.status === 'dikembalikan' || borrow.returned_at) return 'success'
  if (borrow.approval_status === 'rejected') return 'danger'
  if (borrow.status === 'terlambat') return 'danger'
  if (borrow.approval_status === 'pending') return 'warning'
  return 'primary'
}

function getConditionLabel(condition) {
  if (condition === 'sedikit_rusak') return 'Sedikit rusak'
  if (condition === 'rusak') return 'Rusak'
  return 'Aman'
}
</script>
