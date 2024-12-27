<script setup lang="ts">
import { reactive } from "vue";
import { usePeriodicStore } from "@/stores/periodic";

const periodicStore = usePeriodicStore();

const props = defineProps(["type", "data"]);

const emit = defineEmits(["closeModal"]);

const state = reactive({
  date: {
    dayNumber: parseInt(props.data?.dayNumber) || 0,
    event: props.data?.event || "",
  },
  error: false,
  error_msg: "",
});

const validate = (data: any) => {
  let { event } = data;
  if (event === "") {
    state.error_msg = "Uzupełnij wszystkie wymagane pola";
    return false;
  }
  state.error_msg = "";
  return true;
};

const update = () => {
  const { data } = props;
  const id = data._id;
  const isValid = validate(state.date);
  if (isValid) {
    state.error = false;
    const sanitizedEvent = state.date.event.replace(/[<>]/g, "").trim();
    const payload = {
      dayNumber: state.date.dayNumber || "0",
      event: sanitizedEvent,
    };
    periodicStore.updatePeriodic({ id, payload });
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
      dayNumber: state.date.dayNumber || "0",
      event: sanitizedEvent,
    };
    periodicStore.postPeriodic(payload);
    emit("closeModal");
  } else {
    state.error = true;
  }
};

const remove = () => {
  const { data } = props;
  const id = data._id;
  periodicStore.deletePeriodic(id);
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
      <div class="modal-select">
        <select name="periodic-select" v-model="state.date.dayNumber">
          <option value="0">Poniedziałek</option>
          <option value="1">Wtorek</option>
          <option value="2">Środa</option>
          <option value="3">Czwartek</option>
          <option value="4">Piątek</option>
          <option value="5">Sobota</option>
          <option value="6">Niedziela</option>
        </select>
      </div>
      <input
        name="periodic-event"
        v-model="state.date.event"
        placeholder="Wydarzenie"
        spellcheck="false"
        autocomplete="off"
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
@use "@/styles/global.scss" as *;
@use "@/styles/keyframes.scss" as *;

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
  &-select {
    width: 100%;
    margin-bottom: 15px;

    select {
      font-size: 16px;
      width: 100%;
      padding: 5px 0;
      text-align: center;
      appearance: none;
      outline: none;
      border: 2px solid $border-green;
      border-radius: $standard-border-radius;
    }
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
    animation: modalModuleUpFadeIn 0.5s;

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
