<script setup lang="ts">
import router from "./router";
import { clearStorage, getStoredUser } from "./utils/helpers";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCalendarStore } from "@/stores/calendar";
import { useDatesStore } from "@/stores/dates";
import { usePeriodicStore } from "@/stores/periodic";

const authStore = useAuthStore();

onMounted(() => {
  const { token, id } = getStoredUser();
  if (token !== null && id !== null) {
    authStore.user.token = token;
    authStore.user.id = id;
    const date = new Date();
    useCalendarStore().getMonth({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
    useDatesStore().getDates();
    usePeriodicStore().getPeriodic();
  } else {
    clearStorage();
    authStore.clearUserData();
    router.push("/login");
  }
});
</script>

<template>
  <main class="main">
    <RouterView />
  </main>
</template>

<style lang="scss">
.main {
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
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
