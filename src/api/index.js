export const API_BASE_URL = ''

export function get() { return Promise.resolve() }
export function post() { return Promise.resolve() }
export function put() { return Promise.resolve() }
export function del() { return Promise.resolve() }

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
  return path
}

export default { get, post, put, delete: del }
