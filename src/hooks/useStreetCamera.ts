import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { AFTERNOON_START, NIGHT_START } from '@/content/zones'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface CameraOptions {
  sceneRef: RefObject<HTMLElement | null>
  worldRef: RefObject<HTMLElement | null>
  enabled: boolean
  reducedMotion: boolean
  /** 每次位置变化时回调，用于写光影与时间（不要在这里 setState） */
  onProgress: (progress: number) => void
}

export interface CameraApi {
  goTo: (progress: number) => void
  getProgress: () => number
}

const MIN_ZOOM = 0.9
const MAX_ZOOM = 1.15
const DRAG_THRESHOLD = 6

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * 移动端三个时段各占 1/3 屏，但光影时间轴按 3/7、6/7 分段。
 * 这两个函数在「滚动进度」与「时间轴进度」之间换算。
 */
function toStoryProgress(raw: number): number {
  const value = clamp(raw, 0, 1)
  if (value < 1 / 3) {
    return value * 3 * AFTERNOON_START
  }
  if (value < 2 / 3) {
    return AFTERNOON_START + (value * 3 - 1) * (NIGHT_START - AFTERNOON_START)
  }
  return NIGHT_START + (value * 3 - 2) * (1 - NIGHT_START)
}

function fromStoryProgress(story: number): number {
  const value = clamp(story, 0, 1)
  if (value < AFTERNOON_START) {
    return value / AFTERNOON_START / 3
  }
  if (value < NIGHT_START) {
    return (1 + (value - AFTERNOON_START) / (NIGHT_START - AFTERNOON_START)) / 3
  }
  return (2 + (value - NIGHT_START) / (1 - NIGHT_START)) / 3
}

/**
 * 桌面端：拖拽平移 + 滚轮缩放 + 方向键。
 * 移动端：交给外层容器原生纵向滚动。
 *
 * 所有位置更新只改 transform / CSS 变量，不触发 React 渲染，
 * 因此拖动时不会因为逐帧 setState 掉帧。
 */
