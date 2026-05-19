import { post } from './index.js'
import { useAuthStore } from '@/stores/auth.js'

export async function login(credentials) {
  const data = await post('/auth/login', {
    username: credentials.username,
    password: credentials.password,
  })
  const authStore = useAuthStore()
  const tokenPayload = decodeJwtPayload(data.token)
  const role = normalizeRole(data.role || data.user?.role || tokenPayload?.role)
  const user = data.user || {
    id: tokenPayload?.id || null,
    username: credentials.username,
    name: credentials.username,
    role,
  }

  authStore.setAuth(data.token, user, role)
  return data
}

export async function register(userData) {
  // Coba panggil endpoint backend dulu. Jika gagal (mis. endpoint belum tersedia),
  // lakukan fallback ke penyimpanan lokal untuk keperluan demo/klien saja.
  try {
    // Map FE role 'member' to backend role 'user' per FE-INTEGRATION contract
    const roleForBackend = (userData.role === 'member' || !userData.role) ? 'user' : userData.role
    const data = await post('/auth/register', {
      name: userData.name,
      username: userData.email || userData.username,
      password: userData.password,
      role: roleForBackend,
    })

    // Jika backend mengembalikan token, set auth seperti saat login.
    if (data?.token) {
      const authStore = useAuthStore()
      const tokenPayload = decodeJwtPayload(data.token)
      const role = normalizeRole(data.role || data.user?.role || tokenPayload?.role)
      const user = data.user || {
        id: tokenPayload?.id || null,
        username: userData.email || userData.username,
        name: userData.name || (userData.email || userData.username),
        role,
      }

      authStore.setAuth(data.token, user, role)
    }

    return data
  } catch (err) {
    // Fallback lokal: buat user sederhana di localStorage dan login otomatis.
    const fallbackUsersKey = 'local_demo_users'
    const users = JSON.parse(localStorage.getItem(fallbackUsersKey) || '[]')
    const id = Date.now()
    const role = normalizeRole(userData.role || 'member')
    const user = {
      id,
      username: userData.email || userData.username || `user${id}`,
      name: userData.name || (userData.email || userData.username) || `User ${id}`,
      role,
    }

    users.push({ ...user, password: userData.password })
    localStorage.setItem(fallbackUsersKey, JSON.stringify(users))

    // Buat token JWT palsu dengan payload minimal (base64 encoded JSON).
    const payload = { id: user.id, username: user.username, role: user.role }
    const base64 = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    const fakeToken = `fake.${base64(payload)}.sig`

    const authStore = useAuthStore()
    authStore.setAuth(fakeToken, user, user.role)

    return { token: fakeToken, user, role: user.role, _localFallback: true }
  }
}

export async function logout() {
  const authStore = useAuthStore()
  if (authStore.token) {
    try {
      await post('/auth/logout', {})
    } catch {
      // Logout lokal tetap dilakukan walau token sudah invalid di backend.
    }
  }
  authStore.clearAuth()
}

function normalizeRole(role) {
  if (role === 'user') return 'member'
  return role || 'member'
}

function decodeJwtPayload(token) {
  if (!token) return null

  try {
    const [, payload] = token.split('.')
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    )

    return JSON.parse(atob(paddedPayload))
  } catch {
    return null
  }
}
