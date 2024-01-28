<script setup lang="ts">
import router from './router';
import { clearStorage, getStoredUser } from './utils/helpers';
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { useCalendarStore } from '@/stores/calendar';
import { useDatesStore } from '@/stores/dates';

const authStore = useAuthStore();

onMounted(() => {
  const { token, id, role } = getStoredUser();
  if (token !== null && id !== null && role !== null) {
    authStore.user.token = token;
    authStore.user.id = id;
    authStore.user.role = role;
    const date = new Date();
    if (role === 'admin') useCalendarStore().getMonth({ year: date.getFullYear(), month: date.getMonth() + 1 });
    useDatesStore().getDates();
  } else {
    clearStorage();
    authStore.clearUserData();
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
