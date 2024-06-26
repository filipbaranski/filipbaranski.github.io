<script setup lang="ts">
import { reactive } from "vue";
import { useDatesStore } from "@/stores/dates";

const datesStore = useDatesStore();

const props = defineProps(["type", "data"]);

const emit = defineEmits(["closeModal"]);

const state = reactive({
  date: {
    day: props.data?.day || "",
    month: props.data?.month || "",
    year:
      props.type === "add"
        ? new Date().getFullYear().toString()
        : props.data.year,
    event: props.data?.event || "",
  },
  error: false,
  error_msg: "",
});

const listOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const isRealDate = (year: any, month: any, day: any) => {
  if (parseInt(month) > 12) return false;
  if (parseInt(year) % 4 === 0 && parseInt(month) === 2 && parseInt(day) === 29)
    return true;
  if (parseInt(day) > listOfDays[parseInt(month) - 1]) return false;
  return true;
};

const validate = (data: any) => {
  let { day, month, year, event } = data;
  if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
    state.error_msg = "Niepoprawny format daty";
    return false;
  }
  if (day === "" || month === "" || event === "") {
    state.error_msg = "Uzupełnij wszystkie wymagane pola";
    return false;
  }
  if (day.length < 2) day = `0${day}`;
  if (month.length < 2) month = `0${month}`;
  if (
    day.length > 2 ||
    month.length > 2 ||
    (year !== "" && year.length !== 4)
  ) {
    state.error_msg = "Niepoprawny format daty";
    return false;
  }
  if (isRealDate(year, month, day) === false) {
    state.error_msg = "Niepoprawna data";
    return false;
  }
  if (year !== "" && (year[0] !== "2" || year[1] !== "0")) {
    state.error_msg = "Niepoprawne stulecie";
    return false;
  }
  state.error_msg = "";
  return true;
};

const update = () => {
  const { data } = props;
  const id = data.id;
  const isValid = validate(state.date);
  if (isValid) {
    state.error = false;
    const sanitizedEvent = state.date.event.replace(/[<>]/g, "").trim();
    const payload = {
      day: state.date.day.length === 2 ? state.date.day : `0${state.date.day}`,
      month:
        state.date.month.length === 2
          ? state.date.month
          : `0${state.date.month}`,
      year: "",
      event: sanitizedEvent,
    };
    if (state.date.year !== "") payload.year = state.date.year;
    datesStore.updateDate({ id, ...payload });
    emit("closeModal");
  } else {
    state.error = true;
  }
};

const send = () => {
  const isValid = validate(state.date);
  if (isValid) {
    state.error = false;
    const sanitizedEvent = state.date.event.replace(/[<>]/g, "").trim();
    const payload = {
      day: state.date.day.length === 2 ? state.date.day : `0${state.date.day}`,
      month:
        state.date.month.length === 2
          ? state.date.month
          : `0${state.date.month}`,
      year: "",
      event: sanitizedEvent,
    };
    if (state.date.year !== "") payload.year = state.date.year;
    datesStore.postDate(payload);
    emit("closeModal");
  } else {
    state.error = true;
  }
};

const remove = () => {
  const { data } = props;
  const id = data.id;
  datesStore.deleteDate(id);
  emit("closeModal");
};

const detectKey = (e: any) => {
  if (e.keyCode === 13 && props.type === "add") {
    send();
  }
  if (e.keyCode === 13 && props.type === "edit") {
    update();
  }
};
</script>

<template>
  <section class="modal-box">
    <div class="modal-mask" @click="$emit('closeModal')" />
    <section class="modal-proper" @keydown="detectKey">
      <header v-if="type === 'add'">Dodaj</header>
      <header v-if="type === 'edit'">Edytuj</header>
      <input v-model="state.date.day" placeholder="DD" spellcheck="false" />
      <input v-model="state.date.month" placeholder="MM" spellcheck="false" />
      <input
        v-model="state.date.year"
        placeholder="RRRR (opcjonalne)"
        spellcheck="false"
      />
      <input
        v-model="state.date.event"
        placeholder="Wydarzenie"
        spellcheck="false"
      />
      <p :class="{ error: true, open: state.error }">
        {{ state.error_msg }}
      </p>
      <footer>
        <button v-if="type === 'add'" @click="send">Stwórz</button>
        <button v-if="type === 'edit'" @click="update">Zmień</button>
        <button @click="$emit('closeModal')">Anuluj</button>
        <button v-if="type === 'edit'" @click="remove">Usuń</button>
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

.error {
  padding: 5px 15px;
  border: 2px solid $red;
  background-color: $pale-red;
  border-radius: $standard-border-radius;
  margin: 0 auto 15px;
  max-height: 0;
  opacity: 0;
  transition: all 0.25s;

  &.open {
    max-height: 200px;
    opacity: 1;
    transition: all 0.25s;
  }
}

.modal {
  &-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
  }
  &-mask {
    width: 100vw;
    height: 100vh;
    background-color: $black;
    opacity: 0.5;
  }
  &-proper {
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
      margin: 0 auto 20px;
      width: fit-content;
      border-bottom: 2px solid $border-green;
      padding: 2px 6px;
    }

    input {
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
      justify-content: space-between;
      margin-top: 5px;

      button {
        border: none;
        outline: none;
        width: 35%;
        padding: 8px;
        border-radius: $standard-border-radius;
        color: white;

        &:hover {
          opacity: 0.5;
          cursor: pointer;
        }

        &:first-child {
          background-color: $border-green;
        }

        &:nth-child(2) {
          background-color: $grey;
        }

        &:nth-child(3) {
          background-color: $red;
          width: 15%;
        }
      }
    }
  }
}
</style>
