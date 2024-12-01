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
@import "@/styles/global.scss";

.button {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px auto;
  font-size: 26px;
  color: $white;
  border: none;
  border-radius: $standard-border-radius;
  background-color: $border-green;
  width: calc(100% - 20px);
  height: 30px;
  cursor: pointer;

  &.loading {
    background-color: $pale-grey;
    cursor: default;
  }

  &:hover {
    background-color: $pale-green;
  }
}
</style>
