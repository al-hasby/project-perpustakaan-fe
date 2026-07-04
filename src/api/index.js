import { useAuthStore } from '@/stores/auth.js'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function request(endpoint, options = {}) {
  const authStore = useAuthStore()
  const headers = {
    Accept: 'application/json',
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  }

  if (authStore.token) {
    headers.Authorization = `Bearer ${authStore.token}`
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      body:
        options.body instanceof FormData || options.body === undefined
          ? options.body
          : JSON.stringify(options.body),
    })
  } catch {
    throw new Error('Cannot connect to server')
  }

  if (response.status === 401) {
    authStore.clearAuth()
    window.location.href = '/login'
    return
  }

  if (response.status === 403) {
    throw new Error('FORBIDDEN')
  }

  const text = await response.text()
  const data = text ? parseJson(text) : null

  if (!response.ok) {
    const devInfo = { status: response.status, statusText: response.statusText, body: text, json: data }
    if (import.meta.env.DEV) {
      // Log full response for debugging in development
      // eslint-disable-next-line no-console
      console.error('[API ERROR]', endpoint, devInfo)
    }

    const message = data?.message || data?.error || text || `HTTP ${response.status} ${response.statusText}` || 'Terjadi kesalahan pada server'
    throw new Error(message)
  }

  return data
}

export function get(endpoint, params = {}) {
  return request(withQuery(endpoint, params))
}

export function post(endpoint, data) {
  return request(endpoint, { method: 'POST', body: data })
}

export function put(endpoint, data) {
  return request(endpoint, { method: 'PUT', body: data })
}

export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' })
}

export function unwrapList(payload, keys = []) {
  if (Array.isArray(payload)) return payload

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }

  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export function resolveApiAssetUrl(path) {
  if (!path || path.startsWith('http') || path.startsWith('blob:')) return path || ''

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

function withQuery(endpoint, params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })

  const queryString = query.toString()
  return queryString ? `${endpoint}?${queryString}` : endpoint
}

export default { get, post, put, delete: del }
