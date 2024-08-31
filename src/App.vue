<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import MainLayout from "./layouts/MainLayout.vue";
import { useCalendarStore } from "@/stores/calendar";
import { useDatesStore } from "@/stores/dates";
import { useWeeklyStore } from "@/stores/weekly";

onMounted(() => {
  const date = new Date();
  useCalendarStore().getMonth({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  });
  useDatesStore().getDates();
  useWeeklyStore().getWeekly();
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
