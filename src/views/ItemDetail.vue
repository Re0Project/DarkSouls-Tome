<template>
  <div class="item-detail-view">
    <ImprovedNavigation />
    <div class="detail-layout">
      <SidebarNav />
      <main class="detail-main">
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="error" class="error">
          <p>{{ error.message }}</p>
          <button @click="loadData">重试</button>
        </div>

        <div v-else-if="!item" class="not-found">
          <p>物品不存在</p>
          <router-link :to="`/ds${game}/${type}`">返回列表</router-link>
        </div>

        <div v-else class="contentd">
          <!-- 物品框架 -->
          <div class="frame">
            <!-- 物品图标 -->
            <div class="icon">
              <img :src="item.icon" :alt="displayName" @error="handleImageError">
            </div>

            <!-- 物品名称 -->
            <div class="title">
              <p>{{ displayName }}</p>
            </div>

            <!-- 物品描述 -->
            <div class="desfrm">
              <p v-html="formatText(displayDescription)"></p>
            </div>

            <!-- 备注 -->
            <div v-if="displayRemark" class="remk">
              <p v-html="formatText(displayRemark)"></p>
            </div>

            <!-- 收藏按钮 -->
            <div class="actions">
              <button @click="toggleFavorite" class="favorite-btn" :class="{ active: isFavorite }">
                {{ isFavorite ? '★ 已收藏' : '☆ 收藏' }}
              </button>
            </div>
          </div>

          <!-- 相关物品 -->
          <div v-if="relatedItems.length > 0" class="related-section">
            <div class="frame">
              <p class="section-title">相关物品</p>
              <router-link
                v-for="related in relatedItems"
                :key="related.id"
                :to="`/ds${game}/${type}/${related.id}`"
                class="icon related-item"
              >
                <img :src="related.icon" :alt="getItemName(related)" @error="handleImageError">
              </router-link>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useGameData } from '@/composables/useGameData';
import { useUserStore } from '@/stores/user';
import { formatGameText } from '@/utils/formatter';
import ImprovedNavigation from '@/components/layout/ImprovedNavigation.vue';
import SidebarNav from '@/components/layout/SidebarNav.vue';
import type { GameVersion, ItemType, Item } from '@/types/item';

const props = defineProps<{
  game: string;
  type: string;
  id: string;
}>();

const userStore = useUserStore();

const gameNum = computed(() => Number(props.game) as GameVersion);
const itemType = computed(() => props.type as ItemType);

const { items, loading, error, loadData } = useGameData(gameNum.value, itemType.value);

const item = computed(() => {
  return items.value.find(i => i.id === props.id);
});

const isFavorite = computed(() => {
  return item.value ? userStore.isFavorite(item.value.id) : false;
});

const displayName = computed(() => {
  if (!item.value) return '';
  return item.value.name[userStore.currentLanguage];
});

const displayDescription = computed(() => {
  if (!item.value) return '';
  return item.value.description[userStore.currentLanguage];
});

const displayRemark = computed(() => {
  if (!item.value || !item.value.remark) return '';
  return item.value.remark[userStore.currentLanguage] || '';
});

const relatedItems = computed(() => {
  if (!item.value) return [];
  const others = items.value.filter(i => i.id !== item.value!.id);
  return others.sort(() => Math.random() - 0.5).slice(0, 8);
});

const getItemName = (item: Item) => {
  return item.name[userStore.currentLanguage];
};

const formatText = (text: string) => {
  return formatGameText(text || '');
};

const toggleFavorite = () => {
  if (item.value) {
    userStore.toggleFavorite(item.value.id);
  }
};

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
};

onMounted(() => {
  loadData();
});

watch(() => props.id, () => {
  if (items.value.length === 0) {
    loadData();
  }
});
</script>

<style scoped lang="scss">
.item-detail-view {
  min-height: 100vh;
  background: #000;
}

.detail-layout {
  display: flex;
  padding-top: 120px;

  @media (max-width: 1000px) {
    padding-top: 100px;
  }
}

