<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { error, loading } = storeToRefs(authStore);

const state = reactive({
  name: "",
  password: "",
});

const cleanError = () => {
  authStore.error = false;
}

const onSubmit = () => {
  authStore.login(state.name, state.password);
}
</script>

<template>
  <section class="login">
    <div class="imageContainer">
      <img src="@/assets/icon.png" alt="TeaHub logo icon"/>
    </div>
    <form @submit.prevent="onSubmit()" @keydown="cleanError()">
      <input placeholder="Nazwa użytkownika" type="text" v-model="state.name" />
      <input placeholder="Hasło" type="password" v-model="state.password"/>
      <button
        type="submit"
        :disabled="!state.name || !state.password || loading"
        :class="{ disabled: !state.name || !state.password || loading }"
      >
        Zaloguj
      </button>
    </form>
    <p class="error" v-if="error">Niepoprawne dane logowania</p>
  </section>
</template>

<style scoped lang="scss">
@import '@/styles/global.scss';
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imageContainer {
  width: 130px;
  height: 130px;
  border-radius: 130px;
  border: 3px solid $border-green;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 25px $pale-green;

  img {
    margin-left: 16px;
    margin-top: 12px;
    width: 120px;
  }
}

form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

input {
  outline: none;
  width: calc(100% - 40px);
  max-width: 400px;
  margin-bottom: 20px;
  border-radius: 20px;
  border: 2px solid $border-green;
  padding: 10px 20px;
  letter-spacing: 0.6px;
}

button {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  outline: none;
  border: none;
  background-color: $border-green;
  padding: 10px;
  color: $white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
  background-color: $pale-green;
  }

  &.disabled {
    background-color: $pale-grey;
    cursor: default;

    &:hover {
      background-color: $pale-grey;
    }
  }
}
.error {
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: $red;
  width: 100%;
  max-width: 380px;
  margin-top: 15px;
}
</style>
