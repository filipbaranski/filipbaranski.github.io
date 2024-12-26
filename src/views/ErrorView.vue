<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="error">
    <p class="errorText">404</p>
    <RouterLink to="/" class="errorLink">Wróć na stronę główną</RouterLink>
  </section>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;

.error {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.errorText {
  font-family: fantasy;
  letter-spacing: 10px;
  font-size: 75px;
  line-height: 75px;
  font-weight: 800;
  -webkit-background-clip: text;
  background-clip: text;
  background-image: url(@/assets/bar360_mobile.png);
  color: transparent;
}

.errorLink {
  text-decoration: none;
  color: $black;
  font-weight: 800;
}

@media only screen and (min-width: 768px) {
  .errorText {
    background-image: url(@/assets/bar360_desktop.png);
  }
}
</style>
