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

        <div v-else class="detail-container">
          <!-- 面包屑导航 -->
          <nav class="breadcrumb">
            <router-link to="/">首页</router-link>
            <span>/</span>
            <router-link :to="`/ds${game}/${type}`">{{ typeName }}</router-link>
            <span>/</span>
            <span>{{ item.name.chn }}</span>
          </nav>

          <!-- 物品信息 -->
          <div class="detail-content">
            <div class="detail-header">
              <div class="item-icon-large">
                <img :src="`/icons/${item.icon}`" :alt="item.name.chn">
              </div>
              <div class="item-meta">
                <h1>{{ item.name.chn }}</h1>
                <p class="item-type">{{ typeName }}</p>
                <button @click="toggleFavorite" class="favorite-btn" :class="{ active: isFavorite }">
                  {{ isFavorite ? '★ 已收藏' : '☆ 收藏' }}
                </button>
              </div>
            </div>

            <!-- 三语描述 -->
            <div class="detail-descriptions">
              <div class="desc-section">
                <h3>中文</h3>
                <div class="desc-content" v-html="formatText(item.description.chn)"></div>
              </div>
              <div class="desc-section">
                <h3>日本語</h3>
                <div class="desc-content" v-html="formatText(item.description.jap)"></div>
              </div>
              <div class="desc-section eng">
                <h3>English</h3>
                <div class="desc-content" v-html="formatText(item.description.eng)"></div>
              </div>
            </div>

            <!-- 备注 -->
            <div v-if="item.remark?.chn" class="detail-remark">
              <h3>备注</h3>
              <div class="remark-content">
                <div class="remark-lang">
                  <strong>中文：</strong>
                  <span v-html="formatText(item.remark.chn)"></span>
                </div>
                <div v-if="item.remark.jap" class="remark-lang">
                  <strong>日本語：</strong>
                  <span v-html="formatText(item.remark.jap)"></span>
                </div>
                <div v-if="item.remark.eng" class="remark-lang eng">
                  <strong>English：</strong>
                  <span v-html="formatText(item.remark.eng)"></span>
                </div>
              </div>
            </div>

            <!-- 相关物品 -->
            <div v-if="relatedItems.length > 0" class="related-items">
              <h3>相关物品</h3>
              <div class="related-grid">
                <router-link 
                  v-for="related in relatedItems" 
                  :key="related.id"
                  :to="`/ds${game}/${type}/${related.id}`"
                  class="related-item"
                >
                  <img :src="`/icons/${related.icon}`" :alt="related.name.chn">
                  <span>{{ related.name.chn }}</span>
                </router-link>
              </div>
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
import { GAME_NAMES, ITEM_TYPE_NAMES } from '@/utils/constants';
import ImprovedNavigation from '@/components/layout/ImprovedNavigation.vue';
import SidebarNav from '@/components/layout/SidebarNav.vue';
import type { GameVersion, ItemType } from '@/types/item';

const props = defineProps<{
  game: string;
  type: string;
  id: string;
}>();

const userStore = useUserStore();

const gameNum = computed(() => Number(props.game) as GameVersion);
const itemType = computed(() => props.type as ItemType);

const typeName = computed(() => {
  return `${GAME_NAMES[gameNum.value]} - ${ITEM_TYPE_NAMES[itemType.value]}`;
});

const { items, loading, error, loadData } = useGameData(gameNum.value, itemType.value);

const item = computed(() => {
  return items.value.find(i => i.id === props.id);
});

const isFavorite = computed(() => {
  return item.value ? userStore.isFavorite(item.value.id) : false;
});

const relatedItems = computed(() => {
  if (!item.value) return [];
  // 随机选择5个相关物品（同类型）
  const others = items.value.filter(i => i.id !== item.value!.id);
  return others.sort(() => Math.random() - 0.5).slice(0, 5);
});

const formatText = (text: string) => {
  return formatGameText(text || '');
};

const toggleFavorite = () => {
  if (item.value) {
    userStore.toggleFavorite(item.value.id);
  }
};

onMounted(() => {
  loadData();
});

// 监听路由变化，重新加载数据
watch(() => props.id, () => {
  if (items.value.length === 0) {
    loadData();
  }
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/classic.scss';

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
    margin: 0 auto 1em;
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

    &:hover {
      border-color: #960;
      background: #222;
    }
  }
}

.detail-container {
  padding: 2em;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1000px) {
    padding: 1em;
  }
}

.breadcrumb {
  margin-bottom: 2em;
  color: #aaa;
  font-size: 0.95em;

  a {
    color: #960;
    transition: 0.3s;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    margin: 0 0.5em;
  }
}

.detail-content {
  background: #111;
  padding: 2em;
  box-shadow: inset 0 0 .3em .1em #531;

  @media (max-width: 1000px) {
    padding: 1em;
  }
}

.detail-header {
  display: flex;
  gap: 2em;
  margin-bottom: 2em;
  padding-bottom: 2em;
  border-bottom: 1px solid #430;

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1em;
  }

  .item-icon-large {
    width: 128px;
    height: 128px;
    background: #000;
    border: 2px solid #430;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .item-meta {
    flex: 1;

    h1 {
      color: #960;
      font-size: 2em;
      margin: 0 0 0.5em 0;
      font-family: '仿宋', 'SimSun', serif;

      @media (max-width: 1000px) {
        font-size: 1.5em;
      }
    }

    .item-type {
      color: #aaa;
      margin: 0 0 1em 0;
      font-size: 1.1em;
    }

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
}

.detail-descriptions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2em;
  margin-bottom: 2em;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    gap: 1.5em;
  }

  .desc-section {
    h3 {
      color: #960;
      margin: 0 0 1em 0;
      border-bottom: 1px solid #430;
      padding-bottom: 0.5em;
      font-family: '仿宋', 'SimSun', serif;
      font-size: 1.1em;
    }

    .desc-content {
      color: #ccc;
      line-height: 1.8;
      font-family: '仿宋', 'SimSun', serif;
    }

    &.eng .desc-content {
      font-family: 'Palatino Linotype', serif;
    }
  }
}

.detail-remark {
  margin-bottom: 2em;
  padding: 1.5em;
  background: rgba(153, 102, 0, 0.1);
  border-left: 3px solid #960;

  h3 {
    color: #960;
    margin: 0 0 1em 0;
    font-family: '仿宋', 'SimSun', serif;
    font-size: 1.1em;
  }

  .remark-content {
    display: flex;
    flex-direction: column;
    gap: 0.75em;
  }

  .remark-lang {
    color: #ccc;
    line-height: 1.6;
    font-family: '仿宋', 'SimSun', serif;

    strong {
      color: #fe6;
      margin-right: 0.5em;
    }

    &.eng {
      font-family: 'Palatino Linotype', serif;
    }
  }
}

.related-items {
  h3 {
    color: #960;
    margin: 0 0 1em 0;
    border-bottom: 1px solid #430;
    padding-bottom: 0.5em;
    font-family: '仿宋', 'SimSun', serif;
    font-size: 1.1em;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1em;

    @media (max-width: 1000px) {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    .related-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1em;
      background: #222;
      border: 1px solid #430;
      transition: 0.3s;
      text-align: center;

      &:hover {
        border-color: #960;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      img {
        width: 64px;
        height: 64px;
        object-fit: contain;
        margin-bottom: 0.5em;

        @media (max-width: 1000px) {
          width: 48px;
          height: 48px;
        }
      }

      span {
        color: #ccc;
        font-size: 0.9em;
        font-family: '仿宋', 'SimSun', serif;
      }
    }
  }
}
</style>
