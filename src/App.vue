<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onMounted(() => {
  // 加载用户偏好设置
  userStore.loadLanguage();
  userStore.loadFavorites();
});
</script>

<style>
/* 全局样式已在 main.ts 中导入 */
#app {
  min-height: 100vh;
}
</style>
