<template>
  <div class="favorite-view">
    <h1>我的收藏</h1>
    <p class="placeholder">收藏功能开发中...</p>
    <router-link to="/" class="back-link">← 返回首页</router-link>
  </div>
</template>

<style scoped lang="scss">
.favorite-view {
  padding: 2rem;
  text-align: center;

  h1 {
    color: var(--color-accent);
    margin-bottom: 1rem;
  }

  .placeholder {
    margin: 3rem 0;
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }

  .back-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    margin-top: 2rem;

    &:hover {
      border-color: var(--color-accent);
    }
  }
}
</style>
