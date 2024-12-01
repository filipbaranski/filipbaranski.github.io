<script setup lang="ts">
import { computed, reactive, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDatesStore } from "@/stores/dates";
import { usePeriodicStore } from "@/stores/periodic";
import MainLayout from "@/layouts/MainLayout.vue";
import AddButton from "@/components/Events/AddButton.vue";
import AddPeriodicButton from "@/components/Events/AddPeriodicButton.vue";
import EventsModal from "@/components/Events/EventsModal.vue";
import PeriodicModal from "@/components/Events/PeriodicModal.vue";

const datesStore = useDatesStore();
const periodicStore = usePeriodicStore();

const { dates, datesDateUpdating, datesLoading } = storeToRefs(datesStore);
const { periodic, periodicDateUpdating, periodicLoading } =
  storeToRefs(periodicStore);

const days = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

const isAnyDataFetching = computed(() => {
  return (
    datesLoading.value === true ||
    datesDateUpdating.value.length !== 0 ||
    periodicLoading.value === true ||
    periodicDateUpdating.value.length !== 0
  );
});

const isAnyDataUpdating = computed(() => {
  return (
    (datesLoading.value === true && datesDateUpdating.value.length === 0) ||
    (periodicLoading.value === true && periodicDateUpdating.value.length === 0)
  );
});

const state = reactive({
  addModalOpen: false,
  editModalOpen: false,
  addPeriodicOpen: false,
  editPeriodicOpen: false,
  editedData: {},
  editedPeriodic: {},
  yearlyOpen: false,
  yearlyOpenHeight: 0,
  periodicOpen: false,
  periodicOpenHeight: 0,
  eventsOpen: true,
  eventsOpenHeight: 0,
});

const orderedPeriodic = computed(() => {
  if (periodic.value.length !== 0) {
    const data = periodic.value;
    const result = data.sort(comparePeriodic);
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

const comparePeriodic = (a: any, b: any) => {
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

const openPeriodicModal = () => {
  state.addPeriodicOpen = true;
};

const closePeriodicModal = () => {
  state.addPeriodicOpen = false;
};

const openPeriodicEditModal = (data: any) => {
  state.editedPeriodic = data;
  state.editPeriodicOpen = true;
};

const closePeriodicEditModal = () => {
  state.editPeriodicOpen = false;
};

const toggle = (e: any, data: any) => {
  switch (data) {
    case "yearlyOpen": {
      state.yearlyOpen = !state.yearlyOpen;
      break;
    }
    case "periodicOpen": {
      state.periodicOpen = !state.periodicOpen;
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
  const weeklyContent = document.getElementById("periodicDrawer").children[0];
  const weeklyHeight = weeklyContent.clientHeight;
  state.periodicOpenHeight = weeklyHeight;
};

watch(isAnyDataFetching, () => {
  getHeights();
});

onMounted(() => getHeights());
</script>

<template>
  <MainLayout>
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
      <PeriodicModal
        v-if="state.addPeriodicOpen"
        type="add"
        @closeModal="closePeriodicModal"
      />
      <PeriodicModal
        v-if="state.editPeriodicOpen"
        type="edit"
        :data="state.editedPeriodic"
        @closeModal="closePeriodicEditModal"
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
              loading: datesDateUpdating.indexOf(date._id) !== -1,
            }"
            @click="openEditModal(date)"
          >
            <p class="date-format">{{ date.day }}.{{ date.month }}</p>
            <p class="date-event">
              {{ date.event }}
            </p>
            <div
              v-if="
                (datesLoading === true && datesDateUpdating.length === 0) ||
                datesDateUpdating.indexOf(date._id) !== -1
              "
              class="date-loader"
            />
            <div v-if="isAnyDataFetching" class="date-mask" />
          </div>
        </section>
      </div>
      <section
        :class="{
          'date-header': true,
          open: state.periodicOpen,
        }"
        @click="(e: Event) => toggle(e, 'periodicOpen')"
      >
        <p>Cotygodniowe</p>
      </section>
      <div
        id="periodicDrawer"
        :class="{
          'date-items_container': true,
          closed: !state.periodicOpen,
        }"
        :style="{ 'max-height': `${state.periodicOpenHeight + 20}px` }"
      >
        <section>
          <section>
            <section @click="openPeriodicModal">
              <AddPeriodicButton />
            </section>
            <div
              v-for="periodic of orderedPeriodic"
              :key="periodic.id"
              :class="{
                'date-container': true,
                loading: periodicDateUpdating.indexOf(periodic._id) !== -1,
              }"
              @click="openPeriodicEditModal(periodic)"
            >
              <p class="date-format-name">{{ days[periodic.dayNumber] }}</p>
              <p class="date-event">
                {{ periodic.event }}
              </p>
              <div
                v-if="
                  isAnyDataUpdating ||
                  periodicDateUpdating.indexOf(periodic._id) !== -1
                "
                class="date-loader"
              />
              <div v-if="isAnyDataFetching" class="date-mask" />
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
            :class="{
              'date-container': true,
              grey: passed(date) === true,
              loading: datesDateUpdating.indexOf(date._id) !== -1,
            }"
            @click="openEditModal(date)"
          >
            <p class="date-format">
              {{ date.day }}.{{ date.month }}.{{ date.year }}
            </p>
            <p class="date-event">
              {{ date.event }}
            </p>
            <div
              v-if="
                isAnyDataUpdating || datesDateUpdating.indexOf(date._id) !== -1
              "
              class="date-loader"
            />
            <div v-if="isAnyDataFetching" class="date-mask" />
          </div>
        </section>
      </div>
      <section @click="openModal">
        <AddButton />
      </section>
    </section>
  </MainLayout>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;
@use "@/styles/keyframes.scss" as *;

.date {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;

  &-loader {
    position: absolute;
    top: 50%;
    right: 5px;
    height: 14px;
    width: 14px;
    border-radius: $full-border-radius;
    border-top: 3px solid $border-green;
    border-bottom: 3px solid $border-green;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    z-index: 10000;
    animation: rotateLoader 1s linear infinite;
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

    &.loading {
      z-index: -1;
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
      font-size: 11px;
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

    &-loader {
      bottom: -6px;
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

      &-name {
        font-size: 18px;
        width: 170px;
      }
    }

    &-event {
      justify-content: center;
      padding-left: 0;
    }
  }
}
</style>
