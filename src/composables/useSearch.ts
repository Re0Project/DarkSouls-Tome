import { ref, computed, type Ref } from 'vue';
import type { Item, Language } from '@/types/item';
import { stripFormatting } from '@/utils/formatter';

export function useSearch(items: Ref<Item[]>, language: Ref<Language>) {
  const searchQuery = ref('');

  const filteredItems = computed(() => {
    if (!searchQuery.value.trim()) return items.value;
    
    const query = searchQuery.value.toLowerCase().trim();
    
    return items.value.filter(item => {
      const name = stripFormatting(item.name[language.value]).toLowerCase();
      const desc = stripFormatting(item.description[language.value]).toLowerCase();
      
      return name.includes(query) || desc.includes(query);
    });
  });

  const resultCount = computed(() => filteredItems.value.length);
  const hasResults = computed(() => resultCount.value > 0);

  const clearSearch = () => {
    searchQuery.value = '';
  };

  return {
    searchQuery,
    filteredItems,
    resultCount,
    hasResults,
    clearSearch
  };
}