export function useStreetCamera({
  sceneRef,
  worldRef,
  enabled,
  reducedMotion,
  onProgress,
}: CameraOptions): CameraApi {
  const vertical = useMediaQuery('(max-width: 820px)')
  const progressRef = useRef(0)
  const onProgressRef = useRef(onProgress)
  const reducedMotionRef = useRef(reducedMotion)
  const apiRef = useRef<CameraApi | null>(null)

  useEffect(() => {
    onProgressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    reducedMotionRef.current = reducedMotion
  }, [reducedMotion])

  const emit = useCallback((value: number) => {
    const next = clamp(value, 0, 1)
    progressRef.current = next
    onProgressRef.current(next)
  }, [])

  useEffect(() => {
    if (!enabled) {
      apiRef.current = null
      return
    }
    const scene = sceneRef.current
    const world = worldRef.current
    if (!scene || !world) return

    let raf = 0
    let inertiaRaf = 0
    const state = {
      pos: 0,
      max: 0,
      zoom: 1,
      dragging: false,
      moved: false,
      startX: 0,
      startPos: 0,
      velocity: 0,
      pointerId: -1,
    }

    const isVertical = () => window.matchMedia('(max-width: 820px)').matches

    const measure = () => {
      state.max = Math.max(0, world.offsetWidth * state.zoom - scene.clientWidth)
      return state.max
    }

    const publish = (progress: number) => {
      scene.style.setProperty('--cam-progress', progress.toFixed(4))
      emit(progress)
    }

    const applyDesktop = () => {
      measure()
      state.pos = clamp(state.pos, 0, state.max)
      world.style.transform = `translate3d(${-state.pos}px, 0, 0) scale(${state.zoom})`
      const progress = state.max > 0 ? state.pos / state.max : 0
      publish(progress)
    }

    const readScroll = () => {
      const max = Math.max(0, scene.scrollHeight - scene.clientHeight)
      const raw = max > 0 ? scene.scrollTop / max : 0
      publish(toStoryProgress(raw))
    }

    const cancelInertia = () => {
      if (inertiaRaf) {
        cancelAnimationFrame(inertiaRaf)
        inertiaRaf = 0
      }
    }

    const cancelAnimation = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      cancelInertia()
    }

    const animateTo = (target: number) => {
      cancelAnimation()
      const start = state.pos
      const distance = target - start
      if (Math.abs(distance) < 0.5 || reducedMotionRef.current) {
        state.pos = target
        applyDesktop()
        return
      }
      const started = performance.now()
      const duration = 520
      const frame = (now: number) => {
        const ratio = Math.min(1, (now - started) / duration)
        const eased = 1 - Math.pow(1 - ratio, 3)
        state.pos = start + distance * eased
        applyDesktop()
        if (ratio < 1) raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }

    const startInertia = () => {
      cancelInertia()
      if (reducedMotionRef.current) return
      let velocity = state.velocity
      const frame = () => {
        velocity *= 0.94
        if (Math.abs(velocity) < 0.2) {
          inertiaRaf = 0
          return
        }
        const before = state.pos
        state.pos = clamp(state.pos + velocity, 0, state.max)
        applyDesktop()
        if (state.pos === before) {
          inertiaRaf = 0
          return
        }
        inertiaRaf = requestAnimationFrame(frame)
      }
      inertiaRaf = requestAnimationFrame(frame)
    }

    let suppressClick = false

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      const target = event.target as HTMLElement
      if (target.closest('a, input, textarea, select, [role="dialog"], [data-no-drag]')) return
      cancelAnimation()
      suppressClick = false
      state.dragging = true
      state.moved = false
      state.startX = event.clientX
      state.startPos = state.pos
      state.velocity = 0
      state.pointerId = event.pointerId
      scene.setPointerCapture?.(event.pointerId)
      scene.classList.add('is-dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!state.dragging || event.pointerId !== state.pointerId) return
      const delta = event.clientX - state.startX
      if (!state.moved && Math.abs(delta) > DRAG_THRESHOLD) {
        state.moved = true
        suppressClick = true
      }
      if (!state.moved) return
      const previous = state.pos
      state.pos = clamp(state.startPos - delta, 0, state.max)
      state.velocity = state.pos - previous
      applyDesktop()
    }

    const endDrag = (event: PointerEvent) => {
      if (!state.dragging || event.pointerId !== state.pointerId) return
      state.dragging = false
      state.pointerId = -1
      scene.releasePointerCapture?.(event.pointerId)
      scene.classList.remove('is-dragging')
      if (state.moved) startInertia()
    }

    // 在热点上拖动时，避免松手后又触发一次点击打开故事卡
    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return
      suppressClick = false
      event.stopPropagation()
      event.preventDefault()
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      cancelAnimation()
      const oldZoom = state.zoom
      const nextZoom = clamp(oldZoom - event.deltaY * 0.0012, MIN_ZOOM, MAX_ZOOM)
      if (Math.abs(nextZoom - oldZoom) < 0.0005) return
      // 以视口中心为锚点缩放，避免画面漂移
      const center = (state.pos + scene.clientWidth / 2) / oldZoom
      state.zoom = nextZoom
      measure()
      state.pos = clamp(center * nextZoom - scene.clientWidth / 2, 0, state.max)
      applyDesktop()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isVertical()) return
      const target = event.target as HTMLElement | null
      if (
        target?.closest(
          'input, textarea, select, [contenteditable="true"], [role="dialog"], [data-no-drag]',
        )
      ) {
        return
      }
      if (
        event.key !== 'ArrowLeft' &&
        event.key !== 'ArrowRight' &&
        event.key !== 'Home' &&
        event.key !== 'End'
      ) {
        return
      }
      event.preventDefault()
      measure()
      if (event.key === 'Home') {
        animateTo(0)
        return
      }
      if (event.key === 'End') {
        animateTo(state.max)
        return
      }
      const step = scene.clientWidth * 0.24
      const targetPos = event.key === 'ArrowLeft' ? state.pos - step : state.pos + step
      animateTo(clamp(targetPos, 0, state.max))
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        readScroll()
      })
    }

    const onResize = () => {
      if (isVertical()) {
        readScroll()
        return
      }
      applyDesktop()
    }

    const goTo = (progress: number) => {
      const clamped = clamp(progress, 0, 1)
      if (isVertical()) {
        const max = Math.max(0, scene.scrollHeight - scene.clientHeight)
        scene.scrollTo({
          top: max * fromStoryProgress(clamped),
          behavior: reducedMotionRef.current ? 'auto' : 'smooth',
        })
        return
      }
      // 时间轴跳转时回到 100% 缩放，保证目标时段完整入画
      state.zoom = 1
      measure()
      animateTo(state.max * clamped)
    }

    apiRef.current = { goTo, getProgress: () => progressRef.current }

    if (isVertical()) {
      scene.addEventListener('scroll', onScroll, { passive: true })
      // 从桌面模式切过来时，恢复到相同的漫游进度
      requestAnimationFrame(() => {
        const max = Math.max(0, scene.scrollHeight - scene.clientHeight)
        if (progressRef.current > 0 && max > 0) {
          scene.scrollTop = fromStoryProgress(progressRef.current) * max
        }
        readScroll()
      })
      window.addEventListener('resize', onResize)
      return () => {
        scene.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        if (raf) cancelAnimationFrame(raf)
        cancelInertia()
        apiRef.current = null
      }
    }

    // 桌面模式
    scene.addEventListener('pointerdown', onPointerDown)
    scene.addEventListener('pointermove', onPointerMove)
    scene.addEventListener('pointerup', endDrag)
    scene.addEventListener('pointercancel', endDrag)
    scene.addEventListener('click', onClickCapture, true)
    scene.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    const observer = new ResizeObserver(onResize)
    observer.observe(scene)
    observer.observe(world)

    requestAnimationFrame(() => {
      measure()
      state.pos = progressRef.current * state.max
      applyDesktop()
    })

    return () => {
      scene.removeEventListener('pointerdown', onPointerDown)
      scene.removeEventListener('pointermove', onPointerMove)
      scene.removeEventListener('pointerup', endDrag)
      scene.removeEventListener('pointercancel', endDrag)
      scene.removeEventListener('click', onClickCapture, true)
      scene.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      cancelAnimation()
      scene.classList.remove('is-dragging')
      apiRef.current = null
    }
  }, [enabled, sceneRef, worldRef, emit, vertical])

  const goTo = useCallback((progress: number) => {
    apiRef.current?.goTo(progress)
  }, [])

  return {
    goTo,
    getProgress: () => progressRef.current,
  }
}
