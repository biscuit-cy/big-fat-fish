import type { ZoneId } from '@/content/hotspots'

/**
 * 环境音系统。
 *
 * 当前没有音频素材，所以 AMBIENCE_ENABLED = false，控制器整体为空实现，
 * 不会发起任何网络请求。把音频文件按下面 SOURCES 的路径放进 public/audio/，
 * 再把开关改为 true 即可启用（无需改动组件）。
 */
export const AMBIENCE_ENABLED = false

const SOURCES: Record<ZoneId, string> = {
  dawn: 'audio/dawn.mp3',
  afternoon: 'audio/afternoon.mp3',
  night: 'audio/night.mp3',
}

const FADE_MS = 1200
const TICK_MS = 60

export interface AmbienceController {
  /** 必须在用户手势之后调用（自动播放策略） */
  init: () => void
  setZone: (zone: ZoneId) => void
  setMuted: (muted: boolean) => void
  dispose: () => void
}

export function createAmbienceController(): AmbienceController {
  if (!AMBIENCE_ENABLED || typeof window === 'undefined' || typeof window.Audio !== 'function') {
    return {
      init: () => undefined,
      setZone: () => undefined,
      setMuted: () => undefined,
      dispose: () => undefined,
    }
  }

  let initialised = false
  let muted = false
  let zone: ZoneId = 'dawn'
  let current: HTMLAudioElement | null = null
  const cache = new Map<ZoneId, HTMLAudioElement>()

  const targetVolume = () => (muted ? 0 : 0.45)

  function getTrack(next: ZoneId): HTMLAudioElement {
    const cached = cache.get(next)
    if (cached) return cached
    const audio = new Audio(SOURCES[next])
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    cache.set(next, audio)
    return audio
  }

  function fade(from: HTMLAudioElement | null, to: HTMLAudioElement | null) {
    const start = Date.now()
    const fromVolume = from?.volume ?? 0
    const toVolume = to ? targetVolume() : 0
    if (to && to.paused) {
      void to.play().catch(() => undefined)
    }
    const timer = window.setInterval(() => {
      const ratio = Math.min(1, (Date.now() - start) / FADE_MS)
      if (from) from.volume = fromVolume * (1 - ratio)
      if (to) to.volume = toVolume * ratio
      if (ratio >= 1) {
        window.clearInterval(timer)
        if (from && from !== to) from.pause()
      }
    }, TICK_MS)
  }

  function switchTo(next: ZoneId) {
    if (next === zone && current && !current.paused) return
    zone = next
    const track = getTrack(next)
    const previous = current
    current = track
    fade(previous, track)
  }

  return {
    init: () => {
      if (initialised) return
      initialised = true
      switchTo(zone)
    },
    setZone: (next) => {
      if (!initialised) {
        zone = next
        return
      }
      switchTo(next)
    },
    setMuted: (nextMuted) => {
      muted = nextMuted
      if (!current) return
      const start = Date.now()
      const fromVolume = current.volume
      const toVolume = targetVolume()
      const timer = window.setInterval(() => {
        if (!current) {
          window.clearInterval(timer)
          return
        }
        const ratio = Math.min(1, (Date.now() - start) / FADE_MS)
        current.volume = fromVolume + (toVolume - fromVolume) * ratio
        if (ratio >= 1) window.clearInterval(timer)
      }, TICK_MS)
    },
    dispose: () => {
      cache.forEach((audio) => {
        audio.pause()
        audio.src = ''
      })
      cache.clear()
      current = null
      initialised = false
    },
  }
}
