import { getData } from '@/data/store.js'
import { normalizeBook } from './books.js'

export async function fetchEbooks() {
  return getData().ebooks.map(e => normalizeBook({
    ...e,
    pengarang: e.pengarang || e.penulis,
    pdf_file: e.pdf_file || e.file_url,
  }))
}

export async function fetchPdfAccess(bookId) {
  const ebook = getData().ebooks.find(e => String(e.id) === String(bookId))
  if (!ebook) throw new Error('Ebook tidak ditemukan')
  return normalizeBook({
    ...ebook,
    pengarang: ebook.pengarang || ebook.penulis,
    pdf_file: ebook.pdf_file || ebook.file_url,
  })
}
