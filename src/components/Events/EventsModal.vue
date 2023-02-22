<script setup lang="ts">
import { reactive } from 'vue';
import { useDatesStore } from '@/stores/dates';

const datesStore = useDatesStore();

const props = defineProps(['type', 'data']);

const emit = defineEmits(['closeModal']);

const state = reactive({
  date: {
    day: props.data?.day || '',
    month: props.data?.month || '',
    year: props.data?.year || '',
    event: props.data?.event || '',
  },
  error: false,
  error_msg: '',
});

const validate = (data: any) => {
  const {
    day,
    month,
    year,
    event,
  } = data;
  if (day === '' || month === '' || event === '') {
    state.error_msg = 'Wprowadź wszystkie wymagane dane.';
    return false;
  }
  if (day.length !== 2) {
    state.error_msg = 'Niepoprawny numer dnia. Użyj formatu DD.';
    return false;
  }
  if (parseInt(day, 10) <= 0 || parseInt(day, 10) > 31) {
    state.error_msg = 'Niepoprawny numer dnia.';
    return false;
  }
  if (month.length !== 2) {
    state.error_msg = 'Niepoprawny numer miesiąca. Użyj formatu MM.';
    return false;
  }
  if (parseInt(month, 10) <= 0 || parseInt(month, 10) > 12) {
    state.error_msg = 'Niepoprawny numer miesiąca.';
    return false;
  }
  if (year !== '' && year.length !== 4) {
    state.error_msg = 'Niepoprawny rok. Użyj formatu RRRR.';
    return false;
  }
  if (year.length === 4 && (year[0] !== '2' || year[1] !== '0')) {
    state.error_msg = 'Niepoprawne stulecie.';
    return false;
  }
  if (
    day !== '' && day.length === 2 && parseInt(day, 10) > 0 && parseInt(day, 10) <= 31
      && month !== '' && month.length === 2 && parseInt(month, 10) > 0 && parseInt(month, 10) <= 12
      && ((year !== '' && year.length === 4) || year === '')
      && event !== '') {
        state.error_msg = '';
    return true;
  }
}

const update = () => {
  const { data } = props;
  const id = data._id;
  const isValid = validate(state.date);
  if (isValid) {
    state.error = false;
    const payload = {
      day: state.date.day,
      month: state.date.month,
      year: '',
      event: state.date.event,
      userId: localStorage.getItem('userId'),
    };
    if (state.date.year !== '') payload.year = state.date.year;
    datesStore.updateDate({ id, payload });
    emit('closeModal');
  } else {
    state.error = true;
  }
}

const remove = () => {
  const { data } = props;
  const id = data._id;
  datesStore.deleteDate(id);
  emit('closeModal');
}

const send = () => {
  const isValid = validate(state.date);
  if (isValid) {
    state.error = false;
    const payload = {
      day: state.date.day,
      month: state.date.month,
      year: '',
      event: state.date.event,
      userId: localStorage.getItem('userId'),
    };
    if (state.date.year !== '') payload.year = state.date.year;
    datesStore.postDate(payload);
    emit('closeModal');
  } else {
    state.error = true;
  }
}

const detectKey = (e: any) => {
  if (e.keyCode === 13) {
    send();
  }
}
</script>

<template>
  <section class="modal-box">
    <div
      class="modal-mask"
      @click="$emit('closeModal')"
    />
    <section
      class="modal-proper"
      @keydown="detectKey"
    >
      <header v-if="type === 'add'">Dodaj</header>
      <header v-if="type === 'edit'">Edytuj</header>
      <input
        v-model="state.date.day"
        placeholder="DD"
        spellcheck="false"
      >
      <input
        v-model="state.date.month"
        placeholder="MM"
        spellcheck="false"
      >
      <input
        v-model="state.date.year"
        placeholder="RRRR (opcjonalne)"
        spellcheck="false"
      >
      <input
        v-model="state.date.event"
        placeholder="Wydarzenie"
        spellcheck="false"
      >
      <p :class="{'error': true, 'open': state.error}">
        {{ state.error_msg }}
      </p>
      <footer>
        <button v-if="type === 'add'" @click="send">
          Stwórz
        </button>
        <button v-if="type === 'edit'" @click="update">
          Zmień
        </button>
        <button @click="$emit('closeModal')">
          Anuluj
        </button>
        <button v-if="type === 'edit'" @click="remove">
          Usuń
        </button>
      </footer>
    </section>
  </section>
</template>

<style scoped lang="scss">
@import '@/styles/global.scss';

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
  border-radius: 5px;
  margin: 0 auto 15px;
  max-width: 305px;
  max-height: 0;
  opacity: 0;
  transition: all 1s;

  &.open {
    max-height: 200px;
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
    width: 90%;
    max-width: 400px;
    height: auto;
    background-color: $white;
    padding: 15px;
    border-radius: 6px;
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
      justify-content: space-around;
      margin-top: 5px;

      button {
        border: none;
        outline: none;
        width: 35%;
        padding: 8px;
        border-radius: 5px;
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
  