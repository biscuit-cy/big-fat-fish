import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getHotspot, TOTAL_HOTSPOTS } from '@/content/hotspots'
import type { ZoneId } from '@/content/hotspots'
import { createId, safeStorage } from '@/lib/storage'

export type Phase = 'intro' | 'street' | 'ending'
export type PanelKind = 'fragments' | 'wall' | null

export interface WallEntry {
  id: string
  text: string
  createdAt: number
}

interface GameState {
  phase: Phase
  /** 炉火已经点燃，但还没走进街 */
  introLit: boolean
  collected: string[]
  wall: WallEntry[]
  muted: boolean
  endingSeen: boolean
  activeHotspotId: string | null
  panel: PanelKind
  zone: ZoneId

  ignite: () => void
  enterStreet: () => void
  collect: (id: string) => void
  openHotspot: (id: string) => void
  closeHotspot: () => void
  openPanel: (kind: Exclude<PanelKind, null>) => void
  closePanel: () => void
  addWallEntry: (text: string) => void
  toggleMuted: () => void
  setZone: (zone: ZoneId) => void
  dismissEnding: () => void
  resetAll: () => void
}

function isAllCollected(collected: string[]): boolean {
  return collected.length >= TOTAL_HOTSPOTS
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      phase: 'intro',
      introLit: false,
      collected: [],
      wall: [],
      muted: false,
      endingSeen: false,
      activeHotspotId: null,
      panel: null,
      zone: 'dawn',

      ignite: () => set({ introLit: true }),

      enterStreet: () =>
        set((state) => {
          const finished = isAllCollected(state.collected) && !state.endingSeen
          return {
            phase: finished ? 'ending' : 'street',
            introLit: true,
            endingSeen: state.endingSeen || finished,
          }
        }),

      collect: (id) =>
        set((state) => {
          if (!getHotspot(id) || state.collected.includes(id)) return state
          return { collected: [...state.collected, id] }
        }),

      openHotspot: (id) => set({ activeHotspotId: id, panel: null }),

      closeHotspot: () =>
        set((state) => {
          const finished = isAllCollected(state.collected) && !state.endingSeen
          return {
            activeHotspotId: null,
            phase: finished ? 'ending' : state.phase,
            endingSeen: state.endingSeen || finished,
          }
        }),

      openPanel: (kind) => set({ panel: kind, activeHotspotId: null }),
      closePanel: () => set({ panel: null }),

      addWallEntry: (text) =>
        set((state) => {
          const trimmed = text.trim().slice(0, 60)
          if (!trimmed) return state
          const entry: WallEntry = {
            id: createId(),
            text: trimmed,
            createdAt: Date.now(),
          }
          return { wall: [entry, ...state.wall].slice(0, 50) }
        }),

      toggleMuted: () => set((state) => ({ muted: !state.muted })),
      setZone: (zone) => set((state) => (state.zone === zone ? state : { zone })),
      dismissEnding: () => set({ phase: 'street' }),

      resetAll: () =>
        set({
          phase: 'intro',
          introLit: false,
          collected: [],
          endingSeen: false,
          activeHotspotId: null,
          panel: null,
          zone: 'dawn',
        }),
    }),
    {
      name: 'shijing-yanhuo:v1',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        collected: state.collected,
        wall: state.wall,
        muted: state.muted,
        endingSeen: state.endingSeen,
      }),
      merge: (persisted, current) => {
        const data = persisted as Partial<GameState> | undefined
        const collected = Array.isArray(data?.collected)
          ? Array.from(
              new Set(
                data.collected.filter(
                  (id): id is string => typeof id === 'string' && Boolean(getHotspot(id)),
                ),
              ),
            )
          : []
        const wall = Array.isArray(data?.wall)
          ? data.wall
              .filter(
                (entry): entry is WallEntry =>
                  Boolean(entry) &&
                  typeof entry.id === 'string' &&
                  typeof entry.text === 'string' &&
                  typeof entry.createdAt === 'number' &&
                  Number.isFinite(entry.createdAt),
              )
              .slice(0, 50)
          : []
        return {
          ...current,
          collected,
          wall,
          muted: typeof data?.muted === 'boolean' ? data.muted : false,
          endingSeen: typeof data?.endingSeen === 'boolean' ? data.endingSeen : false,
        }
      },
    },
  ),
)
