<template>
  <div class="advanced-search">
    <button class="toggle-btn" @click="isExpanded = !isExpanded">
      <span class="icon">{{ isExpanded ? '▼' : '▶' }}</span>
      <span>高级搜索</span>
    </button>

    <Transition name="expand">
      <div v-if="isExpanded" class="search-panel">
        <div class="search-row">
          <label class="search-label">游戏版本</label>
          <div class="checkbox-group">
            <label v-for="game in games" :key="game.value" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="game.value"
                v-model="localFilters.games"
                @change="emitFilters"
              />
              <span>{{ game.label }}</span>
            </label>
          </div>
        </div>

        <div class="search-row">
          <label class="search-label">物品类型</label>
          <div class="checkbox-group">
            <label v-for="type in itemTypes" :key="type.value" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="type.value"
                v-model="localFilters.types"
                @change="emitFilters"
              />
              <span>{{ type.label }}</span>
            </label>
          </div>
        </div>

        <div class="search-row">
          <label class="search-label">搜索范围</label>
          <div class="radio-group">
            <label v-for="scope in searchScopes" :key="scope.value" class="radio-label">
              <input 
                type="radio" 
                :value="scope.value"
                v-model="localFilters.searchScope"
                @change="emitFilters"
              />
              <span>{{ scope.label }}</span>
            </label>
          </div>
        </div>

        <div class="search-row">
          <label class="search-label">收藏筛选</label>
          <div class="radio-group">
            <label v-for="fav in favoriteFilters" :key="fav.value" class="radio-label">
              <input 
                type="radio" 
                :value="fav.value"
                v-model="localFilters.favoriteFilter"
                @change="emitFilters"
              />
              <span>{{ fav.label }}</span>
            </label>
          </div>
        </div>

        <div class="search-actions">
          <button class="reset-btn" @click="resetFilters">重置筛选</button>
          <span class="result-count">{{ resultCount }} 项结果</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { GameVersion, ItemType } from '@/types/item';
import type { SearchFilters } from '@/composables/useAdvancedSearch';

const props = defineProps<{
  modelValue: SearchFilters;
  resultCount: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: SearchFilters];
}>();

const isExpanded = ref(false);

const localFilters = reactive<SearchFilters>({ ...props.modelValue });

const games = [
  { value: 1 as GameVersion, label: '黑暗之魂 1' },
  { value: 2 as GameVersion, label: '黑暗之魂 2' },
  { value: 3 as GameVersion, label: '黑暗之魂 3' }
];

const itemTypes = [
  { value: 'weapon' as ItemType, label: '武器' },
  { value: 'armor' as ItemType, label: '防具' },
  { value: 'ring' as ItemType, label: '戒指' },
  { value: 'item' as ItemType, label: '物品' },
  { value: 'magic' as ItemType, label: '法术' }
];

const searchScopes = [
  { value: 'all' as const, label: '全部' },
  { value: 'name' as const, label: '仅名称' },
  { value: 'description' as const, label: '仅描述' }
];

const favoriteFilters = [
  { value: 'all' as const, label: '全部' },
  { value: 'favorite' as const, label: '仅收藏' },
  { value: 'non-favorite' as const, label: '未收藏' }
];

const emitFilters = () => {
  emit('update:modelValue', { ...localFilters });
};

const resetFilters = () => {
  localFilters.games = [1, 2, 3];
  localFilters.types = ['weapon', 'armor', 'ring', 'item', 'magic'];
  localFilters.searchScope = 'all';
  localFilters.favoriteFilter = 'all';
  emitFilters();
};

// 同步外部变化
watch(() => props.modelValue, (newValue) => {
  Object.assign(localFilters, newValue);
}, { deep: true });
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.advanced-search {
  margin-bottom: 1rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .icon {
    font-size: 0.8rem;
    transition: transform 0.2s ease;
  }
}

.search-panel {
  margin-top: 1rem;
  padding: 1.5rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.search-row {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.search-label {
  display: block;
  font-size: 0.9rem;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-accent);
  }

  input[type="checkbox"],
  input[type="radio"] {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
}

.search-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: transparent;
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

.result-count {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

// 展开动画
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .checkbox-group,
  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .reset-btn {
    width: 100%;
  }
}
</style>
