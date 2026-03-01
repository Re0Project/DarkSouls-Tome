<template>
  <nav class="app-navigation" :class="{ 'is-open': isMenuOpen }">
    <div class="nav-container">
      <router-link to="/" class="nav-logo" @click="closeMenu">
        <span class="logo-icon">⚔️</span>
        <span class="logo-text">黑魂数据库</span>
      </router-link>

      <button class="menu-toggle" @click="toggleMenu" :aria-label="isMenuOpen ? '关闭菜单' : '打开菜单'">
        <span class="hamburger" :class="{ active: isMenuOpen }"></span>
      </button>

      <div class="nav-menu">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          @click="closeMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>

        <div class="nav-divider"></div>

        <div class="nav-actions">
          <LanguageSwitch />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LanguageSwitch from './LanguageSwitch.vue';

const router = useRouter();
const isMenuOpen = ref(false);

const navItems = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/favorites', icon: '⭐', label: '收藏' }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// 路由变化时关闭菜单
router.afterEach(() => {
  closeMenu();
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.app-navigation {
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-accent);
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-text {
    @media (max-width: 480px) {
      display: none;
    }
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text-primary);
  position: relative;
  transition: all 0.3s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: var(--color-text-primary);
    transition: all 0.3s ease;
  }

  &::before {
    top: -8px;
  }

  &::after {
    bottom: -8px;
  }

  &.active {
    background: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
    }

    &::after {
      bottom: 0;
      transform: rotate(-45deg);
    }
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    .is-open & {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-primary);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-accent);
  }

  &.router-link-active {
    background: rgba(255, 215, 0, 0.1);
    color: var(--color-accent);
  }

  .nav-icon {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}
</style>
