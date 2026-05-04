import { get, post, put, del, unwrapList } from './index.js'

export const DUMMY_BOOKS_KEY = 'dummy_books'

const dummyBooks = [
  {
    id: 1,
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    publisher: 'Bentang Pustaka',
    year: 2005,
    stock: 8,
    category: 'Novel',
    pdf_url: '',
    cover_url:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 2,
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    publisher: 'Hasta Mitra',
    year: 1980,
    stock: 5,
    category: 'Sastra',
    pdf_url: '',
    cover_url:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 3,
    title: 'Dasar-Dasar Pemrograman Web',
    author: 'Tim Perpustakaan Digital',
    publisher: 'Perpustakaan Sekolah',
    year: 2026,
    stock: 12,
    category: 'Teknologi',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cover_url:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 4,
    title: 'Sejarah Indonesia Ringkas',
    author: 'R. Nugroho',
    publisher: 'Nusantara Edukasi',
    year: 2021,
    stock: 7,
    category: 'Sejarah',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cover_url:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=480&q=80',
  },
]

export async function fetchBooks() {
  try {
    const books = unwrapList(await get('/books'), ['books'])
    return books.length ? books.map(normalizeBook) : getDummyBooks()
  } catch {
    return getDummyBooks()
  }
}

export async function searchBooks(query) {
  try {
    const books = unwrapList(await get(`/books?search=${encodeURIComponent(query)}`), ['books'])
    return books.length ? books.map(normalizeBook) : searchDummyBooks(query)
  } catch {
    return searchDummyBooks(query)
  }
}

export async function addBook(bookData) {
  const payload = toBackendBook(bookData)

  try {
    return normalizeBook(await post('/books', payload))
  } catch {
    const books = getDummyBooks()
    const nextBook = {
      ...normalizeBook(bookData),
      id: getNextId(books),
    }

    saveDummyBooks([...books, nextBook])
    return nextBook
  }
}

export async function updateBook(id, bookData) {
  const payload = toBackendBook(bookData)

  try {
    return normalizeBook(await put(`/books/${id}`, payload))
  } catch {
    const books = getDummyBooks()
    const updatedBook = { ...normalizeBook(bookData), id }

    saveDummyBooks(books.map((book) => (Number(book.id) === Number(id) ? updatedBook : book)))
    return updatedBook
  }
}

export async function deleteBook(id) {
  try {
    return await del(`/books/${id}`)
  } catch {
    saveDummyBooks(getDummyBooks().filter((book) => Number(book.id) !== Number(id)))
    return { success: true }
  }
}

export function getDummyBooks() {
  const storedBooks = localStorage.getItem(DUMMY_BOOKS_KEY)

  if (!storedBooks) {
    saveDummyBooks(dummyBooks)
    return dummyBooks
  }

  try {
    const books = JSON.parse(storedBooks).map((book, index) => ({
      ...book,
      cover_url: book.cover_url || dummyBooks[index]?.cover_url || '',
    }))

    saveDummyBooks(books)
    return books
  } catch {
    saveDummyBooks(dummyBooks)
    return dummyBooks
  }
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

export function saveDummyBooks(books) {
  localStorage.setItem(DUMMY_BOOKS_KEY, JSON.stringify(books))
}

function searchDummyBooks(query) {
  const keyword = query.toLowerCase()

  return getDummyBooks().filter((book) => {
    return [book.title, book.author, book.publisher, book.category]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword))
  })
}

function getNextId(books) {
  return Math.max(0, ...books.map((book) => Number(book.id) || 0)) + 1
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
  }
}
