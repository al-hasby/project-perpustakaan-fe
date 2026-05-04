import { get, unwrapList } from './index.js'

export async function fetchReports() {
  return await get('/report')
}

export async function fetchOverdue() {
  return unwrapList(await get('/report/overdue'), ['overdue'])
}

export async function fetchDamagedBooks() {
  return unwrapList(await get('/report/damaged'), ['damaged', 'books'])
}
