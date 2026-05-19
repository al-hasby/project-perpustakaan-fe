import { get, unwrapList } from './index.js'
import { normalizeBook } from './books.js'

export async function fetchEbooks() {
  const ebooks = unwrapList(await get('/ebooks'), ['books', 'ebooks'])
  return ebooks.map(normalizeEbook)
}

export async function fetchPdfAccess(bookId) {
  return normalizeEbook(await get(`/ebooks/${bookId}`))
}

function normalizeEbook(ebook = {}) {
  return normalizeBook({
    ...ebook,
    pengarang: ebook.pengarang || ebook.penulis,
    pdf_file: ebook.pdf_file || ebook.file_url,
  })
}
