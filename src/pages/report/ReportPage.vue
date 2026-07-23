<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Laporan</h1>
        <p>Analitik perpustakaan dan laporan peminjaman</p>
      </div>
    </div>

    <div v-if="statsLoading" class="stats-grid">
      <div v-for="n in 5" :key="n" class="stat-card">
        <div class="skeleton" style="width: 80px; height: 14px; margin-bottom: 8px;"></div>
        <div class="skeleton" style="width: 50px; height: 32px;"></div>
      </div>
    </div>

    <div v-else-if="statsError" class="empty-state">
      <div class="empty-icon">⚠️</div>
      <h3>Gagal memuat statistik dashboard</h3>
      <p>{{ statsError }}</p>
      <button class="btn btn-primary" type="button" @click="loadDashboard">Coba Lagi</button>
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Buku</div>
        <div class="stat-value">{{ summary.total_books || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total E-Buku</div>
        <div class="stat-value">{{ summary.total_ebooks || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Dipinjam</div>
        <div class="stat-value">{{ summary.total_borrowed || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Dikembalikan</div>
        <div class="stat-value">{{ summary.total_returned || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Rusak</div>
        <div class="stat-value">{{ summary.damaged || 0 }}</div>
      </div>
    </div>

    <ReportCharts v-if="!statsLoading && !statsError" />

    <div class="filter-bar">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: activeFilter === tab.value }"
        @click="setFilter(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="tableLoading" class="card" style="padding: 0;">
      <div v-for="n in 4" :key="n" class="skeleton" style="height: 48px; margin: 8px;"></div>
    </div>

    <div v-else-if="tableError" class="empty-state">
      <div class="empty-icon">⚠️</div>
      <h3>Gagal memuat data laporan</h3>
      <p>{{ tableError }}</p>
      <button class="btn btn-primary" type="button" @click="loadTable">Coba Lagi</button>
    </div>

    <div v-else-if="!tableData.length" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>Tidak ada data</h3>
      <p>Tidak ada data peminjaman yang sesuai dengan filter</p>
    </div>

    <div v-else class="card" style="padding: 0; overflow: hidden;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Buku</th>
              <th>Peminjam</th>
              <th>Tanggal Pinjam</th>
              <th>Jatuh Tempo</th>
              <th>Dikembalikan Pada</th>
              <th>Status</th>
              <th>Kondisi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.id || row.book_title + row.borrow_date">
              <td><strong>{{ row.book_title || '-' }}</strong></td>
              <td>{{ row.borrower_name || '-' }}</td>
              <td>{{ row.borrow_date || '-' }}</td>
              <td>{{ row.due_date || '-' }}</td>
              <td>{{ row.returned_at || '-' }}</td>
              <td>
                <span :class="['badge', statusBadge(row.status)]">
                  {{ statusLabel(row.status) }}
                </span>
              </td>
              <td>
                <span :class="['badge', conditionBadge(row.book_condition)]">
                  {{ conditionLabel(row.book_condition) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchReports, fetchBorrowReport } from '@/api/report.js'
import ReportCharts from '@/components/report/ReportCharts.vue'

const summary = ref({})
const statsLoading = ref(true)
const statsError = ref('')
const tableData = ref([])
const tableLoading = ref(false)
const tableError = ref('')
const activeFilter = ref('all')

const filterTabs = [
  { value: 'all', label: 'Semua' },
  { value: 'keterlambatan', label: 'Terlambat' },
  { value: 'belum_kembali', label: 'Belum Dikembalikan' },
  { value: 'rusak', label: 'Rusak' },
]

function statusLabel(status) {
  if (status === 'dikembalikan') return 'Dikembalikan'
  if (status === 'terlambat') return 'Terlambat'
  if (status === 'dipinjam') return 'Dipinjam'
  if (status === 'ditolak') return 'Ditolak'
  if (status === 'menunggu') return 'Menunggu'
  return status || '-'
}

function statusBadge(status) {
  if (status === 'dikembalikan') return 'badge-success'
  if (status === 'terlambat') return 'badge-danger'
  if (status === 'dipinjam') return 'badge-info'
  if (status === 'ditolak') return 'badge-danger'
  if (status === 'menunggu') return 'badge-warning'
  return 'badge-info'
}

function conditionLabel(cond) {
  if (cond === 'sedikit_rusak') return 'Sedikit Rusak'
  if (cond === 'rusak') return 'Rusak'
  return 'Aman'
}

function conditionBadge(cond) {
  if (cond === 'rusak') return 'badge-danger'
  if (cond === 'sedikit_rusak') return 'badge-warning'
  return 'badge-success'
}

function friendlyError(msg) {
  if (!msg) return 'Terjadi kesalahan yang tidak terduga'
  if (msg === 'INTERNAL_SERVER_ERROR') return 'Kesalahan server. Silakan coba lagi nanti.'
  if (msg === 'FORBIDDEN') return 'Anda tidak memiliki izin untuk mengakses data ini.'
  return msg
}

async function loadDashboard() {
  statsLoading.value = true
  statsError.value = ''
  try {
    const result = await fetchReports()
    summary.value = result.summary || {}
  } catch (err) {
    statsError.value = friendlyError(err.message)
  } finally {
    statsLoading.value = false
  }
}

async function loadTable() {
  tableLoading.value = true
  tableError.value = ''
  try {
    tableData.value = await fetchBorrowReport(activeFilter.value)
  } catch (err) {
    tableError.value = friendlyError(err.message)
  } finally {
    tableLoading.value = false
  }
}

function setFilter(value) {
  activeFilter.value = value
  loadTable()
}

onMounted(async () => {
  await Promise.allSettled([loadDashboard(), loadTable()])
})
</script>

<style scoped>
@media (max-width: 640px) {
  .filter-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
  }

  .filter-tab {
    flex-shrink: 0;
    font-size: 12px;
    padding: 5px 12px;
  }
}
</style>
