import { get, unwrapList } from './index.js'
import { getDummyBooks, normalizeBook } from './books.js'

export async function fetchEbooks() {
  try {
    const ebooks = unwrapList(await get('/books/pdf'), ['books', 'ebooks'])
    return ebooks.length ? ebooks.map(normalizeBook) : getDummyEbooks()
  } catch {
    return getDummyEbooks()
  }
}

export async function fetchPdfAccess(bookId) {
  try {
    return await get(`/books/pdf/${bookId}`)
  } catch {
    const book = getDummyBooks().find((item) => Number(item.id) === Number(bookId))
    return { pdf_url: book?.pdf_url || '' }
  }
}

function getDummyEbooks() {
  return getDummyBooks().filter((book) => book.pdf_url)
}
