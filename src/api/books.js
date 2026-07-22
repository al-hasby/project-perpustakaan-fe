import { getData, save } from '@/data/store.js'

export function normalizeBook(book = {}) {
  return {
    id: book.id,
    title: book.title || book.judul || '',
    author: book.author || book.pengarang || '',
    publisher: book.publisher || book.penerbit || '',
    year: book.year || book.tahun_terbit || '',
    stock: book.stock ?? book.stok ?? 0,
    category: book.category || book.kategori || '',
    pdf_url: book.pdf_url || book.pdfUrl || book.pdf_file || '',
    cover_url: book.cover_url || book.coverUrl || book.cover || '',
    created_at: book.created_at,
    updated_at: book.updated_at,
  }
}

export async function fetchBooks() {
  return getData().books.map(normalizeBook)
}

export async function searchBooks(query) {
  const books = await fetchBooks()
  const keyword = query.toLowerCase()
  return books.filter(b =>
    [b.title, b.author, b.publisher, b.category]
      .filter(Boolean)
      .some(v => v.toLowerCase().includes(keyword))
  )
}

export async function addBook(bookData) {
  const data = getData()
  const maxId = data.books.reduce((max, b) => Math.max(max, b.id || 0), 0)
  const newBook = {
    id: maxId + 1,
    judul: bookData.title || bookData.judul || '',
    pengarang: bookData.author || bookData.pengarang || '',
    penerbit: bookData.publisher || bookData.penerbit || '',
    tahun_terbit: bookData.year || bookData.tahun_terbit || null,
    kategori: bookData.category || bookData.kategori || '',
    stok: bookData.stock ?? bookData.stok ?? 0,
    pdf_file: bookData.pdf_url || bookData.pdf_file || null,
    cover_url: bookData.cover_url || null,
  }
  data.books.push(newBook)
  save(data)
  return normalizeBook(newBook)
}

export async function updateBook(id, bookData) {
  const data = getData()
  const idx = data.books.findIndex(b => String(b.id) === String(id))
  if (idx === -1) throw new Error('Buku tidak ditemukan')

  data.books[idx] = {
    ...data.books[idx],
    judul: bookData.title || bookData.judul || data.books[idx].judul,
    pengarang: bookData.author || bookData.pengarang || data.books[idx].pengarang,
    penerbit: bookData.publisher || bookData.penerbit || data.books[idx].penerbit,
    tahun_terbit: bookData.year || bookData.tahun_terbit || data.books[idx].tahun_terbit,
    kategori: bookData.category || bookData.kategori || data.books[idx].kategori,
    stok: bookData.stock ?? bookData.stok ?? data.books[idx].stok,
    pdf_file: bookData.pdf_url || bookData.pdf_file || data.books[idx].pdf_file,
    cover_url: bookData.cover_url || data.books[idx].cover_url,
  }
  save(data)
  return normalizeBook(data.books[idx])
}

export async function deleteBook(id) {
  const data = getData()
  data.books = data.books.filter(b => String(b.id) !== String(id))
  save(data)
}
