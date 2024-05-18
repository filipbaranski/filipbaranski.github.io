<script setup lang="ts">
import { reactive } from "vue";
import CalendarModal from "@/components/CalendarModal.vue";
import DashboardCalendar from "@/components/Dashboard/DashboardCalendar.vue";
import DashboardEvents from "@/components/Dashboard/DashboardEvents.vue";

const state = reactive({
  editModalOpen: false,
  editedData: {},
});

const openEditModal = (data: any) => {
  state.editModalOpen = true;
  state.editedData = data;
};

const closeEditModal = () => {
  state.editModalOpen = false;
  state.editedData = {};
};
</script>

<template>
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
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";

@keyframes moduleUpFadeIn {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

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
    animation: moduleUpFadeIn 1s;
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
