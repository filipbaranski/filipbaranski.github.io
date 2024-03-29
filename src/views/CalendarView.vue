<script setup lang="ts">
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar';
import CalendarModal from '@/components/CalendarModal.vue';
import Cube from '@/assets/svg/Cube.svg';
import CubeWhite from '@/assets/svg/CubeWhite.svg';

const calendarStore = useCalendarStore();
const { calendar, calendarDaysUpdating, calendarLoading } = storeToRefs(calendarStore);

const currentDate = new Date();

const state = reactive({
  currentDate,
  editModalOpen: false,
  editedData: {},
  currentDay: currentDate.getDate(),
  month: currentDate.getMonth(),
  year: currentDate.getFullYear(),
});

const firstDayOfSelectedMonth = computed(() => {
  return new Date(state.year, state.month, 1);
});

const emptyDays = computed(() => {
  const emptyBefore = firstDayOfSelectedMonth.value.getDay() + 1;
  if (emptyBefore === 1) return 6;
  return emptyBefore - 2;
});

const daysInMonth = computed(() => {
  return new Date(state.year, state.month + 1, 0).getDate();
});

const openEditModal = (day: number) => {
  if ((day <= state.currentDay
    || state.month !== state.currentDate.getMonth()
    || state.year !== state.currentDate.getFullYear())
    && calendarStore.calendarLoading === false
    && calendarStore.calendarDaysUpdating.length === 0) {
    const { _id, red, is_cube } = calendarStore.calendar;
    const data = {
      date: `${day >= 10
        ? day : `0${day}`}.${state.month >= 9 ? state.month + 1
        : `0${state.month + 1}`}.${state.year}`,
      id: _id,
      day,
      month: state.month,
      year: state.year,
      red: red.indexOf(day) !== -1,
      is_cube: is_cube.indexOf(day) !== -1,
    };
    state.editedData = data;
    state.editModalOpen = true;
  }
}

const closeEditModal = () => {
  state.editModalOpen = false;
  state.editedData = {};
}

const loadMonth = async (direction: any) => {
  const isOnline = window.navigator.onLine;
  if (isOnline) {
    if (direction === 'previous' && state.month === 0) {
      const response = await calendarStore.getMonth({ year: state.year - 1, month: 12 });
      if (response === true) {
        state.month = 11;
        state.year -= 1;
        return;
      }
      return;
    }
    if (direction === 'previous' && state.month !== 0) {
      const response = await calendarStore.getMonth({ year: state.year, month: state.month });
      if (response === true) {
        state.month -= 1;
        return;
      }
      return;
    }
    if (direction === 'next' && state.month === 11) {
      const response = await calendarStore.getMonth({ year: state.year + 1, month: 1 });
      if (response === true) {
        state.month = 0;
        state.year += 1;
        return;
      }
      return;
    }
    if (direction === 'next' && state.month !== 11) {
      const response = await calendarStore.getMonth({ year: state.year, month: state.month + 2 });
      if (response === true) {
        state.month += 1;
      }
    }
  }
}
</script>

