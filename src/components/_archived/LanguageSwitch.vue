<template>
  <div class="language-switch">
    <button
      v-for="lang in languages"
      :key="lang.value"
      class="lang-btn"
      :class="{ active: currentLanguage === lang.value }"
      @click="switchLanguage(lang.value)"
      :title="lang.label"
    >
      {{ lang.short }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import type { Language } from '@/types/item';

const userStore = useUserStore();

const languages = [
  { value: 'chn' as Language, short: '中', label: '简体中文' },
  { value: 'jap' as Language, short: '日', label: '日本語' },
  { value: 'eng' as Language, short: 'EN', label: 'English' }
];

const currentLanguage = computed(() => userStore.currentLanguage);

const switchLanguage = (lang: Language) => {
  userStore.setLanguage(lang);
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.language-switch {
  display: flex;
  gap: 0.5rem;
  background: var(--color-bg-primary);
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.lang-btn {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 2px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-text-primary);
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: var(--color-accent);
    background: rgba(255, 215, 0, 0.1);
    font-weight: 500;
  }
}
</style>
