import type { ZoneId } from '@/content/hotspots'

export interface ZoneMeta {
  id: ZoneId
  name: string
  sub: string
  timeRange: string
  /** 该时段在整条街上的起止进度（0..1） */
  start: number
  end: number
}

/** 三段等宽：清晨 / 午后 / 深夜 */
export const ZONES: readonly ZoneMeta[] = [
  {
    id: 'dawn',
    name: '清晨菜市场',
    sub: '六点四十七分，城市还没醒',
    timeRange: '06:47 — 08:30',
    start: 0,
    end: 3 / 7,
  },
  {
    id: 'afternoon',
    name: '午后老街',
    sub: '阳光把影子拉得很长',
    timeRange: '14:00 — 17:30',
    start: 3 / 7,
    end: 6 / 7,
  },
  {
    id: 'night',
    name: '深夜烧烤摊',
    sub: '还有一盏灯为晚归的人亮着',
    timeRange: '20:30 — 23:30',
    start: 6 / 7,
    end: 1,
  },
]

/**
 * 三个时段各占 150vw，世界总宽 450vw，可视窗口 100vw：
 * 相机从 0 走到 350vw，因此午后与深夜的起点分别落在 3/7 与 6/7。
 */
export const AFTERNOON_START = 3 / 7
export const NIGHT_START = 6 / 7

export function getZone(progress: number): ZoneMeta {
  const p = clamp01(progress)
  if (p < AFTERNOON_START) return ZONES[0]
  if (p < NIGHT_START) return ZONES[1]
  return ZONES[2]
}

/* ------------------------------------------------------------------ */
/* 时间与光影关键帧                                                     */
/* ------------------------------------------------------------------ */

interface LightKey {
  at: number
  skyTop: string
  skyMid: string
  skyLow: string
  skyHorizon: string
  skyFloor: string
  orbX: number
  orbY: number
  orbCore: string
  orbHalo: string
  orbOpacity: number
  hazeOpacity: number
  windowGlow: number
  lampOpacity: number
  stallBrightness: number
  stallSat: number
  tint: string
  tintAlpha: number
  vignette: number
}

/**
 * 关键帧刻意包含区段边界附近的两个点：
 * 走过时段交界时，时间和光线会快速“快进”到下一幕。
 */