<template>
  <section class="calendar">
    <CalendarModal
      v-if="state.editModalOpen"
      :data="state.editedData"
      @closeModal="closeEditModal"
    />
    <nav>
      <button
        :disabled="(state.year === 2024 && state.month === 0)
          || calendarLoading
          || calendarDaysUpdating.length !== 0"
        @click="loadMonth('previous')"
      >
        Poprzedni
      </button>
      <h2>
        {{
          `${new Date(state.year, state.month, 1)
            .toLocaleString('default', { month: 'long' })} ${state.year}`
        }}
      </h2>
      <button
        :disabled="(state.year === currentDate.getFullYear() && state.month === currentDate.getMonth())
          || calendarLoading
          || calendarDaysUpdating.length !== 0"
        @click="loadMonth('next')"
      >
        Następny
      </button>
    </nav>
    <main
      v-if="calendar.year && calendarDaysUpdating !== null"
      class="calendar-proper"
    >
      <div
        v-if="calendarLoading || calendarDaysUpdating.length !== 0"
        class="calendar-loader"
      />
      <div
        v-if="calendarLoading || calendarDaysUpdating.length !== 0"
        class="calendar-mask"
      />
      <div
        v-for="day of emptyDays"
        :key="`empty-${day}`"
        class="calendar-day"
      />
      <div
        v-for="day of daysInMonth"
        :key="`actual-${day}`"
        :class="{
          'calendar-day': true,
          'calendar-day-filled': true,
          'red': calendar.red.indexOf(day) !== -1,
          'weekend': 
            (day + firstDayOfSelectedMonth.getDay()) % 7 === 0 ||
            (day + firstDayOfSelectedMonth.getDay()) % 7 === 1,
          'blocked':
            day > state.currentDay &&
            state.month === currentDate.getMonth() &&
            state.year === currentDate.getFullYear(),
            'current': day === state.currentDay &&
            state.month === currentDate.getMonth() &&
            state.year === currentDate.getFullYear()
        }"
        @click="openEditModal(day)"
      >
        <p
          v-if="day > state.currentDay &&
            state.month === currentDate.getMonth() &&
            state.year === currentDate.getFullYear()"
        >
          {{ day }}
        </p>
        <div
          v-if="day <= state.currentDay ||
            state.month !== currentDate.getMonth() ||
            state.year !== currentDate.getFullYear()"
          class="calendar-day-footer"
        >
          <img
            :src="calendar.is_cube.indexOf(day) === -1 ? Cube : CubeWhite"
          >
        </div>
      </div>
    </main>
  </section>
</template>

<style scoped lang="scss">
@import '@/styles/global.scss';

@keyframes rotateLoader {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;

  h2 {
    text-transform: capitalize;
    text-align: center;
    font-size: 14px;
  }

  button {
    border: 2px solid $border-green;
    outline: none;
    background-color: transparent;
    padding: 5px 10px;
    border-radius: $standard-border-radius;
    font-size: 12px;

    &:hover {
      cursor: pointer;
      background-color: $pale-green;
    }

    &:disabled {
      border: 2px solid $pale-grey;
      background-color: $white;
      cursor: default;
    }
  }
}

.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-mask {
    position: absolute;
    top: -5px;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    background-color: $white;
    z-index: 1000;
    opacity: 0.5;
    cursor: default;
  }

  &-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    right: 10px;
    height: 20px;
    width: 20px;
    border-radius: $full-border-radius;
    border-top: 3px solid $border-green;
    border-bottom: 3px solid $border-green;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    z-index: 10000;
    animation: rotateLoader 1s linear infinite;
    cursor: default;
  }

  &-proper {
    position: relative;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 4px;
    flex-wrap: wrap;
    width: 100%;
    max-width: 600px;
    margin-top: 30px;
    z-index: 0;
  }

  &-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    font-size: 12px;
    font-weight: 600;
    border: 2px solid $white;
    border-radius: $standard-border-radius;

    img {
      width: 20px;
      height: 20px;
    }

    &-filled {
      background: -webkit-linear-gradient(225deg, rgba(153,204,51,0.8) 0%,
        rgba(153,204,51,1) 60%);

      &:hover {
        cursor: pointer;
        color: $white;
        opacity: 0.7;
      }

      &.red {
        background: -webkit-linear-gradient(225deg, #B90E0AA0 0%,
            #B90E0ADA 60%);
      }

      &.blocked {
        cursor: default;
        color: $black;
        background: $palest-grey;
        &:hover { opacity: 1; }
      }

      &.current {
        width: 100%;
        border: 2px solid #151515;
      }

      &.weekend {
        background-color: $palest-green;
        color: $border-green;
      }
    }

    &-footer {
      position: absolute;
      height: 100%;
      width: 100%;

      img {
        position: absolute;
        bottom: 5px;
        left: 5px;
      }
    }
  }
}

@media only screen and (min-width: 1024px) {
  nav {
    h2 {
      font-size: 20px;
    }

    button {
      padding: 10px 20px;
      font-size: 14px;
    }
  }

  .calendar {
    &-day {
      font-size: 14px;
    }
  }
}

</style>