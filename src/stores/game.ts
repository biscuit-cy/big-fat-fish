import { create } from 'zustand'

export type ScenePhase = 'unlit' | 'lit'

interface GameState {
  phase: ScenePhase
  ignite: () => void
  reset: () => void
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'unlit',
  ignite: () => set({ phase: 'lit' }),
  reset: () => set({ phase: 'unlit' }),
}))
