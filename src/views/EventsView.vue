<script setup lang="ts">
import { computed, reactive, onUpdated, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useDatesStore } from "@/stores/dates";
import { useWeeklyStore } from "@/stores/weekly";
import AddButton from "@/components/Events/AddButton.vue";
import EventsModal from "@/components/Events/EventsModal.vue";
import WeeklyModal from "@/components/Events/WeeklyModal.vue";

const datesStore = useDatesStore();
const weeklyStore = useWeeklyStore();

const { dates } = storeToRefs(datesStore);
const { weekly } = storeToRefs(weeklyStore);

const days = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

const state = reactive({
  addModalOpen: false,
  editModalOpen: false,
  addWeeklyOpen: false,
  editWeeklyOpen: false,
  editedData: {},
  editedWeekly: {},
  yearlyOpen: false,
  yearlyOpenHeight: 0,
  weeklyOpen: false,
  weeklyOpenHeight: 0,
  eventsOpen: true,
  eventsOpenHeight: 0,
});

const orderedWeekly = computed(() => {
  console.log(weekly.value);
  if (weekly.value.length !== 0) {
    const data = weekly.value;
    const result = data.sort(compareWeekly);
    return result;
  }
  return [];
});

const orderedDates = computed(() => {
  if (dates.value.length !== 0) {
    const data = dates.value;
    const filtered = data.filter((date) => !date.year);
    const result = filtered.sort(compare);
    return result;
  }
  return [];
});

const orderedOneTimeDates = computed(() => {
  if (dates.value.length !== 0) {
    const data = dates.value;
    const filtered = data.filter((date) => date.year);
    const result = filtered.sort(compareWithYear);
    return result;
  }
  return [];
});

const compare = (a: any, b: any) => {
  if (`${a.month}${a.day}` > `${b.month}${b.day}`) return 1;
  if (`${b.month}${b.day}` > `${a.month}${a.day}`) return -1;

  return 0;
};

const compareWithYear = (a: any, b: any) => {
  if (`${a.year}${a.month}${a.day}` > `${b.year}${b.month}${b.day}`) return 1;
  if (`${b.year}${b.month}${b.day}` > `${a.year}${a.month}${a.day}`) return -1;

  return 0;
};

const compareWeekly = (a: any, b: any) => {
  if (`${a.dayNumber}` > `${b.dayNumber}`) return 1;
  if (`${b.dayNumber}` > `${a.dayNumber}`) return -1;

  return 0;
};

const openModal = () => {
  state.addModalOpen = true;
};

const closeModal = () => {
  state.addModalOpen = false;
};

const openEditModal = (data: any) => {
  state.editedData = data;
  state.editModalOpen = true;
};

const closeEditModal = () => {
  state.editModalOpen = false;
};

const openWeeklyModal = () => {
  state.addWeeklyOpen = true;
};

const closeWeeklyModal = () => {
  state.addWeeklyOpen = false;
};

const openWeeklyEditModal = (data: any) => {
  state.editedWeekly = data;
  state.editWeeklyOpen = true;
};

const closeWeeklyEditModal = () => {
  state.editWeeklyOpen = false;
};

const toggle = (e: any, data: any) => {
  switch (data) {
    case "yearlyOpen": {
      state.yearlyOpen = !state.yearlyOpen;
      break;
    }
    case "weeklyOpen": {
      state.weeklyOpen = !state.weeklyOpen;
      break;
    }
    case "eventsOpen": {
      state.eventsOpen = !state.eventsOpen;
      break;
    }
    default:
      break;
  }
};

const passed = (date: any) => {
  const currentDate = new Date();
  const entryDate = new Date(date.year, date.month - 1, date.day, 23, 59, 59);
  return entryDate < currentDate;
};

const getHeights = () => {
  const eventsContent = document.getElementById("eventsDrawer").children[0];
  const eventsHeight = eventsContent.clientHeight;
  state.eventsOpenHeight = eventsHeight;
  const yearlyContent = document.getElementById("yearlyDrawer").children[0];
  const yearlyHeight = yearlyContent.clientHeight;
  state.yearlyOpenHeight = yearlyHeight;
  const weeklyContent = document.getElementById("weeklyDrawer").children[0];
  console.log(weeklyContent);
  const weeklyHeight = weeklyContent.clientHeight;
  state.weeklyOpenHeight = weeklyHeight;
};

onMounted(() => getHeights());
onUpdated(() => getHeights());
</script>

