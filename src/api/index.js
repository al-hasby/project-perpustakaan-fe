import { useAuthStore } from '@/stores/auth.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData || options.body === undefined
        ? options.body
        : JSON.stringify(options.body),
  })

  if (response.status === 401 && !authStore.token?.startsWith('dummy-token')) {
    authStore.clearAuth()
    window.location.href = '/login'
  }

  const text = await response.text()
  const data = text ? parseJson(text) : null

  if (!response.ok) {
    const message = data?.message || 'Terjadi kesalahan pada server'
    throw new Error(message)
  }

  return data
}

export function get(endpoint) {
  return request(endpoint)
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

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export default { get, post, put, delete: del }
