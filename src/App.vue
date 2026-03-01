<template>
  <div id="app">
    <AppNavigation />
    
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppNavigation from '@/components/AppNavigation.vue';

const router = useRouter();
const transitionName = ref('fade');

// 根据路由深度决定过渡动画方向
watch(
  () => router.currentRoute.value,
  (to, from) => {
    if (!from) {
      transitionName.value = 'fade';
      return;
    }

    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;

    if (toDepth > fromDepth) {
      transitionName.value = 'slide-left';
    } else if (toDepth < fromDepth) {
      transitionName.value = 'slide-right';
    } else {
      transitionName.value = 'fade';
    }
  }
);
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
