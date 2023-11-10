<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar';
import { useAuthStore } from '@/stores/auth';
import CalendarModal from '@/components/CalendarModal.vue';
import DashboardCalendar from '@/components/Dashboard/DashboardCalendar.vue';
import DashboardEvents from '@/components/Dashboard/DashboardEvents.vue';

const calendarStore = useCalendarStore();
const authStore = useAuthStore();
const { calendarLoading } = storeToRefs(calendarStore);
const { user } = storeToRefs(authStore);

const state = reactive({
  editModalOpen: false,
  editedData: {},
});

const openEditModal = (data: any) => {
  if (!calendarLoading.value) {
    state.editModalOpen = true;
    state.editedData = data;
  }
}

const closeEditModal = () => {
  state.editModalOpen = false;
  state.editedData = {};
}

onMounted(() => {
  if (user.value.role === 'admin') {
    const currentCalendar = calendarStore.calendar;
    const date = new Date();
    const month = Number(date.getMonth()) + 1;
    const year = Number(date.getFullYear());
    if (Number(currentCalendar.month) !== month || Number(currentCalendar.year) !== year) {
      useCalendarStore().getMonth({ year, month: month });
    }
  }
});
</script>

<template>
  <div class="dashboard">
    <CalendarModal
      v-if="state.editModalOpen"
      :data="state.editedData"
      @closeModal="closeEditModal"
    />
    <section class="dashboard-layout dashboard-bottom_container">
      <DashboardCalendar
        v-if="user.role === 'admin'"
        @openModal="openEditModal"
      />
      <DashboardEvents />
    </section>
    <div class="dashboard-background" />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/global.scss';

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
  margin: 0 10px;
  height: calc(100vh - 155px);
  position: relative;

  &-background {
    min-height: calc(100vh - 140px);
    opacity: 0.4;
    background-image: url('../assets/icon.png');
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
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: moduleUpFadeIn 1s;
    animation-delay: -0.1s;
  }
}

@media only screen and (min-width: 768px) {
  .dashboard {
    height: calc(100vh - 170px);
    &-background {
      min-height: calc(100vh - 150px);
    }
  }
}
</style>
