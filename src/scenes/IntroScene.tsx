import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { MatchStick } from '@/components/MatchStick'
import { Skyline } from '@/components/Skyline'
import { StallRow } from '@/components/StallRow'
import { Stove } from '@/components/Stove'
import { useGameStore } from '@/stores/game'

/**
 * 序章：拖火柴点燃炉火，然后走进街里。
 * 保持原有视觉与交互，只把「再点一次」换成「走进街里」。
 */
export function IntroScene() {
  const introLit = useGameStore((state) => state.introLit)
  const ignite = useGameStore((state) => state.ignite)
  const enterStreet = useGameStore((state) => state.enterStreet)
  const stoveRef = useRef<HTMLButtonElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <main className={`scene${introLit ? ' is-lit' : ''}${dragging ? ' is-dragging' : ''}`}>
      <div className="scene__sky" aria-hidden="true" />
      <div className="scene__sun" aria-hidden="true" />
      <Skyline />
      <div className="scene__street" aria-hidden="true" />
      <div className="scene__haze" aria-hidden="true" />
      <StallRow />

      <header className="topbar">
        <div className="brand">
          <span className="brand__seal" aria-hidden="true">
            市
          </span>
          <span className="brand__name">市井烟火</span>
          <span className="brand__tag">过早江湖</span>
        </div>

        <div className="topbar__meta">
          <span className="topbar__place">武汉 · 珞珈山下</span>
          <span className="topbar__rule" aria-hidden="true" />
          <time className="topbar__time" dateTime="06:47">
            {introLit ? '06:52' : '06:47'}
          </time>
        </div>
      </header>

      <aside className="side-note" aria-hidden="true">
        <span>市井烟火</span>
        <i />
        <span>百味人间</span>
      </aside>

      <div className="hero-layer">
        <AnimatePresence mode="wait">
          {introLit ? (
            <motion.section
              key="awake"
              className="hero hero--awake"
              aria-label="炉火已经点燃"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <p className="eyebrow">
                <span className="eyebrow__line" />
                06:52 · 炉火已亮
              </p>
              <h1 className="hero__title hero__title--small">这条街，醒了。</h1>
              <p className="hero__tagline">
                陈记的水刚开，周姐翻起第一张豆皮，婆婆推着豆浆桶从街口过来。
              </p>
              <div className="hero__foot">
                <span>序章完成 · 沿街八段故事</span>
                <button type="button" className="text-button" onClick={enterStreet}>
                  走进街里
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="intro"
              className="hero"
              aria-label="市井烟火开场"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p className="eyebrow">
                <span className="eyebrow__line" />
                武汉老街 · 交互叙事
              </p>
              <h1 className="hero__title hero__title--stacked">
                <span>市井烟火</span>
                <span>百味人间</span>
              </h1>
              <p className="hero__tagline">六点四十七分，这条街先于城市醒来。</p>
              <p className="hero__hint">
                <span className="hero__pulse" aria-hidden="true" />
                拖一根火柴，点燃今天的炉火
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <div className="stove-zone">
        <p className={`stove-hint${introLit ? ' stove-hint--lit' : ''}`} aria-hidden={introLit}>
          {introLit ? '炉火正旺' : dragging ? '松手，点燃它' : '把火柴拖到炉口'}
        </p>
        <Stove lit={introLit} dragging={dragging} stoveRef={stoveRef} onIgnite={ignite} />
      </div>

      <AnimatePresence>
        {!introLit && (
          <MatchStick
            key="match"
            stoveRef={stoveRef}
            onIgnite={ignite}
            onDraggingChange={setDragging}
          />
        )}
      </AnimatePresence>

      <div className="scene__vignette" aria-hidden="true" />
      <div className="scene__grain" aria-hidden="true" />
    </main>
  )
}
