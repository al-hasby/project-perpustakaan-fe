<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Buku</th>
          <th>Peminjam</th>
          <th>Jatuh Tempo</th>
          <th>Telat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.book?.title || item.book_title || '-' }}</td>
          <td>{{ item.borrower_name || item.member?.name || '-' }}</td>
          <td>{{ item.due_date || '-' }}</td>
          <td>{{ item.days_late || item.late_days || 0 }} hari</td>
        </tr>
        <tr v-if="!items.length">
          <td colspan="4" class="empty-cell">Tidak ada data keterlambatan.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>
