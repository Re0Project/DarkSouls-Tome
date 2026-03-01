<template>
  <div class="dialogue-card">
    <div class="dialogue-header">
      <div class="npc-avatar">
        <LazyImage :src="avatarPath" :alt="dialogue.npc" />
      </div>
      <h3 class="npc-name">{{ dialogue.npc }}</h3>
    </div>

    <div class="dialogue-lines">
      <div 
        v-for="line in dialogue.lines" 
        :key="line.index"
        class="dialogue-line"
        :class="{ 
          'is-title': line.isTitle,
          'is-unused': line.isUnused 
        }"
      >
        <span class="line-index">{{ line.index }}</span>
        <p class="line-text">{{ getLineText(line) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import LazyImage from './LazyImage.vue';
import type { Dialogue, DialogueLine } from '@/types/item';

const props = defineProps<{
  dialogue: Dialogue;
}>();

const userStore = useUserStore();

const avatarPath = computed(() => {
  return `/icons/${props.dialogue.avatar}`;
});

const getLineText = (line: DialogueLine) => {
  return line[userStore.currentLanguage];
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.dialogue-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-accent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.dialogue-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--color-border);
}

.npc-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-accent);
  background: rgba(0, 0, 0, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.npc-name {
  font-size: 1.3rem;
  color: var(--color-accent);
  margin: 0;
  font-weight: 500;
}

.dialogue-lines {
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
}

.dialogue-line {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }

  &.is-title {
    background: rgba(255, 215, 0, 0.1);
    border-left: 3px solid var(--color-accent);

    .line-text {
      font-weight: 600;
      color: var(--color-accent);
    }
  }

  &.is-unused {
    opacity: 0.5;

    .line-text {
      text-decoration: line-through;
      font-style: italic;
    }
  }
}

.line-index {
  flex-shrink: 0;
  width: 40px;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-family: monospace;
}

.line-text {
  flex: 1;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .dialogue-header {
    flex-direction: column;
    text-align: center;
  }

  .dialogue-line {
    flex-direction: column;
    gap: 0.5rem;
  }

  .line-index {
    width: auto;
  }
}
</style>
