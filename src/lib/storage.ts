import type { StateStorage } from 'zustand/middleware'

/**
 * 包一层 localStorage：
 * 隐私模式、配额写满或存储被禁用时，静默降级为内存态，避免白屏。
 */
const memory = new Map<string, string>()
let useMemory = false

export const safeStorage: StateStorage = {
  getItem: (name) => {
    if (!useMemory) {
      try {
        return window.localStorage.getItem(name)
      } catch {
        useMemory = true
      }
    }
    return memory.get(name) ?? null
  },
  setItem: (name, value) => {
    if (!useMemory) {
      try {
        window.localStorage.setItem(name, value)
        return
      } catch {
        useMemory = true
      }
    }
    memory.set(name, value)
  },
  removeItem: (name) => {
    memory.delete(name)
    if (useMemory) return
    try {
      window.localStorage.removeItem(name)
    } catch {
      // 存储不可用时无需处理
    }
  },
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
