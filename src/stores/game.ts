import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GameVersion } from '@/types/item';

export const useGameStore = defineStore('game', () => {
  const currentGame = ref<GameVersion>(1);
  
  const setGame = (game: GameVersion) => {
    currentGame.value = game;
    localStorage.setItem('current-game', String(game));
  };

  const loadGame = () => {
    const saved = localStorage.getItem('current-game');
    if (saved && ['1', '2', '3'].includes(saved)) {
      currentGame.value = Number(saved) as GameVersion;
    }
  };

  return {
    currentGame,
    setGame,
    loadGame
  };
});
