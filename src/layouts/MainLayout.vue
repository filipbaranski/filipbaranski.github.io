<script setup lang="ts">
import { RouterLink } from "vue-router";
import DesktopMenuComponent from "@/components/DesktopMenuComponent.vue";
import MobileMenuComponent from "@/components/MobileMenuComponent.vue";
</script>

<template>
  <header class="header">
    <RouterLink to="/">
      <p class="banner">Tea Hub</p>
    </RouterLink>
  </header>
  <DesktopMenuComponent />
  <MobileMenuComponent />
  <section class="innerBorder">
    <slot />
  </section>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";
.header {
  height: 75px;
  width: 100%;
  background-image: url(@/assets/bar360.png);
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
  min-height: calc(100vh - 155px);
}

@media only screen and (min-width: 768px) {
  .innerBorder {
    padding: 35px 100px 25px;
    min-height: calc(100vh - 190px);
  }
}
</style>
