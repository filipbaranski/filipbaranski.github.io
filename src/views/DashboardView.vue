<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import MainLayout from "@/layouts/MainLayout.vue";
import CalendarModal from "@/components/CalendarModal.vue";
import DashboardCalendar from "@/components/Dashboard/DashboardCalendar.vue";
import DashboardEvents from "@/components/Dashboard/DashboardEvents.vue";

const calendarStore = useCalendarStore();
const { calendarLoading } = storeToRefs(calendarStore);

const state = reactive({
  editModalOpen: false,
  editedData: {},
});

const openEditModal = (data: any) => {
  if (!calendarLoading.value) {
    state.editModalOpen = true;
    state.editedData = data;
  }
};

const closeEditModal = () => {
  state.editModalOpen = false;
  state.editedData = {};
};

onMounted(() => {
  const currentCalendar = calendarStore.calendar;
  const date = new Date();
  const month = Number(date.getMonth()) + 1;
  const year = Number(date.getFullYear());
  if (
    Number(currentCalendar.month) !== month ||
    Number(currentCalendar.year) !== year
  ) {
    useCalendarStore().getMonth({ year, month: month });
  }
});
</script>

<template>
  <MainLayout>
    <div class="dashboard">
      <CalendarModal
        v-if="state.editModalOpen"
        :data="state.editedData"
        @closeModal="closeEditModal"
      />
      <section class="dashboard-layout dashboard-bottom_container">
        <DashboardCalendar @openModal="openEditModal" />
        <DashboardEvents />
      </section>
      <div class="dashboard-background" />
    </div>
  </MainLayout>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;
@use "@/styles/keyframes.scss" as *;

.dashboard {
  position: relative;

  &-background {
    height: calc(100vh - 155px);
    opacity: 0.4;
    background-image: url("../assets/icon.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 256px;
  }

  &-layout {
    position: absolute;
    text-align: center;
    z-index: 100;
  }

  &-bottom_container {
    position: absolute;
    width: 100%;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    animation: dashboardModuleUpFadeIn 1s;
    animation-delay: -0.1s;
  }
}

@media only screen and (min-width: 768px) {
  .dashboard {
    &-background {
      height: calc(100vh - 190px);
    }
  }
}
</style>
