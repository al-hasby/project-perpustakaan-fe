import { getData, save } from '@/data/store.js'
import { useAuthStore } from '@/stores/auth.js'

function normalizeRole(role) {
  if (role === 'user') return 'member'
  return role || 'member'
}

export async function login(credentials) {
  const data = getData()
  const user = data.users.find(u => u.username === credentials.username)

  if (!user || user.password !== credentials.password) {
    throw new Error('Username atau password salah')
  }

  const token = btoa(JSON.stringify({ id: user.id, role: user.role }))
  const authStore = useAuthStore()
  const role = normalizeRole(user.role)
  const userData = { id: user.id, username: user.username, name: user.name, role }

  authStore.setAuth(token, userData, role)
  return { token, user: userData, role }
}

export async function register(userData) {
  const data = getData()
  const existing = data.users.find(u => u.username === (userData.email || userData.username))
  if (existing) {
    throw new Error('Username sudah digunakan')
  }

  const role = normalizeRole(userData.role || 'member')
  const backendRole = role === 'member' ? 'user' : role
  const newUser = {
    id: `u-${Date.now()}`,
    name: userData.name,
    username: userData.email || userData.username,
    password: userData.password,
    role: backendRole,
  }

  data.users.push(newUser)
  save(data)

  const token = btoa(JSON.stringify({ id: newUser.id, role: backendRole }))
  const authStore = useAuthStore()
  const user = { id: newUser.id, username: newUser.username, name: newUser.name, role }

  authStore.setAuth(token, user, role)
  return { token, user, role }
}

export async function logout() {
  const authStore = useAuthStore()
  authStore.clearAuth()
}
