import { getData, save } from '@/data/store.js'

function normalizeBorrow(borrow = {}) {
  const status = borrow.status || 'dipinjam'
  const approvalStatus = ['menunggu', 'pending'].includes(status) ? 'pending'
    : ['ditolak', 'rejected'].includes(status) ? 'rejected'
    : 'approved'

  return {
    ...borrow,
    book_id: borrow.book_id || borrow.id_buku || null,
    book_title: borrow.book_title || borrow.judul_buku || '',
    borrow_date: borrow.borrow_date || borrow.tanggal_pinjam || '',
    due_date: borrow.due_date || borrow.tanggal_kembali || '',
    returned_at: borrow.returned_at || borrow.dikembalikan_pada || null,
    book_condition: borrow.book_condition || borrow.kondisi_buku || 'aman',
    status,
    approval_status: approvalStatus,
    approved_at: borrow.approved_at || null,
    rejected_at: borrow.rejected_at || null,
  }
}

export async function fetchBorrows() {
  return getData().borrows.map(normalizeBorrow)
}

export async function createBorrow(borrowData) {
  const data = getData()
  const book = data.books.find(b => String(b.id) === String(borrowData.id_buku || borrowData.book_id))
  if (!book) throw new Error('Buku tidak ditemukan')

  const newBorrow = {
    id: `b-${Date.now()}`,
    member_id: borrowData.member_id || null,
    borrower_name: borrowData.borrower_name || '',
    id_buku: Number(borrowData.id_buku || borrowData.book_id),
    judul_buku: book.judul,
    tanggal_pinjam: borrowData.tanggal_pinjam || borrowData.borrow_date || '',
    tanggal_kembali: borrowData.tanggal_kembali || borrowData.due_date || '',
    dikembalikan_pada: null,
    status: 'menunggu',
    kondisi_buku: borrowData.kondisi_buku || borrowData.book_condition || 'aman',
    approval_status: 'pending',
  }

  data.borrows.push(newBorrow)
  save(data)
  return normalizeBorrow(newBorrow)
}

export async function approveBorrow(id, bookCondition = 'aman') {
  const data = getData()
  const borrow = data.borrows.find(b => b.id === id)
  if (!borrow) throw new Error('Peminjaman tidak ditemukan')

  borrow.status = 'dipinjam'
  borrow.approval_status = 'approved'
  borrow.kondisi_buku = bookCondition === 'buku aman' ? 'aman' : bookCondition

  if (borrow.id_buku) {
    const book = data.books.find(b => b.id === borrow.id_buku)
    if (book) book.stok = Math.max(0, book.stok - 1)
  }

  save(data)
  return normalizeBorrow(borrow)
}

export async function rejectBorrow(id) {
  const data = getData()
  const borrow = data.borrows.find(b => b.id === id)
  if (!borrow) throw new Error('Peminjaman tidak ditemukan')

  borrow.status = 'ditolak'
  borrow.approval_status = 'rejected'

  save(data)
  return normalizeBorrow(borrow)
}

export async function returnBorrow(id, returnedAt, bookCondition = 'aman') {
  const data = getData()
  const borrow = data.borrows.find(b => b.id === id)
  if (!borrow) throw new Error('Peminjaman tidak ditemukan')

  borrow.status = 'dikembalikan'
  borrow.dikembalikan_pada = returnedAt || new Date().toISOString().slice(0, 10)
  borrow.kondisi_buku = bookCondition === 'buku aman' ? 'aman' : bookCondition

  if (borrow.id_buku) {
    const book = data.books.find(b => b.id === borrow.id_buku)
    if (book) book.stok += 1
  }

  save(data)
  return normalizeBorrow(borrow)
}

export async function deleteBorrow(id) {
  const data = getData()
  data.borrows = data.borrows.filter(b => b.id !== id)
  save(data)
}
