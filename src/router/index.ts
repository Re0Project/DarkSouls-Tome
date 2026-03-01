import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/ds:game/:type',
      name: 'ItemView',
      component: () => import('@/views/ItemView.vue'),
      props: true
    },
    {
      path: '/ds:game/dialogue/:npc',
      name: 'DialogueView',
      component: () => import('@/views/DialogueView.vue'),
      props: true
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/FavoriteView.vue')
    }
  ]
});

export default router;
