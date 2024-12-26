<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { usePeriodicStore } from "@/stores/periodic";

const periodicStore = usePeriodicStore();

const { periodic, periodicDateUpdating, periodicLoading } =
  storeToRefs(periodicStore);

const upcomingEvents = computed(() => {
  const displayedEvents: any = [];
  const today = new Date();
  const currentDay = today.getDay();
  periodic.value.forEach((item) => {
    let dayNumber = parseInt(item.dayNumber) + 1;
    if (dayNumber === 7) dayNumber = 0;
    let daysLeft;
    if (currentDay <= dayNumber) daysLeft = dayNumber - currentDay;
    if (currentDay > dayNumber) daysLeft = 7 - currentDay + dayNumber;
    displayedEvents.push({ ...item, daysLeft });
    if (currentDay === dayNumber) {
      daysLeft = 7;
      displayedEvents.push({ ...item, daysLeft });
    }
  });
  return displayedEvents;
});

const eventFilter = (daysLeft: any) => {
  const events = upcomingEvents;
  const filteredEvents = events.value.filter(
    (event: any) => event.daysLeft === daysLeft
  );
  return filteredEvents;
};
</script>

<template>
  <section class="periodic-container">
    <div v-if="upcomingEvents.length !== 0" class="periodic">
      <div
        v-if="periodicLoading === true || periodicDateUpdating.length !== 0"
        class="periodic-loader"
      />
      <div v-for="index in 2" class="periodic-block" :key="index">
        <p class="periodic-heading">{{ index === 1 ? "Dzisiaj" : "Jutro" }}</p>
        <section class="periodic-date-block">
          <p v-if="eventFilter(index - 1).length === 0" class="periodic-date">
            ---
          </p>
          <p
            v-for="event in eventFilter(index - 1)"
            :key="event.id"
            class="periodic-date"
          >
            {{ event.event }}
          </p>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;
@use "@/styles/keyframes.scss" as *;

.periodic {
  padding: 15px 5px 0;
  border: 2px solid $pale-green;
  background-color: $palest-green;
  border-radius: $standard-border-radius;
  font-size: 14px;

  &-container {
    position: relative;
    width: 100%;
  }

  &-link {
    text-decoration: none;
    color: inherit;
  }

  &-heading {
    display: flex;
    justify-content: right;
    padding-right: 15px;
    margin-right: 15px;
    width: 80px;
    font-weight: bold;
    border-right: 2px solid $border-green;
  }

  &-date {
    line-height: 18px;

    &-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-block {
    display: flex;
    margin-bottom: 15px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &-loader {
    position: absolute;
    bottom: 0;
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
  }
}

@media only screen and (min-width: 768px) {
  .periodic {
    font-size: 18px;

    &-container {
      width: 600px;
    }
  }
}
</style>
