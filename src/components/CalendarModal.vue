<script setup lang="ts">
import { reactive } from "vue";
import { useCalendarStore } from "@/stores/calendar";
import Cube from "@/assets/svg/Cube.svg";
import CubeWhite from "@/assets/svg/CubeWhite.svg";

const calendarStore = useCalendarStore();

const emit = defineEmits(["closeModal"]);

const props = defineProps(["data"]);

const state = reactive({
  date: props.data.date,
  day: props.data.day,
  month: props.data.month,
  year: props.data.year,
  red: props.data.red,
  is_cube: props.data.is_cube,
});

const update = () => {
  const { day, month, year, red, is_cube } = state;
  const payload = {
    day,
    month,
    year,
    red,
    is_cube,
  };
  calendarStore.updateCalendar({ payload });
  emit("closeModal");
};
</script>

<template>
  <section class="modal-box">
    <div class="modal-mask" @click="$emit('closeModal')" />
    <section class="modal-proper">
      <header>{{ state.date }}</header>
      <div class="modal-selects">
        <div class="modal-section">
          <input id="red" v-model="state.red" type="checkbox" />
          <label for="red">
            <div :class="{ 'modal-circle': true, red: state.red }" />
          </label>
        </div>
        <div class="modal-section">
          <input id="cube" v-model="state.is_cube" type="checkbox" />
          <label for="cube">
            <img :src="state.is_cube ? CubeWhite : Cube" />
          </label>
        </div>
      </div>
      <footer>
        <button @click="update">Zmień</button>
        <button @click="$emit('closeModal')">Anuluj</button>
      </footer>
    </section>
  </section>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";

@keyframes moduleUpFadeIn {
  0% {
    transform: translateX(-50%) translateY(-25%);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(-50%);
    opacity: 1;
  }
}

.modal {
  &-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 110;
  }

  &-section {
    display: flex;
    justify-content: center;
    margin: 20px;
    align-items: center;

    input {
      display: none;
    }

    > label {
      width: 40px;
      cursor: pointer;
    }

    img {
      width: 34px;
      height: 34px;
    }
  }

  &-selects {
    display: flex;
    justify-content: space-evenly;
  }

  &-mask {
    width: 100vw;
    height: 100vh;
    background-color: $black;
    opacity: 0.5;
  }

  &-circle {
    width: 34px;
    height: 34px;
    border-radius: $full-border-radius;
    background: -webkit-linear-gradient(
      225deg,
      rgba(153, 204, 51, 0.8) 0%,
      rgba(153, 204, 51, 1) 60%
    );

    &.red {
      background: -webkit-linear-gradient(
        225deg,
        rgba(185, 14, 10, 0.8) 0%,
        rgba(185, 14, 10, 1) 60%
      );
    }
  }

  &-proper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 50px);
    max-width: 400px;
    height: auto;
    background-color: $white;
    padding: 15px;
    border-radius: $standard-border-radius;
    z-index: 20;
    box-shadow: $box-shadow;
    animation: moduleUpFadeIn 0.5s;

    header {
      font-size: 24px;
      margin: 0 auto;
      width: fit-content;
      border-bottom: 2px solid $border-green;
    }

    textarea {
      border: none;
      outline: none;
      resize: none;
      width: 100%;
      min-width: 200px;
      height: 38px;
      font-family: "Times New Roman";
      font-size: 16px;
      margin-bottom: 15px;
      border-bottom: 1px solid $border-green;

      &::-webkit-scrollbar {
        display: none;
      }

      &.bold {
        font-weight: bold;
      }
    }

    > input {
      border: none;
      outline: none;
      width: 100%;
      min-width: 200px;
      text-align: center;
      font-size: 16px;
      margin-bottom: 15px;
      border-bottom: 1px solid $border-green;
    }

    footer {
      display: flex;
      justify-content: space-around;

      button {
        border: none;
        outline: none;
        width: 75px;
        padding: 8px;
        border-radius: $standard-border-radius;
        color: white;

        &:hover {
          opacity: 0.5;
          cursor: pointer;
        }

        &:first-child {
          background-color: $border-green;
          width: 35%;
        }

        &:nth-child(2) {
          background-color: $grey;
          width: 35%;
        }

        &:nth-child(3) {
          background-color: $red;
          width: 15%;
        }

        &:disabled {
          border: 2px solid $pale-grey;
          background-color: $pale-green;
          cursor: default;
        }
      }
    }
  }
}
</style>