.detail-main {
  flex: 1;
  min-width: 0;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 4em 2em;
  color: #ccc;
  font-family: '仿宋', 'SimSun', serif;

  .loading-spinner {
    width: 48px;
    height: 48px;
    margin: 0 auto 1em;
    border: 4px solid #430;
    border-top-color: #960;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  button,
  a {
    margin-top: 1em;
    padding: 0.5em 2em;
    background: #111;
    border: 1px solid #430;
    color: #960;
    font-family: '仿宋', 'SimSun', serif;
    cursor: pointer;
    transition: 0.3s;
    display: inline-block;
    text-decoration: none;

    &:hover {
      border-color: #960;
      background: #222;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// 原版风格
.contentd {
  width: 1800px;
  margin: 0 auto;
  overflow: hidden;

  @media (max-width: 1800px) {
    width: 100%;
    padding: 0 1em;
  }
}

.frame {
  text-align: center;
  overflow: hidden;
  background: #111;
  padding: 3em 2em;
  margin: 1em 0 2em;
  box-shadow: inset 0 0 .3em .1em #531;
  font: 18px/1.5 '仿宋', 'SimSun', serif;
  color: #ccc;
  position: relative;

  @media (max-width: 1000px) {
    font: 12px/1.5 '仿宋', 'SimSun', serif;
    margin: 0 0 2em;
  }
}

.icon {
  float: left;
  width: 10%;
  height: 1px;

  img {
    transform: translateY(-50%);
    margin: 14em 0 0;
    max-width: 120%;
  }

  @media (max-width: 1000px) {
    float: none;
    width: 33%;
    height: auto;
    margin: auto;

    img {
      transform: translateY(0);
      margin: 0;
    }
  }
}

.title {
  padding: 1% 1% 2%;
  font-family: 'Palatino Linotype', '仿宋', serif;
  font-size: 1.3em;
  color: #960;
  font-weight: 700;

  p {
    margin: 0;
  }
}

.desfrm {
  transform: translateY(-50%);
  margin: 12em 0;
  text-align: left;
  padding: 0 2em;

  p {
    border-bottom: 1px solid #321;
    box-sizing: border-box;
    min-height: 1.5em;
    padding: 0.25em 0;
    margin: 0;

    &:last-child {
      border-bottom: 0;
    }
  }

  @media (max-width: 1000px) {
    transform: none;
    margin: 2em 0;
    padding: 0 1em;

    p {
      min-height: 2.5em;
      font-size: 1.2em;
    }
  }
}

.remk {
  height: 3em;
  text-align: left;
  padding: 0 2em;

  p {
    transform: translateY(-50%);
    margin: 1.5em 0;
    color: #fe6;
  }

  @media (max-width: 1000px) {
    height: auto;
    padding: 0 1em;

    p {
      transform: translateY(0);
      margin: 1em 0;
    }
  }
}

.actions {
  clear: both;
  padding-top: 2em;
  text-align: center;

  .favorite-btn {
    padding: 0.6em 1.5em;
    background: #222;
    border: 1px solid #430;
    color: #960;
    font-family: '仿宋', 'SimSun', serif;
    cursor: pointer;
    transition: 0.3s;
    font-size: 1em;

    &:hover {
      background: #333;
      border-color: #960;
    }

    &.active {
      background: rgba(153, 102, 0, 0.2);
      border-color: #960;
      color: #fe6;
    }
  }
}

.related-section {
  .section-title {
    color: #960;
    font-size: 1.2em;
    margin-bottom: 1em;
    font-weight: 700;
  }

  .related-item {
    float: left;
    width: 10%;
    height: 11em;
    margin: 0 1.2em;
    opacity: 0.85;
    transition: 0.3s;

    &:hover {
      opacity: 1;
      border: 5px solid #531;
    }

    img {
      margin: 0;
      transform: none;
    }

    @media (max-width: 1000px) {
      margin: 5em 0;
      width: 33%;
      height: auto;
    }
  }
}
</style>
