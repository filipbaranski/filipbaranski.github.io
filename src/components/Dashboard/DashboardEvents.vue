<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDatesStore } from "@/stores/dates";
import { useWeeklyStore } from "@/stores/weekly";

const datesStore = useDatesStore();
const weeklyStore = useWeeklyStore();

const { dates } = storeToRefs(datesStore);
const { weekly } = storeToRefs(weeklyStore);

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
  weekly.value.forEach((item) => {
    let dayNumber = parseInt(item.dayNumber) + 1;
    if (dayNumber === 7) dayNumber = 0;
    let daysLeft = (currentDay + dayNumber + 2) % 7;
    displayedEvents.push({ ...item, daysLeft });
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
    <RouterLink class="dates-link" to="/events">
      <div v-if="upcomingEvents.length !== 0" class="dates">
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
        <div class="dates-block">
          <p class="dates-placeholder">
            Brak nadchodzących wydarzeń w najbliżych siedmiu dniach
          </p>
        </div>
      </div>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";

.dates {
  max-height: 50vh;
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
