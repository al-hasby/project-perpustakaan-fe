import { get, unwrapList } from './index.js'

export async function fetchReports() {
  const dashboard = await get('/reports/dashboard')

  return {
    summary: {
      total_borrowed: dashboard.total_pinjam || 0,
      not_returned:
        dashboard.total_belum_kembali || Math.max(0, (dashboard.total_pinjam || 0) - (dashboard.total_kembali || 0)),
      overdue: dashboard.total_terlambat || dashboard.keterlambatan || 0,
      damaged: dashboard.total_rusak || dashboard.rusak || 0,
      total_books: dashboard.total_books || 0,
      total_ebooks: dashboard.total_ebooks || 0,
      total_returned: dashboard.total_kembali || 0,
    },
  }
}

export async function fetchOverdue() {
  return fetchBorrowReport('keterlambatan')
}

export async function fetchDamagedBooks() {
  return (await fetchBorrowReport('rusak')).map((item) => ({
    ...item,
    title: item.book_title,
    condition: getConditionLabel(item.book_condition),
    note: item.status || '-',
  }))
}

export async function fetchBorrowReport(filter = 'all') {
  return unwrapReportRows(await get('/reports/peminjaman', { filter }))
}

function unwrapReportRows(payload) {
  return unwrapList(payload, ['rows']).map((item) => ({
    ...item,
    book_title: item.book_title || item.judul_buku || '',
    borrow_date: item.borrow_date || item.tanggal_pinjam || '',
    due_date: item.due_date || item.tanggal_kembali || '',
    returned_at: item.returned_at || item.dikembalikan_pada || null,
    book_condition: item.book_condition || item.kondisi_buku || 'aman',
  }))
}

function getConditionLabel(condition) {
  if (condition === 'sedikit_rusak') return 'Sedikit rusak'
  if (condition === 'rusak') return 'Rusak'
  return 'Aman'
}
