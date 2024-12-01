<script setup lang="ts"></script>

<template>
  <section class="innerBorder">
    <slot />
  </section>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;

.innerBorder {
  box-sizing: border-box;
  height: 100vh;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url(@/assets/login_bg.png);
  background-size: cover;
  background-repeat: no-repeat;
}

@media only screen and (min-width: 768px) {
  .innerBorder {
    padding: 0 100px;
  }
}
</style>
