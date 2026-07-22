import { getData } from '@/data/store.js'

export async function fetchReports() {
  const { borrows, books, ebooks } = getData()
  const total_pinjam = borrows.filter(b => b.status !== 'ditolak').length
  const total_kembali = borrows.filter(b => b.status === 'dikembalikan').length
  const total_belum_kembali = borrows.filter(b => b.status === 'dipinjam').length
  const total_terlambat = borrows.filter(b => {
    if (b.status !== 'dipinjam') return false
    return new Date(b.tanggal_kembali) < new Date()
  }).length
  const total_rusak = borrows.filter(b =>
    b.kondisi_buku === 'rusak' || b.kondisi_buku === 'sedikit_rusak'
  ).length

  return {
    summary: {
      total_borrowed: total_pinjam,
      not_returned: total_belum_kembali,
      overdue: total_terlambat,
      damaged: total_rusak,
      total_books: books.length,
      total_ebooks: ebooks.length,
      total_returned: total_kembali,
    },
  }
}

export async function fetchOverdue() {
  return fetchBorrowReport('keterlambatan')
}

export async function fetchDamagedBooks() {
  return (await fetchBorrowReport('rusak')).map(item => ({
    ...item,
    title: item.book_title,
    condition: item.book_condition === 'sedikit_rusak' ? 'Sedikit rusak'
      : item.book_condition === 'rusak' ? 'Rusak' : 'Aman',
    note: item.status || '-',
  }))
}

export async function fetchBorrowReport(filter = 'all') {
  const { borrows } = getData()
  let rows = [...borrows]

  switch (filter) {
    case 'keterlambatan':
      rows = rows.filter(b => b.status === 'dipinjam' && new Date(b.tanggal_kembali) < new Date())
      break
    case 'belum_kembali':
      rows = rows.filter(b => b.status === 'dipinjam')
      break
    case 'rusak':
      rows = rows.filter(b => b.kondisi_buku === 'rusak' || b.kondisi_buku === 'sedikit_rusak')
      break
  }

  return rows.map(item => ({
    ...item,
    book_title: item.book_title || item.judul_buku || '',
    borrow_date: item.borrow_date || item.tanggal_pinjam || '',
    due_date: item.due_date || item.tanggal_kembali || '',
    returned_at: item.returned_at || item.dikembalikan_pada || null,
    book_condition: item.book_condition || item.kondisi_buku || 'aman',
  }))
}
