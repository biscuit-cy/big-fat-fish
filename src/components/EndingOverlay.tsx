import { useEffect, useRef } from 'react'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useGameStore } from '@/stores/game'

/** 集齐八枚碎片后的片尾：全街灯火，时间停在 23:30 */
export function EndingOverlay() {
  const dismissEnding = useGameStore((state) => state.dismissEnding)
  const resetAll = useGameStore((state) => state.resetAll)
  const openPanel = useGameStore((state) => state.openPanel)
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissEnding()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dismissEnding])

  return (
    <div
      className="ending"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ending-title"
      ref={dialogRef}
    >
      <div className="ending__inner">
        <p className="ending__eyebrow">
          <span className="eyebrow__line" />
          23:30 · 全街灯火
        </p>
        <h2 id="ending-title" className="ending__title">
          这条街睡了。
          <br />
          明天六点四十七分，
          <br />
          它还会醒。
        </h2>
        <p className="ending__text">
          你收齐了八枚烟火碎片。它们不是景点，是这条街上八个人普通的一天。
          灯一盏盏灭下去，味道还留在街口。
        </p>
        <div className="ending__actions">
          <button
            type="button"
            className="ending__primary"
            onClick={() => {
              dismissEnding()
              openPanel('wall')
            }}
          >
            去留言墙写一句
          </button>
          <button type="button" className="text-button" onClick={dismissEnding}>
            继续走走
          </button>
          <button type="button" className="text-button" onClick={resetAll}>
            再走一遍
          </button>
        </div>
      </div>
    </div>
  )
}
