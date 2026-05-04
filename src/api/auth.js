import { post } from './index.js'
import { useAuthStore } from '@/stores/auth.js'

const dummyAccounts = [
  { id: 1, name: 'Admin Dummy', username: 'admin', role: 'admin' },
  { id: 2, name: 'Petugas Dummy', username: 'petugas', role: 'petugas' },
  { id: 3, name: 'Member Dummy', username: 'member', role: 'member' },
]

export async function login(credentials) {
  if (credentials.role || !credentials.email) {
    return loginDummy(credentials.role || credentials.username || 'member')
  }

  const data = await post('/auth/login', credentials)
  const authStore = useAuthStore()
  authStore.setAuth(data.token, data.user, data.role || data.user?.role || 'member')
  return data
}

export async function register(userData) {
  if (!userData.email) {
    return loginDummy(userData.role || 'member', userData.name)
  }

  const data = await post('/auth/register', userData)
  const authStore = useAuthStore()
  authStore.setAuth(data.token, data.user, data.role || data.user?.role || 'member')
  return data
}

export async function logout() {
  const authStore = useAuthStore()
  authStore.clearAuth()
}

export async function loginDummy(role = 'member', name = '') {
  const authStore = useAuthStore()
  const selectedRole = ['admin', 'petugas', 'member'].includes(role) ? role : 'member'
  const user =
    dummyAccounts.find((account) => account.role === selectedRole) || dummyAccounts[dummyAccounts.length - 1]

  const dummyUser = {
    ...user,
    name: name || user.name,
  }

  const data = {
    token: `dummy-token-${selectedRole}`,
    user: dummyUser,
    role: selectedRole,
  }

  authStore.setAuth(data.token, data.user, data.role)
  return data
}
