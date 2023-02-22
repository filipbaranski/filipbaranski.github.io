<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar';
import CalendarModal from '@/components/CalendarModal.vue';
import DashboardCalendar from '@/components/Dashboard/DashboardCalendar.vue';
import DashboardEvents from '@/components/Dashboard/DashboardEvents.vue';

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
}

const closeEditModal = () => {
  state.editModalOpen = false;
  state.editedData = {};
}
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
        @openModal="openEditModal"
      />
      <DashboardEvents />
    </section>
    <div class="dashboard-background" />
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/global.scss';

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
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 100;
  }

  &-bottom_container {
    position: absolute;
    bottom: 20px;
  }
}

@media only screen and (min-width: 768px) {
  .dashboard {
    height: calc(100vh - 170px);
  }
}
</style>
