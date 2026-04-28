import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginForm from '../components/LoginForm.vue'
import BookList from '../views/BookList.vue'
import BorrowPage from '../views/BorrowPage.vue'
import ContactPage from '../views/ContactPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginForm },
  { path: '/buku', name: 'BookList', component: BookList },
  { path: '/peminjaman', name: 'Borrow', component: BorrowPage },
  { path: '/kontak', name: 'Contact', component: ContactPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
