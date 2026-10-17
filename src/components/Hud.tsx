import { useState } from 'react'
import type { RefObject } from 'react'
import { TOTAL_HOTSPOTS } from '@/content/hotspots'
import { ZONES } from '@/content/zones'
import { Modal } from '@/components/Modal'
import { useGameStore } from '@/stores/game'

interface HudProps {
  timeRef: RefObject<HTMLTimeElement | null>
}

export function Hud({ timeRef }: HudProps) {
  const collected = useGameStore((state) => state.collected)
  const muted = useGameStore((state) => state.muted)
  const zone = useGameStore((state) => state.zone)
  const toggleMuted = useGameStore((state) => state.toggleMuted)
  const openPanel = useGameStore((state) => state.openPanel)
  const resetAll = useGameStore((state) => state.resetAll)
  const [confirming, setConfirming] = useState(false)

  const zoneName = ZONES.find((item) => item.id === zone)?.name ?? '老街'

  return (
    <>
      <header className="hud" data-no-drag>
        <div className="hud__brand">
          <span className="hud__seal" aria-hidden="true">
            市
          </span>
          <span className="hud__name">市井烟火</span>
          <span className="hud__tag">百味人间</span>
        </div>

        <div className="hud__meta">
          <span className="hud__zone">{zoneName}</span>
          <span className="hud__rule" aria-hidden="true" />
          <time ref={timeRef} className="hud__time" dateTime="06:47">
            06:47
          </time>
        </div>

        <nav className="hud__actions" aria-label="街道工具">
          <button
            type="button"
            className="hud__btn"
            onClick={() => openPanel('fragments')}
            aria-label={`烟火碎片，已收集 ${collected.length} 枚，共 ${TOTAL_HOTSPOTS} 枚`}
          >
            碎片{' '}
            <b>
              {collected.length}/{TOTAL_HOTSPOTS}
            </b>
          </button>
          <button type="button" className="hud__btn" onClick={() => openPanel('wall')}>
            留言墙
          </button>
          <button
            type="button"
            className="hud__btn"
            onClick={toggleMuted}
            aria-pressed={!muted}
            title="环境音素材接入后生效"
          >
            音效{muted ? '关' : '开'}
          </button>
          <button
            type="button"
            className="hud__btn hud__btn--ghost"
            onClick={() => setConfirming(true)}
          >
            重置
          </button>
        </nav>
      </header>

      {confirming && (
        <Modal labelId="reset-title" onClose={() => setConfirming(false)} className="confirm">
          <h2 id="reset-title" className="confirm__title">
            重新走一遍？
          </h2>
          <p className="confirm__text">
            收集进度会清空，留言墙与音效设置会保留。炉火也要重新点燃。
          </p>
          <div className="confirm__actions">
            <button type="button" className="text-button" onClick={() => setConfirming(false)}>
              取消
            </button>
            <button
              type="button"
              className="confirm__danger"
              onClick={() => {
                setConfirming(false)
                resetAll()
              }}
            >
              重新开始
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