<template>
  <section class="date">
    <EventsModal
      v-if="state.addModalOpen"
      type="add"
      @closeModal="closeModal"
    />
    <EventsModal
      v-if="state.editModalOpen"
      type="edit"
      :data="state.editedData"
      @closeModal="closeEditModal"
    />
    <WeeklyModal
      v-if="state.addWeeklyOpen"
      type="add"
      @closeModal="closeWeeklyModal"
    />
    <WeeklyModal
      v-if="state.editWeeklyOpen"
      type="edit"
      :data="state.editedWeekly"
      @closeModal="closeWeeklyEditModal"
    />
    <section
      :class="{
        'date-header': true,
        'date-header-first': true,
        open: state.yearlyOpen,
      }"
      @click="(e: Event) => toggle(e, 'yearlyOpen')"
    >
      <p>Coroczne</p>
    </section>
    <div
      id="yearlyDrawer"
      :class="{
        'date-items_container': true,
        closed: !state.yearlyOpen,
      }"
      :style="{ 'max-height': `${state.yearlyOpenHeight + 20}px` }"
    >
      <p class="date-placeholder" v-if="orderedDates.length === 0">
        Jeszcze nic tu nie ma. Dodaj nową datę używając przycisku na dole
        ekranu.
      </p>
      <section v-if="orderedDates.length !== 0">
        <div
          v-for="date of orderedDates"
          :key="date.id"
          :class="{
            'date-container': true,
          }"
          @click="openEditModal(date)"
        >
          <p class="date-format">{{ date.day }}.{{ date.month }}</p>
          <p class="date-event">
            {{ date.event }}
          </p>
        </div>
      </section>
    </div>
    <section
      :class="{
        'date-header': true,
        open: state.weeklyOpen,
      }"
      @click="(e: Event) => toggle(e, 'weeklyOpen')"
    >
      <p>Cotygodniowe</p>
    </section>
    <div
      id="weeklyDrawer"
      :class="{
        'date-items_container': true,
        closed: !state.weeklyOpen,
      }"
      :style="{ 'max-height': `${state.weeklyOpenHeight + 20}px` }"
    >
      <section>
        <span class="date-weekly_button" @click="openWeeklyModal">
          <button>+</button>
        </span>
        <section v-if="orderedWeekly.length !== 0">
          <div
            v-for="weekly of orderedWeekly"
            :key="weekly.id"
            :class="{
              'date-container': true,
            }"
            @click="openWeeklyEditModal(weekly)"
          >
            <p class="date-format-name">{{ days[weekly.dayNumber] }}</p>
            <p class="date-event">
              {{ weekly.event }}
            </p>
          </div>
        </section>
      </section>
    </div>
    <section
      :class="{
        'date-header': true,
        open: state.eventsOpen,
      }"
      @click="(e: Event) => toggle(e, 'eventsOpen')"
    >
      <p>Nadchodzące wydarzenia</p>
    </section>
    <div
      id="eventsDrawer"
      :class="{
        'date-items_container': true,
        closed: !state.eventsOpen,
      }"
      :style="{ 'max-height': `${state.eventsOpenHeight + 20}px` }"
    >
      <p class="date-placeholder" v-if="orderedOneTimeDates.length === 0">
        Jeszcze nic tu nie ma. Dodaj nową datę używając przycisku na dole
        ekranu.
      </p>
      <section v-if="orderedOneTimeDates.length !== 0">
        <div
          v-for="date of orderedOneTimeDates"
          :key="date.id"
          :class="{ 'date-container': true, grey: passed(date) === true }"
          @click="openEditModal(date)"
        >
          <p class="date-format">
            {{ date.day }}.{{ date.month }}.{{ date.year }}
          </p>
          <p class="date-event">
            {{ date.event }}
          </p>
        </div>
      </section>
    </div>
    <section @click="openModal">
      <AddButton />
    </section>
  </section>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";

.date {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;

  &-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 4px);
    height: 14px;
    font-size: 18px;
    padding: 10px 0;
    margin-top: 10px;
    cursor: pointer;
    border: 2px solid $border-green;
    transition: all 0.3s;
    border-top-right-radius: $standard-border-radius;
    border-top-left-radius: $standard-border-radius;
    border-bottom-right-radius: $standard-border-radius;
    border-bottom-left-radius: $standard-border-radius;

    &-first {
      margin-top: 0;
    }

    &.open {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      background-color: $pale-green;
      transition: all 0.3s;
    }
  }

  &-weekly_button {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 10px 0;

    button {
      font-size: 26px;
      color: $white;
      border: none;
      border-radius: $standard-border-radius;
      background-color: $border-green;
      width: calc(100% - 20px);
      height: 30px;
      cursor: pointer;
    }
  }

  &-items_container {
    width: calc(100% - 4px);
    border: 2px solid $border-green;
    border-top: none;
    opacity: 1;
    transform-origin: top;
    max-height: 0px;
    overflow: hidden;
    transition: all 0.3s;
    border-bottom-right-radius: $standard-border-radius;
    border-bottom-left-radius: $standard-border-radius;

    &.closed {
      opacity: 0;
      max-height: 0px !important;
      transition: all 0.3s;
    }
  }

  &-container {
    position: relative;
    width: auto;
    display: flex;
    align-items: center;
    margin: 10px;
    border: 2px solid $border-green;
    min-height: 25px;
    font-size: 14px;
    z-index: 1;
    background-color: $white;
    border-radius: $standard-border-radius;

    &.grey {
      border: 2px solid $grey;

      > .date-format {
        background-color: $grey;
      }

      &:hover {
        background: $pale-grey;
      }
    }

    &:hover {
      background: $pale-green;
      cursor: pointer;
    }

    section {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 18px;
        height: 18px;
        margin-left: 12px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    &-space {
      width: 100%;
      height: 20px;
    }
  }

  &-placeholder {
    padding: 10px;
    color: $grey;
    text-align: center;
    font-style: italic;
    letter-spacing: 0.5px;
  }

  &-format {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $white;
    height: 100%;
    background-color: $border-green;
    padding: 0 5px;
    position: absolute;
    width: 65px;

    &-name {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $white;
      height: 100%;
      background-color: $border-green;
      padding: 0 5px;
      position: absolute;
      width: 65px;
      font-size: 12px;
    }
  }

  &-event {
    flex: 5;
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: flex-start;
    padding-left: 85px;
  }
}

@media only screen and (min-width: 1024px) {
  .date {
    &-header {
      font-size: 20px;
      height: 20px;

      &:hover {
        background-color: $pale-green;
        transition: all 0.3s;
      }
    }

    &-container {
      font-size: 18px;
      min-height: 30px;
      border: 1px solid $border-green;

      &.grey {
        border: 1px solid $grey;
      }
    }

    &-separator {
      font-size: 20px;
    }

    &-format {
      width: 170px;
    }

    &-event {
      justify-content: center;
      padding-left: 0;
    }
  }
}
</style>
