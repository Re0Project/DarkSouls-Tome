<template>
  <div class="favorite-view">
    <header class="view-header">
      <div class="header-content">
        <router-link to="/" class="back-link">← 返回</router-link>
        <h1 class="title">我的收藏</h1>
        <LanguageSwitch />
      </div>
    </header>

    <main class="view-main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="favoriteItems.length === 0" class="empty">
        <p class="empty-icon">📌</p>
        <p>还没有收藏任何物品</p>
        <router-link to="/" class="browse-link">去浏览物品</router-link>
      </div>

      <div v-else class="favorites-container">
        <div class="favorites-header">
          <p class="item-count">共 {{ favoriteItems.length }} 项收藏</p>
          <button @click="clearAll" class="clear-btn">清空收藏</button>
        </div>

        <div class="items-grid">
          <ItemCard 
            v-for="item in favoriteItems" 
            :key="item.id" 
            :item="item"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import ItemCard from '@/components/ItemCard.vue';
import LanguageSwitch from '@/components/LanguageSwitch.vue';
import type { Item } from '@/types/item';

const userStore = useUserStore();
const loading = ref(true);
const allItems = ref<Item[]>([]);

const favoriteItems = computed(() => {
  return allItems.value.filter(item => userStore.isFavorite(item.id));
});

const loadFavorites = async () => {
  loading.value = true;
  
  try {
    // 加载所有游戏的所有类型数据
    const games = [1, 2, 3];
    const types = ['weapon', 'armor', 'ring', 'item', 'magic'];
    const promises = [];

    for (const game of games) {
      for (const type of types) {
        promises.push(
          import(`@/data/ds${game}/${type}s.json`)
            .then(module => module.default)
            .catch(() => [])
        );
      }
    }

    const results = await Promise.all(promises);
    allItems.value = results.flat();
  } catch (error) {
    console.error('Failed to load favorites:', error);
  } finally {
    loading.value = false;
  }
};

const clearAll = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    favoriteItems.value.forEach(item => {
      userStore.toggleFavorite(item.id);
    });
  }
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.favorite-view {
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
  gap: 1rem;
}

.back-link {
  padding: 0.5rem 1rem;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.title {
  flex: 1;
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

.loading,
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

.empty {
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .browse-link {
    display: inline-block;
    margin-top: 2rem;
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-primary);
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
  }
}

.favorites-container {
  padding: 1rem;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);

  .item-count {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    margin: 0;
  }

  .clear-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #ff6b6b;
      color: #ff6b6b;
    }
  }
}

.items-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .title {
    width: 100%;
    order: -1;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>
