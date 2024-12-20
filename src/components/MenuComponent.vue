<script setup lang="ts">
import { RouterLink } from "vue-router";
import CalendarIcon from "@/assets/svg/CalendarIcon.vue";
import EventsIcon from "@/assets/svg/EventsIcon.vue";
</script>

<template>
  <nav class="menu">
    <RouterLink to="/calendar">
      <p class="desktop">Kalendarz</p>
      <CalendarIcon class="mobile" />
    </RouterLink>
    <RouterLink to="/events">
      <p class="desktop">Daty</p>
      <EventsIcon class="mobile" />
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
@use "@/styles/global.scss" as *;

.desktop {
  display: none;
}

.mobile {
  display: block;
}

.menu {
  display: flex;
  justify-content: space-between;
  height: 40px;
  background-color: $white;
}

a {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 75px;
  border-bottom: 2px solid $button-shadow;
  color: $black;
  line-height: 35px;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  background-color: $white;

  &:hover {
    border-bottom: 2px solid $border-green;
  }

  &.router-link-active {
    border-bottom: 2px solid $border-green;
    background-color: $white;
    border-left: none;
    text-shadow: none;
    color: $black;
  }
}

@media only screen and (min-width: 768px) {
  .desktop {
    display: block;
  }

  .mobile {
    display: none;
  }
  .menu {
    height: 55px;
  }
}
</style>
