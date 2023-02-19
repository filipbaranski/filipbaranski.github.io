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
  if (token !== null && id !== null) {
    authStore.user.token = token;
    authStore.user.id = id;
    const date = new Date();
    useCalendarStore().getMonth({ year: date.getFullYear(), month: date.getMonth() + 1 });
    useDatesStore().getDates();
  } else {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    authStore.user.token = '';
    authStore.user.id = '';
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
