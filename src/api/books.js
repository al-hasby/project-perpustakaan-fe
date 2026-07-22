import { get, post, put, del, unwrapList } from './index.js'

export async function fetchBooks() {
  const books = unwrapList(await get('/books'), ['books'])
  return books.map(normalizeBook)
}

export async function searchBooks(query) {
  const books = unwrapList(await get('/books'), ['books']).map(normalizeBook)
  return searchLocalBooks(books, query)
}

export async function addBook(bookData) {
  const payload = toBackendBook(bookData)

  const res = await post('/books', payload)
  const id = res?.id || res?.data?.id || null
  return { ...normalizeBook(bookData), id }
}

export async function updateBook(id, bookData) {
  const payload = toBackendBook(bookData)

  await put(`/books/${id}`, payload)
  return { ...normalizeBook(bookData), id }
}

export async function deleteBook(id) {
  return await del(`/books/${id}`)
}

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

function searchLocalBooks(books, query) {
  const keyword = query.toLowerCase()

  return books.filter((book) => {
    return [book.title, book.author, book.publisher, book.category]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword))
  })
}

function toBackendBook(book = {}) {
  return {
    judul: book.title || book.judul || '',
    pengarang: book.author || book.pengarang || '',
    penerbit: book.publisher || book.penerbit || '',
    tahun_terbit: book.year || book.tahun_terbit || null,
    kategori: book.category || book.kategori || '',
    stok: book.stock ?? book.stok ?? 0,
    pdf_file: book.pdf_url || book.pdf_file || null,
    cover_url: book.cover_url || book.coverUrl || book.cover || null,
  }
}