const LIGHT_KEYS: readonly LightKey[] = [
  {
    at: 0,
    skyTop: '#0c1516',
    skyMid: '#22322d',
    skyLow: '#4f463c',
    skyHorizon: '#8f6049',
    skyFloor: '#a97451',
    orbX: 68,
    orbY: 57,
    orbCore: '#ffd7a0',
    orbHalo: '#ff9f63',
    orbOpacity: 0.65,
    hazeOpacity: 0.92,
    windowGlow: 0.55,
    lampOpacity: 0.5,
    stallBrightness: 0.95,
    stallSat: 0.9,
    tint: '#0a1a1a',
    tintAlpha: 0.04,
    vignette: 1,
  },
  {
    at: 0.39,
    skyTop: '#16302e',
    skyMid: '#3b554d',
    skyLow: '#8a714f',
    skyHorizon: '#c99a67',
    skyFloor: '#d7ab78',
    orbX: 70,
    orbY: 42,
    orbCore: '#ffe3b0',
    orbHalo: '#ffb877',
    orbOpacity: 0.8,
    hazeOpacity: 0.55,
    windowGlow: 0.3,
    lampOpacity: 0.25,
    stallBrightness: 1.02,
    stallSat: 0.98,
    tint: '#ffe0a0',
    tintAlpha: 0.03,
    vignette: 0.9,
  },
  {
    at: 0.44,
    skyTop: '#3f6977',
    skyMid: '#7d9a94',
    skyLow: '#c7b78e',
    skyHorizon: '#e5c795',
    skyFloor: '#edd6a8',
    orbX: 74,
    orbY: 26,
    orbCore: '#fff4d2',
    orbHalo: '#ffd9a0',
    orbOpacity: 0.85,
    hazeOpacity: 0.42,
    windowGlow: 0.1,
    lampOpacity: 0.05,
    stallBrightness: 1.07,
    stallSat: 1.02,
    tint: '#ffd9a0',
    tintAlpha: 0.05,
    vignette: 0.72,
  },
  {
    at: 0.8,
    skyTop: '#355865',
    skyMid: '#6c807c',
    skyLow: '#b28d6a',
    skyHorizon: '#d89a63',
    skyFloor: '#e0a76f',
    orbX: 80,
    orbY: 46,
    orbCore: '#ffdca8',
    orbHalo: '#ff9e5c',
    orbOpacity: 0.8,
    hazeOpacity: 0.5,
    windowGlow: 0.28,
    lampOpacity: 0.3,
    stallBrightness: 1.02,
    stallSat: 1,
    tint: '#ffb070',
    tintAlpha: 0.07,
    vignette: 0.8,
  },
  {
    at: 0.84,
    skyTop: '#1a2636',
    skyMid: '#3c4550',
    skyLow: '#7a5445',
    skyHorizon: '#b26b49',
    skyFloor: '#c07a53',
    orbX: 70,
    orbY: 68,
    orbCore: '#ffb877',
    orbHalo: '#ff7a45',
    orbOpacity: 0.45,
    hazeOpacity: 0.35,
    windowGlow: 0.62,
    lampOpacity: 0.68,
    stallBrightness: 0.92,
    stallSat: 0.95,
    tint: '#3a2233',
    tintAlpha: 0.12,
    vignette: 0.95,
  },
  {
    at: 0.87,
    skyTop: '#070d16',
    skyMid: '#0d1620',
    skyLow: '#17222f',
    skyHorizon: '#242e3c',
    skyFloor: '#2b3543',
    orbX: 28,
    orbY: 20,
    orbCore: '#dfe8f5',
    orbHalo: '#9db4d0',
    orbOpacity: 0.55,
    hazeOpacity: 0.22,
    windowGlow: 0.8,
    lampOpacity: 0.9,
    stallBrightness: 0.82,
    stallSat: 0.88,
    tint: '#050a14',
    tintAlpha: 0.2,
    vignette: 1.08,
  },
  {
    at: 1,
    skyTop: '#04070c',
    skyMid: '#080e15',
    skyLow: '#101821',
    skyHorizon: '#1a2230',
    skyFloor: '#222b3a',
    orbX: 24,
    orbY: 16,
    orbCore: '#cfd9e8',
    orbHalo: '#8ea3c0',
    orbOpacity: 0.6,
    hazeOpacity: 0.16,
    windowGlow: 0.92,
    lampOpacity: 1,
    stallBrightness: 0.78,
    stallSat: 0.86,
    tint: '#03060e',
    tintAlpha: 0.26,
    vignette: 1.15,
  },
]

/** 漫游进度对应的时间（分钟），交界处快进 */
const TIME_KEYS: readonly { at: number; minutes: number }[] = [
  { at: 0, minutes: 6 * 60 + 47 },
  { at: 0.39, minutes: 8 * 60 + 30 },
  { at: AFTERNOON_START, minutes: 14 * 60 },
  { at: 0.8, minutes: 17 * 60 + 30 },
  { at: NIGHT_START, minutes: 20 * 60 + 30 },
  { at: 1, minutes: 23 * 60 + 30 },
]

export interface LightingState {
  vars: Record<string, string>
  time: string
  zone: ZoneMeta
}

