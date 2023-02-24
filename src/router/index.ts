import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

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

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  navigator.serviceWorker.ready.then((registration) => {
    console.log("Test2")
    registration.update();
  });
  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
  if (isAuthenticated && to.name === 'login' && typeof from.path !== "undefined") {
    return { name: 'dashboard' }
  }
})

export default router
