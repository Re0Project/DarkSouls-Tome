<template>
  <div class="dialogue-view">
    <h1>对话查询</h1>
    <p>游戏: DS{{ game }} | NPC: {{ npc }}</p>
    <p class="placeholder">对话功能开发中...</p>
    <router-link to="/" class="back-link">← 返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  game: string;
  npc: string;
}>();
</script>

<style scoped lang="scss">
.dialogue-view {
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
