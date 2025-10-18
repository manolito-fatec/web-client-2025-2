import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AccountConfirmView from '@/views/AccountConfirmView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/verify-email/:token',
      component: AccountConfirmView,
      name: 'verify-email'
    }
  ],
})

export default router
