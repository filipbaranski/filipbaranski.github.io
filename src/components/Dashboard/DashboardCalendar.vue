<script setup lang="ts">
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar';
import Cube from '@/assets/svg/Cube.svg';
import CubeWhite from '@/assets/svg/CubeWhite.svg';

const calendarStore = useCalendarStore();
const { calendar, calendarLoading, calendarDaysUpdating } = storeToRefs(calendarStore);

const currentDate = new Date();

const state = reactive({
  currentDay: currentDate.getDate(),
  month: currentDate.getMonth(),
  year: currentDate.getFullYear(),
});

const editedData = computed(() => {
  const { _id, red, number, no_cube } = calendar.value;
  const day = state.currentDay;
  const data = {
    date: `${day >= 10
      ? day : `0${day}`}.${state.month >= 9 ? state.month + 1
      : `0${state.month + 1}`}.${state.year}`,
    id: _id,
    day,
    month: state.month,
    year: state.year,
    number: number[day - 1],
    red: red.indexOf(day) !== -1,
    no_cube: no_cube.indexOf(day) !== -1,
  };
  return data;
});
</script>

<template>
  <section
    v-if="calendar.year && calendarDaysUpdating !== null"
    class="calendar_day-container"
    @click="$emit('openModal', editedData)"
  >
    <div
      v-if="calendarLoading || calendarDaysUpdating.indexOf(state.currentDay) !== -1"
      class="calendar_day-loader"
    />
    <div
      v-if="calendarLoading || calendarDaysUpdating.indexOf(state.currentDay) !== -1"
      class="calendar_day-mask"
    />
    <div class="calendar_day">
      <div :class="{'calendar_day-circle': true, 'red': calendar.red.indexOf(state.currentDay) !== -1}"/>
      <img :src="calendar.no_cube.indexOf(state.currentDay) === -1 ? CubeWhite : Cube">
      <!-- <p>
        {{ calendar.number[state.currentDay - 1] || 0 }}
      </p> -->
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '@/styles/global.scss';

@keyframes rotateLoader {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}

.calendar_day {
  padding: 5px;
  border: 2px solid $border-green;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  &-container {
    position: relative;
    width: 75vw;
    margin: 0 auto;
  }

  &:hover {
    cursor: pointer;
    background: $pale-green;
  }

  &-circle {
    width: 24px;
    height: 24px;
    border-radius: 40px;
    background: -webkit-linear-gradient(225deg, rgba(153,204,51,0.8) 0%, rgba(153,204,51,1) 60%);

    &.red {
      background: -webkit-linear-gradient(225deg, rgba(185,14,10,0.8) 0%, rgba(185,14,10,1) 60%);
    }
  }

  img {
    min-width: 27px;
  }

  p {
    width: 27px;
    font-weight: 600;
  }

  &-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: $white;
    z-index: 1000;
    opacity: 0.5;
    cursor: default;
  }

  &-loader {
    position: absolute;
    top: 50%;
    right: 10px;
    height: 20px;
    width: 20px;
    border-radius: 20px;
    border-top: 3px solid $border-green;
    border-bottom: 3px solid $border-green;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    z-index: 10000;
    animation: rotateLoader 1s linear infinite;
  }
}

@media only screen and (min-width: 768px) {
  .calendar_day {
    font-size: 18px;

    &-container {
      width: 500px;
    }
  }
}
</style>
  