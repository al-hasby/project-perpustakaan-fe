import { get, post, put, del, unwrapList } from './index.js'
import { getDummyBooks, saveDummyBooks } from './books.js'

const DUMMY_BORROWS_KEY = 'dummy_borrows'

export async function fetchBorrows() {
  try {
    const borrows = unwrapList(await get('/borrow'), ['borrows', 'borrow'])
    return borrows.length ? borrows : getDummyBorrows()
  } catch {
    return getDummyBorrows()
  }
}

export async function createBorrow(borrowData) {
  try {
    return await post('/borrow', borrowData)
  } catch {
    const books = getDummyBooks()
    const book = books.find((item) => Number(item.id) === Number(borrowData.book_id))

    if (!book) {
      throw new Error('Buku tidak ditemukan')
    }

    if (Number(book.stock) <= 0) {
      throw new Error('Stok buku habis')
    }

    const borrows = getDummyBorrows()
    const nextBorrow = {
      id: getNextId(borrows),
      book_id: book.id,
      book_title: book.title,
      borrower_name: borrowData.borrower_name,
      member_id: borrowData.member_id || null,
      borrow_date: borrowData.borrow_date,
      due_date: borrowData.due_date,
      returned_at: null,
      book,
    }

    saveDummyBorrows([...borrows, nextBorrow])
    saveDummyBooks(
      books.map((item) =>
        Number(item.id) === Number(book.id) ? { ...item, stock: Math.max(0, Number(item.stock) - 1) } : item,
      ),
    )

    return nextBorrow
  }
}

export async function returnBorrow(id) {
  try {
    return await put(`/return/${id}`, {})
  } catch {
    const borrows = getDummyBorrows()
    const borrow = borrows.find((item) => Number(item.id) === Number(id))

    if (!borrow || borrow.returned_at) {
      return borrow || { success: true }
    }

    const returnedBorrow = { ...borrow, returned_at: new Date().toISOString().slice(0, 10) }
    saveDummyBorrows(borrows.map((item) => (Number(item.id) === Number(id) ? returnedBorrow : item)))

    const books = getDummyBooks()
    saveDummyBooks(
      books.map((book) =>
        Number(book.id) === Number(borrow.book_id) ? { ...book, stock: Number(book.stock) + 1 } : book,
      ),
    )

    return returnedBorrow
  }
}

export async function deleteBorrow(id) {
  try {
    return await del(`/borrow/${id}`)
  } catch {
    saveDummyBorrows(getDummyBorrows().filter((borrow) => Number(borrow.id) !== Number(id)))
    return { success: true }
  }
}

function getDummyBorrows() {
  const storedBorrows = localStorage.getItem(DUMMY_BORROWS_KEY)

  if (!storedBorrows) return []

  try {
    return JSON.parse(storedBorrows)
  } catch {
    return []
  }
}

function saveDummyBorrows(borrows) {
  localStorage.setItem(DUMMY_BORROWS_KEY, JSON.stringify(borrows))
}

function getNextId(items) {
  return Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1
}