export function getLighting(progress: number): LightingState {
  const p = clamp01(progress)
  const key = findSegment(LIGHT_KEYS, p)
  const t = segmentRatio(key[0].at, key[1].at, p)
  const a = key[0]
  const b = key[1]

  const skyTop = mixHex(a.skyTop, b.skyTop, t)
  const skyMid = mixHex(a.skyMid, b.skyMid, t)
  const skyLow = mixHex(a.skyLow, b.skyLow, t)
  const skyHorizon = mixHex(a.skyHorizon, b.skyHorizon, t)
  const skyFloor = mixHex(a.skyFloor, b.skyFloor, t)
  const orbCore = mixHexRgba(a.orbCore, b.orbCore, t, 0.42)
  const orbHalo = mixHexRgba(a.orbHalo, b.orbHalo, t, 0.18)
  const tint = mixHex(a.tint, b.tint, t)
  const tintAlpha = lerp(a.tintAlpha, b.tintAlpha, t)

  return {
    time: formatMinutes(getMinutes(p)),
    zone: getZone(p),
    vars: {
      '--sky-top': skyTop,
      '--sky-mid': skyMid,
      '--sky-low': skyLow,
      '--sky-horizon': skyHorizon,
      '--sky-floor': skyFloor,
      '--orb-x': `${lerp(a.orbX, b.orbX, t).toFixed(2)}%`,
      '--orb-y': `${lerp(a.orbY, b.orbY, t).toFixed(2)}%`,
      '--orb-core': orbCore,
      '--orb-halo': orbHalo,
      '--orb-opacity': lerp(a.orbOpacity, b.orbOpacity, t).toFixed(3),
      '--haze-opacity': lerp(a.hazeOpacity, b.hazeOpacity, t).toFixed(3),
      '--window-glow': lerp(a.windowGlow, b.windowGlow, t).toFixed(3),
      '--lamp-opacity': lerp(a.lampOpacity, b.lampOpacity, t).toFixed(3),
      '--stall-brightness': lerp(a.stallBrightness, b.stallBrightness, t).toFixed(3),
      '--stall-sat': lerp(a.stallSat, b.stallSat, t).toFixed(3),
      '--scene-tint': toRgba(tint, tintAlpha),
      '--vignette-opacity': lerp(a.vignette, b.vignette, t).toFixed(3),
    },
  }
}

/** 把一帧光影直接写到场景根节点，避免 React 逐帧渲染 */
export function applyLighting(element: HTMLElement, progress: number): LightingState {
  const state = getLighting(progress)
  for (const [name, value] of Object.entries(state.vars)) {
    element.style.setProperty(name, value)
  }
  element.dataset.zone = state.zone.id
  return state
}

/* ------------------------------------------------------------------ */
/* 工具函数                                                            */
/* ------------------------------------------------------------------ */

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function segmentRatio(start: number, end: number, value: number): number {
  if (end <= start) return 0
  return clamp01((value - start) / (end - start))
}

/** 找到 value 落在哪两个关键帧之间 */
function findSegment<T extends { at: number }>(keys: readonly T[], value: number): [T, T] {
  if (value <= keys[0].at) return [keys[0], keys[0]]
  for (let i = 0; i < keys.length - 1; i += 1) {
    if (value <= keys[i + 1].at) return [keys[i], keys[i + 1]]
  }
  return [keys[keys.length - 1], keys[keys.length - 1]]
}

function getMinutes(progress: number): number {
  const key = findSegment(TIME_KEYS, progress)
  if (key[0] === key[1]) return key[0].minutes
  const t = segmentRatio(key[0].at, key[1].at, progress)
  return Math.round(lerp(key[0].minutes, key[1].minutes, t))
}

function formatMinutes(minutes: number): string {
  const hour = Math.floor(minutes / 60) % 24
  const minute = minutes % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

function mixHex(from: string, to: string, t: number): string {
  const a = parseHex(from)
  const b = parseHex(to)
  return toRgb(
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  )
}

function mixHexRgba(from: string, to: string, t: number, alpha: number): string {
  const a = parseHex(from)
  const b = parseHex(to)
  return `rgba(${Math.round(lerp(a[0], b[0], t))}, ${Math.round(lerp(a[1], b[1], t))}, ${Math.round(
    lerp(a[2], b[2], t),
  )}, ${alpha})`
}

function toRgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`
}

function toRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
}
