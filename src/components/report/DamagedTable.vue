<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Buku</th>
          <th>Kondisi</th>
          <th>Catatan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.title || item.book?.title || '-' }}</td>
          <td>{{ item.condition || 'Rusak' }}</td>
          <td>{{ item.note || item.description || '-' }}</td>
        </tr>
        <tr v-if="!items.length">
          <td colspan="3" class="empty-cell">Tidak ada data buku rusak.</td>
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
