import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    role: localStorage.getItem('role') || null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => state.role === 'admin',
    isPetugas: (state) => state.role === 'petugas',
    isMember: (state) => state.role === 'member',
    canReturnBooks: (state) => ['admin', 'petugas'].includes(state.role),
  },
  actions: {
    setAuth(token, user, role) {
      this.token = token
      this.user = user
      this.role = role
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('role', role)
    },
    clearAuth() {
      this.token = null
      this.user = null
      this.role = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    },
  },
})

