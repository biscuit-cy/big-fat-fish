import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { ZoneId } from '@/content/hotspots'

interface Particle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  alpha: number
  phase: number
}

interface ParticleStyle {
  color: [number, number, number]
  vx: number
  vy: number
  radius: [number, number]
  alpha: [number, number]
  ember: boolean
}

const STYLES: Record<ZoneId, ParticleStyle> = {
  dawn: {
    color: [226, 214, 190],
    vx: 0.05,
    vy: -0.1,
    radius: [0.5, 1.6],
    alpha: [0.12, 0.34],
    ember: false,
  },
  afternoon: {
    color: [255, 226, 170],
    vx: 0.16,
    vy: 0.05,
    radius: [0.6, 1.8],
    alpha: [0.1, 0.3],
    ember: false,
  },
  night: {
    color: [255, 142, 64],
    vx: 0.04,
    vy: -0.34,
    radius: [0.8, 2.2],
    alpha: [0.2, 0.62],
    ember: true,
  },
}

/**
 * Canvas 氛围粒子：
 * 清晨雾粒向上飘，午后浮尘斜着走，夜里从右下方的烤摊升起火星。
 * 尊重 reduced-motion，移动端与低核心数设备自动减量。
 */
export function ParticlesCanvas({ zone, enabled }: { zone: ZoneId; enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!enabled || reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas || typeof canvas.getContext !== 'function') return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const style = STYLES[zone]
    let width = 0
    let height = 0
    let dpr = 1
    let particles: Particle[] = []
    let raf = 0
    let running = true

    const createParticle = (initial: boolean): Particle => {
      const radius = style.radius[0] + Math.random() * (style.radius[1] - style.radius[0])
      const alpha = style.alpha[0] + Math.random() * (style.alpha[1] - style.alpha[0])
      let x = Math.random() * width
      let y = Math.random() * height
      if (zone === 'night') x = width * (0.42 + Math.random() * 0.58)
      if (initial) y = Math.random() * height
      return {
        x,
        y,
        radius,
        vx: style.vx + (Math.random() - 0.5) * 0.08,
        vy: style.vy + (Math.random() - 0.5) * 0.04,
        alpha,
        phase: Math.random() * Math.PI * 2,
      }
    }

    const count = () => {
      if (typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches)
        return 24
      const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency ?? 8) : 8
      return cores <= 4 ? 34 : 60
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: count() }, () => createParticle(true))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = style.ember ? 'lighter' : 'source-over'
      for (const particle of particles) {
        particle.phase += 0.01
        particle.x += particle.vx + Math.sin(particle.phase) * 0.06
        particle.y += particle.vy

        if (zone === 'afternoon') {
          if (particle.x > width + 10) particle.x = -10
          if (particle.x < -10) particle.x = width + 10
        } else {
          if (particle.y < -10) {
            particle.y = height + 10
            particle.x =
              zone === 'night' ? width * (0.42 + Math.random() * 0.58) : Math.random() * width
          }
        }
        if (particle.y > height + 10) particle.y = -10

        const [r, g, b] = style.color
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha})`
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      if (running) raf = requestAnimationFrame(draw)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [enabled, reducedMotion, zone])

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />
}
