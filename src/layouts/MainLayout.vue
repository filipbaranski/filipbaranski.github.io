<script setup lang="ts">
import { RouterLink } from "vue-router";
import DesktopMenuComponent from "@/components/MenuComponent.vue";
</script>

<template>
  <!-- <header class="header">
    <RouterLink to="/">
      <p class="banner">Tea Hub</p>
    </RouterLink>
  </header>
  <DesktopMenuComponent /> -->
  <section class="innerBorder">
    <slot />
  </section>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;
.header {
  height: 75px;
  width: 100%;
  background-image: url(@/assets/bar360_mobile.png);
  background-size: cover;
  background-repeat: no-repeat;
}

a {
  display: block;
  height: 100%;
  text-decoration: none;
}

.banner {
  font-size: 50px;
  font-weight: 700;
  color: $white;
  text-shadow: 0 0 10px #151515, 0 0 30px #151515, 0 0 50px #151515;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.innerBorder {
  padding: 20px 10px 20px;
}

@media only screen and (min-width: 768px) {
  .header {
    background-image: url(@/assets/bar360_desktop.png);
  }

  .innerBorder {
    padding: 35px 100px 25px;
  }
}
</style>
