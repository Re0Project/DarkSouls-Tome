<template>
  <div class="item-card" :class="{ 'is-favorite': isFavorite }">
    <div class="item-icon">
      <img :src="iconPath" :alt="displayName" @error="onImageError" />
    </div>
    
    <div class="item-content">
      <h3 class="item-name">{{ displayName }}</h3>
      <p class="item-description">{{ displayDescription }}</p>
      <p v-if="displayRemark" class="item-remark">{{ displayRemark }}</p>
    </div>

    <button 
      class="favorite-btn" 
      :class="{ active: isFavorite }"
      @click.stop="toggleFavorite"
      :title="isFavorite ? '取消收藏' : '添加收藏'"
    >
      <span class="icon">{{ isFavorite ? '★' : '☆' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import type { Item } from '@/types/item';

const props = defineProps<{
  item: Item;
}>();

const userStore = useUserStore();

const displayName = computed(() => props.item.name[userStore.currentLanguage]);
const displayDescription = computed(() => props.item.description[userStore.currentLanguage]);
const displayRemark = computed(() => props.item.remark?.[userStore.currentLanguage]);

const iconPath = computed(() => {
  return `/icons/${props.item.icon}`;
});

const isFavorite = computed(() => userStore.isFavorite(props.item.id));

const toggleFavorite = () => {
  userStore.toggleFavorite(props.item.id);
};

const onImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = '/icons/placeholder.webp';
};
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.item-card {
  position: relative;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &.is-favorite {
    border-color: rgba(255, 215, 0, 0.3);
  }
}

.item-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1.1rem;
  color: var(--color-accent);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.item-description {
  font-size: 0.9rem;
  color: var(--color-text-primary);
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.item-remark {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.4;
  margin: 0;
}

.favorite-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .icon {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }

  &:hover {
    border-color: var(--color-accent);
    
    .icon {
      color: gold;
    }
  }

  &.active .icon {
    color: gold;
  }
}

@media (max-width: 768px) {
  .item-card {
    flex-direction: column;
  }

  .item-icon {
    width: 100%;
    height: 120px;
  }
}
</style>
