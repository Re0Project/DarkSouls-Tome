<template>
  <div class="theme-switch">
    <button
      v-for="theme in themes"
      :key="theme.value"
      class="theme-btn"
      :class="{ active: currentTheme === theme.value }"
      @click="switchTheme(theme.value)"
      :title="theme.label"
    >
      <span class="icon">{{ theme.icon }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore, type Theme } from '@/stores/theme';

const themeStore = useThemeStore();

const themes = [
  { value: 'dark' as Theme, icon: '🌙', label: '深色模式' },
  { value: 'light' as Theme, icon: '☀️', label: '浅色模式' },
  { value: 'auto' as Theme, icon: '🌓', label: '跟随系统' }
];

const currentTheme = computed(() => themeStore.currentTheme);

const switchTheme = (theme: Theme) => {
  themeStore.setTheme(theme);
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.theme-switch {
  display: flex;
  gap: 0.5rem;
  background: var(--color-bg-primary);
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.theme-btn {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 2px;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    background: rgba(255, 215, 0, 0.1);
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  }

  .icon {
    display: block;
  }
}
</style>
