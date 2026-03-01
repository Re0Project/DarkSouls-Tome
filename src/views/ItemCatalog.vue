<template>
  <div class="item-catalog-view">
    <ClassicNavigation />
    <div class="catalog-layout">
      <SidebarNav />
      <main class="catalog-main">
        <ItemCatalogTable 
          :items="items"
          :title="title"
          :game="gameNum"
          :type="itemType"
          :loading="loading"
          :error="error?.message"
          @retry="loadData"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGameData } from '@/composables/useGameData';
import { GAME_NAMES, ITEM_TYPE_NAMES } from '@/utils/constants';
import ClassicNavigation from '@/components/layout/ClassicNavigation.vue';
import SidebarNav from '@/components/layout/SidebarNav.vue';
import ItemCatalogTable from '@/components/item/ItemCatalogTable.vue';
import type { GameVersion, ItemType } from '@/types/item';

const props = defineProps<{
  game: string;
  type: string;
}>();

const gameNum = computed(() => Number(props.game) as GameVersion);
const itemType = computed(() => props.type as ItemType);

const title = computed(() => {
  return `${GAME_NAMES[gameNum.value]} - ${ITEM_TYPE_NAMES[itemType.value]}`;
});

const { items, loading, error, loadData } = useGameData(gameNum.value, itemType.value);

onMounted(() => {
  loadData();
});
</script>

<style scoped lang="scss">
.item-catalog-view {
  min-height: 100vh;
  background: #000;
}

.catalog-layout {
  display: flex;
  padding-top: 150px;

  @media (max-width: 1000px) {
    padding-top: 6em;
  }
}

.catalog-main {
  flex: 1;
  min-width: 0;
}
</style>
