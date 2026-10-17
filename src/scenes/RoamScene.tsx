import { useCallback, useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { getHotspotsByZone } from '@/content/hotspots'
import type { ZoneId } from '@/content/hotspots'
import { applyLighting, ZONES } from '@/content/zones'
import { EndingOverlay } from '@/components/EndingOverlay'
import { FragmentPanel } from '@/components/FragmentPanel'
import { Hotspot } from '@/components/Hotspot'
import { Hud } from '@/components/Hud'
import { MessageWall } from '@/components/MessageWall'
import { ParticlesCanvas } from '@/components/ParticlesCanvas'
import { Skyline } from '@/components/Skyline'
import { StoryCard } from '@/components/StoryCard'
import { StreetProgress } from '@/components/StreetProgress'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useStreetCamera } from '@/hooks/useStreetCamera'
import { createAmbienceController } from '@/lib/ambience'
import type { AmbienceController } from '@/lib/ambience'
import { useGameStore } from '@/stores/game'

/**
 * 老街漫游场景。
 * 三段时间共用一条 300vw 的世界轨道；相机进度同时驱动时间、
 * 光影、环境音分区与粒子样式。
 */
export function RoamScene() {
  const sceneRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLTimeElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const zoneRef = useRef<ZoneId>('dawn')
  const ambienceRef = useRef<AmbienceController | null>(null)

  const reducedMotion = useReducedMotion() ?? false
  const vertical = useMediaQuery('(max-width: 820px)')

  const phase = useGameStore((state) => state.phase)
  const zone = useGameStore((state) => state.zone)
  const collected = useGameStore((state) => state.collected)
  const muted = useGameStore((state) => state.muted)
  const activeHotspotId = useGameStore((state) => state.activeHotspotId)
  const panel = useGameStore((state) => state.panel)
  const setZone = useGameStore((state) => state.setZone)
  const openHotspot = useGameStore((state) => state.openHotspot)

  const handleProgress = useCallback(
    (progress: number) => {
      const scene = sceneRef.current
      if (!scene) return
      const state = applyLighting(scene, progress)
      if (timeRef.current) {
        timeRef.current.textContent = state.time
        timeRef.current.dateTime = state.time
      }
      if (cursorRef.current) {
        cursorRef.current.style.left = `${(progress * 100).toFixed(2)}%`
      }
      if (zoneRef.current !== state.zone.id) {
        zoneRef.current = state.zone.id
        setZone(state.zone.id)
      }
    },
    [setZone],
  )

  const { goTo } = useStreetCamera({
    sceneRef,
    worldRef,
    enabled: true,
    reducedMotion,
    onProgress: handleProgress,
  })

  // 环境音系统（当前为静音空实现，素材接入后自动生效）
  useEffect(() => {
    const controller = createAmbienceController()
    ambienceRef.current = controller
    controller.init()
    return () => {
      controller.dispose()
      ambienceRef.current = null
    }
  }, [])

  useEffect(() => {
    ambienceRef.current?.setZone(zone)
  }, [zone])

  useEffect(() => {
    ambienceRef.current?.setMuted(muted)
  }, [muted])

  // 片尾时把镜头推到街尾，让时间停在 23:30
  useEffect(() => {
    if (phase === 'ending') goTo(1)
  }, [phase, goTo])

  return (
    <main
      ref={sceneRef}
      className={`scene scene--roam is-lit${vertical ? ' is-vertical' : ''}${
        reducedMotion ? ' is-reduced' : ''
      }`}
      data-zone={zone}
      aria-label="市井烟火老街"
    >
      <div className="scene__sky" aria-hidden="true" />
      <div className="scene__sun" aria-hidden="true" />
      <Skyline />
      <div className="scene__street" aria-hidden="true" />
      <div className="scene__haze" aria-hidden="true" />
      <div className="scene__tint" aria-hidden="true" />

      <ParticlesCanvas zone={zone} enabled={!reducedMotion} />

      <div className="world" ref={worldRef}>
        {ZONES.map((meta, index) => (
          <section key={meta.id} className={`zone zone--${meta.id}`} aria-label={meta.name}>
            <div className="zone__head" aria-hidden="true">
              <span className="zone__index">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="zone__name">{meta.name}</h2>
              <p className="zone__sub">{meta.sub}</p>
              <span className="zone__time">{meta.timeRange}</span>
            </div>
            <span className="zone__glow" aria-hidden="true" />

            {getHotspotsByZone(meta.id).map((hotspot) => (
              <Hotspot
                key={hotspot.id}
                hotspot={hotspot}
                collected={collected.includes(hotspot.id)}
                onOpen={openHotspot}
                style={{ left: `${hotspot.x}%`, bottom: `${hotspot.y}%` }}
              />
            ))}
          </section>
        ))}
      </div>

      <p className="roam-hint" aria-hidden="true">
        <span className="roam-hint__desktop">拖动街道 · 滚轮缩放 · ← → 行走</span>
        <span className="roam-hint__mobile">上下滑动 · 点亮沿街故事</span>
      </p>

      <Hud timeRef={timeRef} />
      <StreetProgress zone={zone} cursorRef={cursorRef} onJump={goTo} />

      {activeHotspotId && <StoryCard key={activeHotspotId} />}
      {panel === 'fragments' && <FragmentPanel />}
      {panel === 'wall' && <MessageWall />}
      {phase === 'ending' && <EndingOverlay />}

      <div className="scene__vignette" aria-hidden="true" />
      <div className="scene__grain" aria-hidden="true" />
    </main>
  )
}
