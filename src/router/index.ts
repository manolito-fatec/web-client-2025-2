import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import AccountConfirmView from '@/views/AccountConfirmView.vue'
import DashboardView from '../views/DashboardView.vue'
import InsightsView from '@/views/InsightsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/insights',
      name: 'insights',
      component: InsightsView,
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
