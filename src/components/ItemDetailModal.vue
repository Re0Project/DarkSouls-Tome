<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <button class="modal-close" @click="close" aria-label="关闭">✕</button>
          
          <div class="modal-content">
            <div class="item-header">
              <div class="item-icon-large">
                <LazyImage :src="iconPath" :alt="displayName" />
              </div>
              <div class="item-info">
                <h2 class="item-name">{{ displayName }}</h2>
                <div class="item-meta">
                  <span class="meta-tag">{{ GAME_NAMES[item.game] }}</span>
                  <span class="meta-tag">{{ ITEM_TYPE_NAMES[item.type] }}</span>
                </div>
              </div>
              <button 
                class="favorite-btn-large" 
                :class="{ active: isFavorite }"
                @click="toggleFavorite"
                :title="isFavorite ? '取消收藏' : '添加收藏'"
              >
                <span class="icon">{{ isFavorite ? '★' : '☆' }}</span>
              </button>
            </div>

            <div class="item-body">
              <div class="detail-section">
                <h3 class="section-title">描述</h3>
                <p class="item-description" v-html="formattedDescription"></p>
              </div>

              <div v-if="displayRemark" class="detail-section">
                <h3 class="section-title">备注</h3>
                <p class="item-remark" v-html="formattedRemark"></p>
              </div>

              <div class="detail-section">
                <h3 class="section-title">其他语言</h3>
                <div class="language-versions">
                  <div v-for="lang in otherLanguages" :key="lang.code" class="lang-version">
                    <span class="lang-label">{{ lang.label }}:</span>
                    <span class="lang-text">{{ item.name[lang.code] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { formatText } from '@/utils/formatter';
import { GAME_NAMES, ITEM_TYPE_NAMES } from '@/utils/constants';
import LazyImage from './LazyImage.vue';
import type { Item, Language } from '@/types/item';

const props = defineProps<{
  modelValue: boolean;
  item: Item;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const userStore = useUserStore();

const displayName = computed(() => props.item.name[userStore.currentLanguage]);
const displayDescription = computed(() => props.item.description[userStore.currentLanguage]);
const displayRemark = computed(() => props.item.remark?.[userStore.currentLanguage]);

const formattedDescription = computed(() => formatText(displayDescription.value));
const formattedRemark = computed(() => displayRemark.value ? formatText(displayRemark.value) : '');

const iconPath = computed(() => `/icons/${props.item.icon}`);
const isFavorite = computed(() => userStore.isFavorite(props.item.id));

const otherLanguages = computed(() => {
  const allLangs = [
    { code: 'chn' as Language, label: '中文' },
    { code: 'jap' as Language, label: '日本語' },
    { code: 'eng' as Language, label: 'English' }
  ];
  return allLangs.filter(lang => lang.code !== userStore.currentLanguage);
});

const close = () => {
  emit('update:modelValue', false);
};

const toggleFavorite = () => {
  userStore.toggleFavorite(props.item.id);
};

// ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close();
  }
};

// 监听键盘事件
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown);
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover {
    background: rgba(255, 0, 0, 0.2);
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
}

.modal-content {
  padding: 2rem;
}

.item-header {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-border);
}

.item-icon-large {
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1.8rem;
  color: var(--color-accent);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.item-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid var(--color-accent);
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--color-accent);
}

.favorite-btn-large {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  .icon {
    font-size: 1.8rem;
    color: var(--color-text-secondary);
  }

  &:hover {
    border-color: var(--color-accent);
    transform: scale(1.1);
    
    .icon {
      color: gold;
    }
  }

  &.active {
    border-color: gold;
    background: rgba(255, 215, 0, 0.1);
    
    .icon {
      color: gold;
    }
  }
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  .section-title {
    font-size: 1.2rem;
    color: var(--color-accent);
    margin: 0 0 0.75rem 0;
    font-weight: 500;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
  }
}

.item-description,
.item-remark {
  font-size: 1rem;
  color: var(--color-text-primary);
  line-height: 1.8;
  margin: 0;
  white-space: pre-wrap;
}

.item-remark {
  font-style: italic;
  color: var(--color-text-secondary);
}

.language-versions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lang-version {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border-left: 3px solid var(--color-accent);
}

.lang-label {
  font-weight: 600;
  color: var(--color-accent);
  min-width: 80px;
}

.lang-text {
  color: var(--color-text-primary);
  flex: 1;
}

// 动画
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.9) translateY(-20px);
  }
}

// 响应式
@media (max-width: 768px) {
  .modal-container {
    max-height: 95vh;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .item-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .item-icon-large {
    width: 128px;
    height: 128px;
  }

  .item-name {
    font-size: 1.5rem;
  }

  .favorite-btn-large {
    position: absolute;
    top: 1rem;
    right: 4rem;
  }
}
</style>
