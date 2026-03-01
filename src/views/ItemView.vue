<template>
  <div class="item-view">
    <header class="view-header">
      <div class="header-content">
        <h1 class="title">{{ title }}</h1>
      </div>
    </header>

    <main class="view-main">
      <SearchBar 
        v-model="searchQuery" 
        :placeholder="`搜索${ITEM_TYPE_NAMES[type as ItemType]}...`"
      />
      
      <ItemList 
        :items="filteredItems"
        :loading="loading"
        :error="error"
        @retry="loadData"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGameData } from '@/composables/useGameData';
import { useSearch } from '@/composables/useSearch';
import { useUserStore } from '@/stores/user';
import { GAME_NAMES, ITEM_TYPE_NAMES } from '@/utils/constants';
import ItemList from '@/components/ItemList.vue';
import SearchBar from '@/components/SearchBar.vue';
import type { GameVersion, ItemType } from '@/types/item';

const props = defineProps<{
  game: string;
  type: string;
}>();

const userStore = useUserStore();

const gameNum = computed(() => Number(props.game) as GameVersion);
const itemType = computed(() => props.type as ItemType);

const title = computed(() => {
  return `${GAME_NAMES[gameNum.value]} - ${ITEM_TYPE_NAMES[itemType.value]}`;
});

const { items, loading, error, loadData } = useGameData(gameNum.value, itemType.value);
const { searchQuery, filteredItems } = useSearch(items, computed(() => userStore.currentLanguage));

onMounted(() => {
  loadData();
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.item-view {
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.2rem;
  }
}
</style>
