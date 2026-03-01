import { ref, computed, type Ref } from 'vue';
import { useUserStore } from '@/stores/user';
import type { Item, Language, GameVersion, ItemType } from '@/types/item';
import { stripFormatting } from '@/utils/formatter';

export interface SearchFilters {
  games: GameVersion[];
  types: ItemType[];
  searchScope: 'all' | 'name' | 'description';
  favoriteFilter: 'all' | 'favorite' | 'non-favorite';
}

export function useAdvancedSearch(items: Ref<Item[]>, language: Ref<Language>) {
  const userStore = useUserStore();
  const searchQuery = ref('');
  
  const filters = ref<SearchFilters>({
    games: [1, 2, 3],
    types: ['weapon', 'armor', 'ring', 'item', 'magic'],
    searchScope: 'all',
    favoriteFilter: 'all'
  });

  const filteredItems = computed(() => {
    let result = items.value;

    // 游戏版本筛选
    if (filters.value.games.length > 0 && filters.value.games.length < 3) {
      result = result.filter(item => filters.value.games.includes(item.game));
    }

    // 物品类型筛选
    if (filters.value.types.length > 0 && filters.value.types.length < 5) {
      result = result.filter(item => filters.value.types.includes(item.type));
    }

    // 收藏筛选
    if (filters.value.favoriteFilter === 'favorite') {
      result = result.filter(item => userStore.isFavorite(item.id));
    } else if (filters.value.favoriteFilter === 'non-favorite') {
      result = result.filter(item => !userStore.isFavorite(item.id));
    }

    // 搜索关键词筛选
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim();
      
      result = result.filter(item => {
        const name = stripFormatting(item.name[language.value]).toLowerCase();
        const desc = stripFormatting(item.description[language.value]).toLowerCase();

        switch (filters.value.searchScope) {
          case 'name':
            return name.includes(query);
          case 'description':
            return desc.includes(query);
          default:
            return name.includes(query) || desc.includes(query);
        }
      });
    }

    return result;
  });

  const resultCount = computed(() => filteredItems.value.length);
  const hasResults = computed(() => resultCount.value > 0);

  const clearSearch = () => {
    searchQuery.value = '';
  };

  const resetFilters = () => {
    filters.value = {
      games: [1, 2, 3],
      types: ['weapon', 'armor', 'ring', 'item', 'magic'],
      searchScope: 'all',
      favoriteFilter: 'all'
    };
  };

  return {
    searchQuery,
    filters,
    filteredItems,
    resultCount,
    hasResults,
    clearSearch,
    resetFilters
  };
}
