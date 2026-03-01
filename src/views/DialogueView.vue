<template>
  <div class="dialogue-view">
    <header class="view-header">
      <div class="header-content">
        <h1 class="title">{{ title }}</h1>
      </div>
    </header>

    <main class="view-main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>❌ 加载失败</p>
        <p class="error-message">{{ error.message }}</p>
        <button @click="loadDialogue" class="retry-btn">重试</button>
      </div>

      <div v-else-if="!dialogue" class="empty">
        <p>未找到对话数据</p>
      </div>

      <DialogueCard v-else :dialogue="dialogue" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { GAME_NAMES } from '@/utils/constants';
import DialogueCard from '@/components/dialogue/DialogueCard.vue';
import type { Dialogue, GameVersion } from '@/types/item';

const props = defineProps<{
  game: string;
  npc: string;
}>();

const dialogue = ref<Dialogue | null>(null);
const loading = ref(false);
const error = ref<Error | null>(null);

const gameNum = computed(() => Number(props.game) as GameVersion);

const title = computed(() => {
  return `${GAME_NAMES[gameNum.value]} - ${props.npc}`;
});

const loadDialogue = async () => {
  loading.value = true;
  error.value = null;

  try {
    const module = await import(`@/data/ds${props.game}/dialogues/${props.npc}.json`);
    dialogue.value = module.default;
  } catch (e) {
    error.value = e as Error;
    console.error(`Failed to load dialogue for ${props.npc}:`, e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDialogue();
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.dialogue-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
}

.view-header {
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 1.5rem;
  color: var(--color-accent);
  margin: 0;
  font-weight: 500;
}

.view-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-secondary);
}

.loading {
  .spinner {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    border: 4px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  .error-message {
    color: #ff6b6b;
    margin: 1rem 0;
    font-size: 0.9rem;
  }

  .retry-btn {
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 1.2rem;
  }
}
</style>
