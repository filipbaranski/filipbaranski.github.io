<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDatesStore } from "@/stores/dates";
import { usePeriodicStore } from "@/stores/periodic";

const datesStore = useDatesStore();
const periodicStore = usePeriodicStore();

const { datesDateUpdating, datesLoading } = storeToRefs(datesStore);
const { periodicDateUpdating, periodicLoading } = storeToRefs(periodicStore);

const isAnyDataFetching = computed(() => {
  return (
    datesLoading.value === true ||
    datesDateUpdating.value.length !== 0 ||
    periodicLoading.value === true ||
    periodicDateUpdating.value.length !== 0
  );
});
</script>

<template>
  <button
    :disabled="isAnyDataFetching"
    :class="{
      button: true,
      loading: isAnyDataFetching,
    }"
  >
    +
  </button>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;

.button {
  position: fixed;
  outline: none;
  border: none;
  bottom: 10px;
  right: 10px;
  width: 45px;
  height: 45px;
  border-radius: $full-border-radius;
  background-color: $border-green;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: $white;
  box-shadow: $box-shadow;
  z-index: 8;
  cursor: pointer;

  &.loading {
    background-color: $pale-grey;
    cursor: default;
  }

  &:hover {
    background-color: $pale-green;
  }
}

@media only screen and (min-width: 1024px) {
  .button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 45px;
    height: 45px;
    border-radius: $full-border-radius;
    background-color: $border-green;
  }
}
</style>
