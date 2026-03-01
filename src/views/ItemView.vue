<template>
  <div class="classic-item-view">
    <ClassicNavigation />
    <hr>
    <ClassicContainer>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="loadData">重试</button>
      </div>
      <div v-else>
        <ClassicItemCard 
          v-for="item in filteredItems" 
          :key="item.id" 
          :item="item"
        />
      </div>
    </ClassicContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useGameData } from '@/composables/useGameData';
import { useSearch } from '@/composables/useSearch';
import { useUserStore } from '@/stores/user';
import ClassicNavigation from '@/components/layout/ClassicNavigation.vue';
import ClassicContainer from '@/components/layout/ClassicContainer.vue';
import ClassicItemCard from '@/components/item/ClassicItemCard.vue';
import type { GameVersion, ItemType } from '@/types/item';

const props = defineProps<{
  game: string;
  type: string;
}>();

const userStore = useUserStore();

const gameNum = computed(() => Number(props.game) as GameVersion);
const itemType = computed(() => props.type as ItemType);

const { items, loading, error, loadData } = useGameData(gameNum.value, itemType.value);
const { filteredItems } = useSearch(items, computed(() => userStore.currentLanguage));

onMounted(() => {
  loadData();
});
</script>

<style scoped lang="scss">
.classic-item-view {
  min-height: 100vh;
  background: #000;
}

hr {
  border: 0;
  height: 150px;

  @media (max-width: 1000px) {
    height: 6em;
  }
}

.loading,
.error {
  text-align: center;
  padding: 4em 2em;
  color: #ccc;
  font: 18px/1.5 仿宋, SimSun, serif;

  button {
    margin-top: 1em;
    padding: 0.5em 2em;
    background: #111;
    border: 1px solid #430;
    color: #960;
    font: 16px/1.5 仿宋, SimSun, serif;
    cursor: pointer;
    transition: .3s;

    &:hover {
      border-color: #960;
      background: #222;
    }
  }
}
</style>
