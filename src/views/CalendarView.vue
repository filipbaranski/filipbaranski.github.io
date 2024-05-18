<script setup lang="ts">
import { computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import CalendarModal from "@/components/CalendarModal.vue";
import Cube from "@/assets/svg/Cube.svg";
import CubeWhite from "@/assets/svg/CubeWhite.svg";

const calendarStore = useCalendarStore();
const { calendar } = storeToRefs(calendarStore);

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
  if (
    day <= state.currentDay ||
    state.month !== state.currentDate.getMonth() ||
    state.year !== state.currentDate.getFullYear()
  ) {
    const { red, is_cube } = calendarStore.calendar;
    const data = {
      date: `${day >= 10 ? day : `0${day}`}.${
        state.month >= 9 ? state.month + 1 : `0${state.month + 1}`
      }.${state.year}`,
      day,
      month: state.month,
      year: state.year,
      red: red.indexOf(day) !== -1,
      is_cube: is_cube.indexOf(day) !== -1,
    };
    state.editedData = data;
    state.editModalOpen = true;
  }
};

const closeEditModal = () => {
  state.editModalOpen = false;
  state.editedData = {};
};
</script>

<template>
  <section class="calendar">
    <CalendarModal
      v-if="state.editModalOpen"
      :data="state.editedData"
      @closeModal="closeEditModal"
    />
    <nav>
      <h2>
        {{
          `${new Date(state.year, state.month, 1).toLocaleString("default", {
            month: "long",
          })} ${state.year}`
        }}
      </h2>
    </nav>
    <main class="calendar-proper">
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
          red: calendar.red.indexOf(day) !== -1,
          weekend:
            (day + firstDayOfSelectedMonth.getDay()) % 7 === 0 ||
            (day + firstDayOfSelectedMonth.getDay()) % 7 === 1,
          blocked:
            day > state.currentDay &&
            state.month === currentDate.getMonth() &&
            state.year === currentDate.getFullYear(),
          current:
            day === state.currentDay &&
            state.month === currentDate.getMonth() &&
            state.year === currentDate.getFullYear(),
        }"
        @click="openEditModal(day)"
      >
        <p
          v-if="
            day > state.currentDay &&
            state.month === currentDate.getMonth() &&
            state.year === currentDate.getFullYear()
          "
        >
          {{ day }}
        </p>
        <div
          v-if="
            day <= state.currentDay ||
            state.month !== currentDate.getMonth() ||
            state.year !== currentDate.getFullYear()
          "
          class="calendar-day-footer"
        >
          <img :src="calendar.is_cube.indexOf(day) === -1 ? Cube : CubeWhite" />
        </div>
      </div>
    </main>
  </section>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;

  h2 {
    text-transform: capitalize;
    text-align: center;
    font-size: 14px;
  }
}

.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;

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
      background: -webkit-linear-gradient(
        225deg,
        rgba(153, 204, 51, 0.8) 0%,
        rgba(153, 204, 51, 1) 60%
      );

      &:hover {
        cursor: pointer;
        color: $white;
        opacity: 0.7;
      }

      &.red {
        background: -webkit-linear-gradient(
          225deg,
          #b90e0aa0 0%,
          #b90e0ada 60%
        );
      }

      &.blocked {
        cursor: default;
        color: $black;
        background: $palest-grey;
        &:hover {
          opacity: 1;
        }
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
  }

  .calendar {
    &-day {
      font-size: 14px;
    }
  }
}
</style>
