import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("../views/CalendarView.vue"),
    },
    {
      path: "/events",
      name: "events",
      component: () => import("../views/EventsView.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "error",
      component: () => import("../views/ErrorView.vue"),
    },
  ],
});

export default router;
