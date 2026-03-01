<template>
  <div class="classic-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style scoped lang="scss">
.classic-container {
  width: 1800px;
  margin: 0 auto;
  overflow: hidden;

  @media (max-width: 1800px) {
    width: 100%;
    overflow: auto;
  }
}
</style>
