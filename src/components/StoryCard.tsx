import { useEffect, useState } from 'react'
import { getHotspot } from '@/content/hotspots'
import type { Hotspot } from '@/content/hotspots'
import { ZONES } from '@/content/zones'
import { Modal } from '@/components/Modal'
import { useGameStore } from '@/stores/game'

/** 从 store 取出当前打开的热点，再交给内部组件处理 */
export function StoryCard() {
  const activeId = useGameStore((state) => state.activeHotspotId)
  const hotspot = activeId ? getHotspot(activeId) : undefined
  if (!hotspot) return null
  return <StoryCardBody key={hotspot.id} hotspot={hotspot} />
}

function StoryCardBody({ hotspot }: { hotspot: Hotspot }) {
  const collected = useGameStore((state) => state.collected)
  const collect = useGameStore((state) => state.collect)
  const closeHotspot = useGameStore((state) => state.closeHotspot)
  const [isNew] = useState(() => !collected.includes(hotspot.id))

  useEffect(() => {
    if (isNew) collect(hotspot.id)
  }, [isNew, collect, hotspot.id])

  const zone = ZONES.find((item) => item.id === hotspot.zone)

  return (
    <Modal labelId="story-title" onClose={closeHotspot} className="story-card">
      <div className="story-card__head">
        <p className="story-card__eyebrow">
          {zone?.name ?? ''} · {hotspot.time}
        </p>
        <button
          type="button"
          className="story-card__close"
          onClick={closeHotspot}
          aria-label="回到街上"
        >
          返回街道
        </button>
      </div>

      <h2 id="story-title" className="story-card__title">
        {hotspot.name}
      </h2>
      <p className="story-card__intro">{hotspot.intro}</p>

      <div className="story-card__story">
        {hotspot.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="story-card__fragment" role="status" aria-live="polite">
        <span className={`story-card__seal${isNew ? ' is-new' : ''}`} aria-hidden="true">
          {hotspot.fragment.seal}
        </span>
        <div className="story-card__fragment-text">
          <p className="story-card__fragment-label">
            {isNew ? '收下一枚烟火碎片' : '这枚碎片你已收下'}
          </p>
          <p className="story-card__fragment-name">{hotspot.fragment.name}</p>
          <p className="story-card__fragment-quote">“{hotspot.fragment.quote}”</p>
        </div>
      </div>

      <div className="story-card__foot">
        <button type="button" className="text-button" onClick={closeHotspot}>
          回到街上
        </button>
      </div>
    </Modal>
  )
}
