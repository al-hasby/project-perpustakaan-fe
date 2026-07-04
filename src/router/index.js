import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import UnauthorizedPage from '@/pages/UnauthorizedPage.vue'
import BooksPage from '@/pages/books/BooksPage.vue'
import BorrowPage from '@/pages/borrow/BorrowPage.vue'
import EbooksPage from '@/pages/ebooks/EbooksPage.vue'
import ReportPage from '@/pages/report/ReportPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage, alias: '/home' },
  { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterPage, meta: { guestOnly: true } },
  { path: '/books', name: 'books', component: BooksPage, meta: { requiresAuth: true } },
  { path: '/borrow', name: 'borrow', component: BorrowPage, meta: { requiresAuth: true, roles: ['admin', 'petugas', 'member', 'user'] } },
  { path: '/ebooks', name: 'ebooks', component: EbooksPage, meta: { requiresAuth: true, roles: ['member', 'user'] } },
  { path: '/report', name: 'report', component: ReportPage, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/unauthorized', name: 'unauthorized', component: UnauthorizedPage },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return { name: 'unauthorized' }
  }
})

export default router
