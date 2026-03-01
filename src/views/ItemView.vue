<template>
  <div class="item-view">
    <h1>{{ title }}</h1>
    <p>游戏: DS{{ game }} | 类型: {{ type }}</p>
    <p class="placeholder">物品列表功能开发中...</p>
    <router-link to="/" class="back-link">← 返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GAME_NAMES, ITEM_TYPE_NAMES } from '@/utils/constants';
import type { GameVersion, ItemType } from '@/types/item';

const props = defineProps<{
  game: string;
  type: string;
}>();

const title = computed(() => {
  const gameNum = Number(props.game) as GameVersion;
  const itemType = props.type as ItemType;
  return `${GAME_NAMES[gameNum]} - ${ITEM_TYPE_NAMES[itemType]}`;
});
</script>

<style scoped lang="scss">
.item-view {
  padding: 2rem;
  text-align: center;

  h1 {
    color: var(--color-accent);
    margin-bottom: 1rem;
  }

  .placeholder {
    margin: 3rem 0;
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }

  .back-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    margin-top: 2rem;

    &:hover {
      border-color: var(--color-accent);
    }
  }
}
</style>
