<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">TASK-004</p>
        <h1>Laporan Perpustakaan</h1>
        <p>Dashboard admin untuk melihat peminjaman, keterlambatan, dan kondisi buku.</p>
      </div>
    </div>

    <p v-if="error" class="alert error">{{ error }}</p>
    <ReportSummary :summary="summary" />

    <div class="report-grid">
      <section class="panel">
        <h2>Data Keterlambatan</h2>
        <OverdueTable :items="overdue" />
      </section>
      <section class="panel">
        <h2>Buku Rusak</h2>
        <DamagedTable :items="damaged" />
      </section>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchDamagedBooks, fetchOverdue, fetchReports } from '@/api/report.js'
import DamagedTable from '@/components/report/DamagedTable.vue'
import OverdueTable from '@/components/report/OverdueTable.vue'
import ReportSummary from '@/components/report/ReportSummary.vue'

const summary = ref({})
const overdue = ref([])
const damaged = ref([])
const error = ref('')

async function loadReport() {
  try {
    const [reportData, overdueData, damagedData] = await Promise.all([
      fetchReports(),
      fetchOverdue(),
      fetchDamagedBooks(),
    ])

    summary.value = reportData.summary || reportData
    overdue.value = reportData.overdue || overdueData
    damaged.value = reportData.damaged || damagedData
  } catch (err) {
    error.value = err.message
  }
}

onMounted(loadReport)
</script>
