import { get, post, put, del, unwrapList } from './index.js'

export async function fetchBorrows() {
  const borrows = unwrapList(await get('/borrow'), ['borrows', 'borrow'])
  return borrows.map(normalizeBorrow)
}

export async function createBorrow(borrowData) {
  const payload = toBackendBorrow(borrowData)

  return normalizeBorrow(await post('/borrow', payload))
}

export async function approveBorrow(id, bookCondition = 'aman') {
  return normalizeBorrow(
    await put(`/borrow/${id}/approve`, {
      kondisi_buku: normalizeBookCondition(bookCondition),
    }),
  )
}

export async function rejectBorrow(id) {
  return normalizeBorrow(await put(`/borrow/${id}/reject`, {}))
}

export async function returnBorrow(id, returnedAt = new Date().toISOString().slice(0, 10), bookCondition = 'aman') {
  const payload = {
    dikembalikan_pada: returnedAt,
    kondisi_buku: normalizeBookCondition(bookCondition),
  }

  return normalizeBorrow(await put(`/borrow/${id}/return`, payload))
}

export async function deleteBorrow(id) {
  return await del(`/borrow/${id}`)
}

function normalizeBorrow(borrow = {}) {
  const status = borrow.status || borrow.approval_status || borrow.status_persetujuan || 'dipinjam'
  const approvalStatus = normalizeApprovalStatus(status)

  return {
    ...borrow,
    book_id: borrow.book_id || borrow.id_buku || borrow.book?.id || null,
    book_title: borrow.book_title || borrow.judul_buku || borrow.book?.title || borrow.book?.judul || '',
    borrow_date: borrow.borrow_date || borrow.tanggal_pinjam || '',
    due_date: borrow.due_date || borrow.tanggal_kembali || '',
    returned_at: borrow.returned_at || borrow.dikembalikan_pada || null,
    book_condition: normalizeBookCondition(borrow.book_condition || borrow.kondisi_buku || 'aman'),
    status,
    approval_status: approvalStatus,
    approved_at: borrow.approved_at || borrow.disetujui_pada || borrow.tanggal_disetujui || null,
    rejected_at: borrow.rejected_at || borrow.ditolak_pada || borrow.tanggal_ditolak || null,
  }
}

function normalizeApprovalStatus(status) {
  if (['menunggu', 'pending'].includes(status)) return 'pending'
  if (['ditolak', 'rejected'].includes(status)) return 'rejected'
  return 'approved'
}

function toBackendBorrow(borrow = {}) {
  return {
    borrower_name: borrow.borrower_name || '',
    id_buku: borrow.id_buku || borrow.book_id || null,
    tanggal_pinjam: borrow.tanggal_pinjam || borrow.borrow_date || '',
    tanggal_kembali: borrow.tanggal_kembali || borrow.due_date || '',
    kondisi_buku: normalizeBookCondition(borrow.kondisi_buku || borrow.book_condition || 'aman'),
    member_id: borrow.member_id || null,
  }
}

function normalizeBookCondition(condition = 'aman') {
  if (condition === 'buku aman') return 'aman'
  if (condition === 'sedikit rusak') return 'sedikit_rusak'
  return ['aman', 'sedikit_rusak', 'rusak'].includes(condition) ? condition : 'aman'
}
