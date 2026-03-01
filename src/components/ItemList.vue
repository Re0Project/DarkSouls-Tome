<template>
  <div class="item-list">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ 加载失败</p>
      <p class="error-message">{{ error.message }}</p>
      <button @click="retry" class="retry-btn">重试</button>
    </div>

    <div v-else-if="items.length === 0" class="empty">
      <p>暂无数据</p>
    </div>

    <div v-else class="list-container">
      <div class="list-header">
        <p class="item-count">共 {{ items.length }} 项</p>
      </div>
      
      <div class="items-grid">
        <ItemCard 
          v-for="item in items" 
          :key="item.id" 
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemCard from './ItemCard.vue';
import type { Item } from '@/types/item';

defineProps<{
  items: Item[];
  loading: boolean;
  error: Error | null;
}>();

const emit = defineEmits<{
  retry: [];
}>();

const retry = () => {
  emit('retry');
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.item-list {
  width: 100%;
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

.list-container {
  padding: 1rem;
}

.list-header {
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);

  .item-count {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    margin: 0;
  }
}

.items-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>
