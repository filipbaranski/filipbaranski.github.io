<script setup lang="ts">
</script>

<template>
  <section class="error">
    <p class="errorText">404</p>
  </section>
</template>

<style scoped lang="scss">
.error {
  display: flex;
  justify-content: center;
  padding-top: 100px;
  font-family: fantasy;
  letter-spacing: 10px;
}

.errorText {
  font-size: 75px;
  line-height: 75px;
  font-weight: 800;
  -webkit-background-clip: text;
	background-clip: text;
	background-image: url('@/assets/bar360.png');
	color: transparent;
}
</style>
