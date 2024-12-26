<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDatesStore } from "@/stores/dates";
import { usePeriodicStore } from "@/stores/periodic";

const datesStore = useDatesStore();

const { dates, datesDateUpdating, datesLoading } = storeToRefs(datesStore);

const daysInAdvance = 7;

const upcomingEvents = computed(() => {
  const displayedEvents: any = [];
  const msInDay = 24 * 60 * 60 * 1000;
  const timeInAdvance = daysInAdvance * msInDay;
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = new Date(currentYear, currentMonth, today.getDate());
  const currentDay = today.getDay();
  const currentTime = currentDate.getTime();
  dates.value.forEach((date: any) => {
    const eventDay = parseInt(date.day, 10);
    const eventMonth = parseInt(date.month, 10) - 1;
    let eventYear = currentYear;
    if (date.year) eventYear = parseInt(date.year, 10);
    if (eventMonth < currentMonth && eventYear - currentYear === 1) {
      eventYear = currentYear + 1;
    }
    const eventDate = new Date(eventYear, eventMonth, eventDay);
    const eventTime = eventDate.getTime();
    const timesDifference = eventTime - currentTime;
    const timeOffsetDiff =
      eventDate.getTimezoneOffset() - currentDate.getTimezoneOffset();
    const timeOffsetDiffMs = timeOffsetDiff * 60 * 1000;
    const finalTimesDifference = timesDifference - timeOffsetDiffMs;
    if (
      finalTimesDifference <= timeInAdvance &&
      finalTimesDifference > -1 * msInDay
    ) {
      const daysLeft = Math.round(finalTimesDifference / msInDay);
      displayedEvents.push({ ...date, daysLeft });
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
  <section class="dates-container">
    <div v-if="upcomingEvents.length !== 0" class="dates">
      <div
        v-if="datesLoading === true || datesDateUpdating.length !== 0"
        class="dates-loader"
      />
      <section v-for="n in daysInAdvance + 1" :key="n">
        <div v-if="eventFilter(n - 1).length !== 0" class="dates-block">
          <p v-if="n - 1 === 0" class="dates-heading">Dzisiaj</p>
          <p v-if="n - 1 === 1" class="dates-heading">Jutro</p>
          <p v-if="n - 1 > 1 && n - 1 !== 7" class="dates-heading">
            {{ `Za ${n - 1} dni` }}
          </p>
          <p v-if="n - 1 === 7" class="dates-heading">Za tydzień</p>
          <span v-for="event in eventFilter(n - 1)" :key="event.id">
            <p class="dates-date">{{ event.event }}</p>
          </span>
        </div>
      </section>
    </div>
    <div v-if="upcomingEvents.length === 0" class="dates">
      <div
        v-if="datesLoading === true || datesDateUpdating.length !== 0"
        class="dates-loader"
      />
      <div class="dates-block">
        <p class="dates-placeholder">
          Brak nadchodzących wydarzeń w najbliższych siedmiu dniach
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;
@use "@/styles/keyframes.scss" as *;

.dates {
  max-height: calc(100vh - 360px);
  overflow-y: scroll;
  padding: 15px 5px 0;
  border: 2px solid $border-green;
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
    width: fit-content;
    margin: 0 auto 5px;
    padding: 2px 6px;
    font-weight: bold;
    border-bottom: 2px solid $border-green;
  }

  &-date {
    line-height: 18px;
  }

  &-block {
    margin-bottom: 15px;
  }

  &-placeholder {
    padding: 0 30px;
    color: $grey;
    text-align: center;
    font-style: italic;
    letter-spacing: 0.5px;
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
  .dates {
    font-size: 18px;

    &-container {
      width: 600px;
    }
  }
}
</style>
