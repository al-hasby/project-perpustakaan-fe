<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Reports</h1>
        <p>Library analytics and borrowing reports</p>
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
      <h3>Failed to load dashboard stats</h3>
      <p>{{ statsError }}</p>
      <button class="btn btn-primary" type="button" @click="loadDashboard">Retry</button>
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Books</div>
        <div class="stat-value">{{ summary.total_books || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total E-Books</div>
        <div class="stat-value">{{ summary.total_ebooks || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Borrowed</div>
        <div class="stat-value">{{ summary.total_borrowed || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Returned</div>
        <div class="stat-value">{{ summary.total_returned || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Damaged</div>
        <div class="stat-value">{{ summary.damaged || 0 }}</div>
      </div>
    </div>

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
      <h3>Failed to load report data</h3>
      <p>{{ tableError }}</p>
      <button class="btn btn-primary" type="button" @click="loadTable">Retry</button>
    </div>

    <div v-else-if="!tableData.length" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>No data</h3>
      <p>No borrowing records match the selected filter</p>
    </div>

    <div v-else class="card" style="padding: 0; overflow: hidden;">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrower</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Returned At</th>
              <th>Status</th>
              <th>Condition</th>
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

const summary = ref({})
const statsLoading = ref(true)
const statsError = ref('')
const tableData = ref([])
const tableLoading = ref(false)
const tableError = ref('')
const activeFilter = ref('all')

const filterTabs = [
  { value: 'all', label: 'All' },
  { value: 'keterlambatan', label: 'Overdue' },
  { value: 'belum_kembali', label: 'Not Returned' },
  { value: 'rusak', label: 'Damaged' },
]

function statusLabel(status) {
  if (status === 'dikembalikan') return 'Returned'
  if (status === 'terlambat') return 'Overdue'
  if (status === 'dipinjam') return 'Borrowed'
  if (status === 'ditolak') return 'Rejected'
  if (status === 'menunggu') return 'Pending'
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
  if (cond === 'sedikit_rusak') return 'Slightly Damaged'
  if (cond === 'rusak') return 'Damaged'
  return 'Good'
}

function conditionBadge(cond) {
  if (cond === 'rusak') return 'badge-danger'
  if (cond === 'sedikit_rusak') return 'badge-warning'
  return 'badge-success'
}

function friendlyError(msg) {
  if (!msg) return 'An unexpected error occurred'
  if (msg === 'INTERNAL_SERVER_ERROR') return 'Server error. Please try again later.'
  if (msg === 'FORBIDDEN') return 'You do not have permission to access this data.'
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
