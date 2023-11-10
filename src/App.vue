<script setup lang="ts">
import router from './router';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { useCalendarStore } from '@/stores/calendar';
import { useDatesStore } from '@/stores/dates';

const authStore = useAuthStore();

onMounted(() => {
  const token = localStorage.getItem('userToken');
  const id = localStorage.getItem('userId');
  const role = localStorage.getItem('userRole');
  if (token !== null && id !== null && role !== null) {
    authStore.user.token = token;
    authStore.user.id = id;
    authStore.user.role = role;
    const date = new Date();
    if (role === 'admin') useCalendarStore().getMonth({ year: date.getFullYear(), month: date.getMonth() + 1 });
    useDatesStore().getDates();
  } else {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    authStore.user.token = '';
    authStore.user.id = '';
    authStore.user.role = '';
    router.push('/login');
  }
});
</script>

<template>
  <main class="main">
    <MainLayout>
      <RouterView />
    </MainLayout>
  </main>
</template>

<style lang="scss">
  .main {
    min-height: 100vh;
  }

  body::-webkit-scrollbar {
    display: none;
  }

  #app {
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .noscroll {
    overflow: hidden;
  }

</style>
