<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import MenuIcon from "@/assets/svg/MenuIcon.vue";

const state = reactive({
  open: false,
});

const openMenu = () => {
  state.open = true;
};

const closeMenu = () => {
  state.open = false;
};
</script>

<template>
  <button class="menu-bar" @click="openMenu">
    <MenuIcon />
  </button>
  <nav class="menu-mobile" :class="{ open: state.open }" @click="closeMenu">
    <RouterLink to="/calendar">Kalendarz</RouterLink>
    <RouterLink to="/events">Daty</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";
.menu-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  background-color: $border-green;
  width: 100%;
  outline: none;
  border: none;
  position: sticky;
  top: 0;
  z-index: 10;
}

.menu-mobile {
  position: fixed;
  bottom: 0;
  right: -100%;
  display: flex;
  flex-direction: column;
  background-color: $white;
  height: 100vh;
  width: 100vw;
  opacity: 0;
  z-index: 20000;
  transition: right 0.15s, opacity 0.5s;

  &.open {
    right: 0;
    opacity: 1;
    transition: right 0.25s, opacity 0.5s;
  }
}

a {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 75px;
  border-bottom: 2px solid $pale-green;
  color: $black;
  font-weight: bold;
  text-decoration: none;
  background-color: $palest-green;

  &.active {
    border-left: 4px solid $border-green;
    background-color: $pale-green;
    text-shadow: 0 0 4px $black;
    color: $white;
  }
}

@media only screen and (min-width: 768px) {
  .menu-mobile,
  .menu-bar {
    display: none;
  }
}
</style>
