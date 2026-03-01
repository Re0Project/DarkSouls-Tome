<template>
  <div class="home">
    <header class="header">
      <div class="header-top">
        <LanguageSwitch />
      </div>
      <h1>黑暗之魂系列文本数据库</h1>
      <p class="subtitle">Dark Souls Series Text Database</p>
    </header>

    <div class="game-selector">
      <button
        v-for="game in [1, 2, 3]"
        :key="game"
        :class="{ active: currentGame === game }"
        @click="setGame(game)"
      >
        黑暗之魂{{ game }}
      </button>
    </div>

    <div class="item-types">
      <router-link
        v-for="type in itemTypes"
        :key="type.value"
        :to="`/ds${currentGame}/${type.value}`"
        class="type-card"
      >
        <div class="type-icon">{{ type.icon }}</div>
        <div class="type-name">{{ type.label }}</div>
        <div class="type-count">{{ getItemCount(type.value) }} 项</div>
      </router-link>
    </div>

    <footer class="footer">
      <p>⚔️ Praise the Sun! ☀️</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/game';
import { ITEM_COUNTS } from '@/utils/constants';
import LanguageSwitch from '@/components/LanguageSwitch.vue';
import type { GameVersion, ItemType } from '@/types/item';

const gameStore = useGameStore();
const currentGame = computed(() => gameStore.currentGame);

const setGame = (game: GameVersion) => {
  gameStore.setGame(game);
};

const itemTypes = [
  { value: 'weapon' as ItemType, label: '武器', icon: '⚔️' },
  { value: 'armor' as ItemType, label: '防具', icon: '🛡️' },
  { value: 'ring' as ItemType, label: '戒指', icon: '💍' },
  { value: 'item' as ItemType, label: '物品', icon: '📦' },
  { value: 'magic' as ItemType, label: '法术', icon: '✨' }
];

const getItemCount = (type: ItemType) => {
  return ITEM_COUNTS[currentGame.value][type];
};

// 加载保存的游戏选择
gameStore.loadGame();
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;

  .header-top {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-accent);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-family: 'Palatino Linotype', serif;
  }
}

.game-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;

  button {
    padding: 1rem 2rem;
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-border);
    color: var(--color-text-primary);
    font-size: 1.1rem;
    border-radius: 4px;

    &:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    &.active {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #fff;
    }
  }
}

.item-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 3rem;
}

.type-card {
  background: var(--color-bg-card);
  border: 2px solid var(--color-border);
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: var(--color-accent);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(153, 102, 0, 0.3);
  }

  .type-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .type-name {
    font-size: 1.5rem;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  .type-count {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }
}

.footer {
  margin-top: auto;
  padding-top: 2rem;
  color: var(--color-text-secondary);
  text-align: center;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }

  .game-selector {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .item-types {
    grid-template-columns: 1fr;
  }
}
</style>
