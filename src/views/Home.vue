<template>
  <div class="classic-home">
    <ClassicNavigation />
    <hr>
    <ClassicContainer>
      <div class="splash-container desktop">
        <div class="splash-placeholder">
          <h1>黑暗之魂系列文本数据库</h1>
          <p>Dark Souls Series Text Database</p>
          <p class="subtitle">⚔️ Praise the Sun! ☀️</p>
        </div>
      </div>
      <div class="splash-container mobile">
        <div class="splash-placeholder">
          <h1>黑魂数据库</h1>
          <p>Dark Souls DB</p>
        </div>
      </div>
    </ClassicContainer>
  </div>
</template>

<script setup lang="ts">
import ClassicNavigation from '@/components/layout/ClassicNavigation.vue';
import ClassicContainer from '@/components/layout/ClassicContainer.vue';
</script>

<style scoped lang="scss">
.classic-home {
  min-height: 100vh;
  background: #000;
}

hr {
  border: 0;
  height: 150px;

  @media (max-width: 1000px) {
    height: 6em;
  }
}

.splash-container {
  width: 100%;
  margin: 2em auto;
  text-align: center;
}

.splash-placeholder {
  background: #111;
  padding: 4em 2em;
  box-shadow: inset 0 0 .3em .1em #531;
  color: #ccc;

  h1 {
    font-size: 3em;
    color: #960;
    margin-bottom: 0.5em;
    font-family: '仿宋', 'SimSun', serif;
  }

  p {
    font-size: 1.5em;
    color: #aaa;
    font-family: 'Palatino Linotype', serif;
    margin: 0.5em 0;
  }

  .subtitle {
    margin-top: 2em;
    font-size: 2em;
  }
}

.desktop {
  @media (max-width: 1000px) {
    display: none;
  }
}

.mobile {
  display: none;

  @media (max-width: 1000px) {
    display: block;
  }

  .splash-placeholder {
    padding: 2em 1em;

    h1 {
      font-size: 2em;
    }

    p {
      font-size: 1.2em;
    }
  }
}
</style>
