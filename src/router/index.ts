import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCalendarStore } from '@/stores/calendar';
import { clearStorage, getStoredUser } from '../utils/helpers';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsView.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListView.vue')
    },
    {
      path: '/:pathMatch(.*)',
      name: 'error',
      component: () => import('../views/ErrorView.vue')
    },
  ]
})

const checkLsAuth = (authStore: any) => {
  const { token, id, role } = getStoredUser();

  if (token === null || id === null || role === null) {
    clearStorage();
    authStore.clearUserData();
  }
}

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  checkLsAuth(authStore);
  const isAuthenticated = authStore.isAuthenticated;
  const currentDate = new Date();
  const testString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
  if (isAuthenticated && to.name === 'login' && typeof from.path !== "undefined") {
    return { name: 'dashboard' }
  }
  if (to.name === 'calendar' && authStore.user.role !== 'admin') {
    return { name: 'dashboard' }
  }
  if (authStore.lastDay === '') {
    authStore.lastDay = testString;
  }
  if (authStore.lastDay !== '' && authStore.lastDay !== testString && authStore.user.role === 'admin') {
    authStore.lastDay = testString;
    useCalendarStore().getMonth({ year: currentDate.getFullYear(), month: currentDate.getMonth() + 1 });
  }
})

export default router
