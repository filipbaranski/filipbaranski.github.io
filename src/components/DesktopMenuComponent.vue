<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="menu-desktop">
    <RouterLink to="/calendar">Kalendarz</RouterLink>
    <RouterLink to="/events">Daty</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
@import '@/styles/global.scss';

.menu-desktop {
  display: none;
}

@media only screen and (min-width: 768px) {
  .menu-desktop {
    display: flex;
    justify-content: space-between;
    height: 55px;
    background-color: $white;
  }

  a {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 75px;
    border-bottom: 3px solid $button-shadow;
    color: $black;
    line-height: 35px;
    font-size: 18px;
    font-weight: bold;
    text-decoration: none;
    background-color: $white;

    &:hover {
        border-bottom: 3px solid $border-green;
    }

    &.router-link-active {
        border-bottom: 3px solid $border-green;
        background-color: $white;
        border-left: none;
        text-shadow: none;
        color: $black;
    }
  }
}
</style>
