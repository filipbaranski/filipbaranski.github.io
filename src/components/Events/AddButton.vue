<template>
  <div class="button">+</div>
</template>

<style scoped lang="scss">
@import "@/styles/global.scss";

.button {
  position: fixed;
  bottom: 10px;
  right: 30px;
  width: 45px;
  height: 45px;
  border-radius: $full-border-radius;
  background-color: $border-green;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: $white;
  box-shadow: $box-shadow;
  z-index: 8;
  cursor: pointer;

  &:hover {
    background-color: $pale-green;
  }
}

@media only screen and (min-width: 1024px) {
  .button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 45px;
    height: 45px;
    border-radius: $full-border-radius;
    background-color: $border-green;
  }
}
</style>
