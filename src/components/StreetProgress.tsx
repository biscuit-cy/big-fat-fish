import type { RefObject } from 'react'
import type { ZoneId } from '@/content/hotspots'
import { ZONES } from '@/content/zones'

interface StreetProgressProps {
  zone: ZoneId
  cursorRef: RefObject<HTMLSpanElement | null>
  onJump: (progress: number) => void
}

/**
 * 底部时间轴：显示当前漫游进度，点击任一时段可直接走过去。
 * 游标位置由相机逐帧直写，不经过 React。
 */
export function StreetProgress({ zone, cursorRef, onJump }: StreetProgressProps) {
  return (
    <nav className="street-progress" aria-label="街道时间轴" data-no-drag>
      <div className="street-progress__track">
        <span className="street-progress__line" aria-hidden="true" />
        <span ref={cursorRef} className="street-progress__cursor" aria-hidden="true">
          <i />
        </span>

        {ZONES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`street-progress__stop${zone === item.id ? ' is-active' : ''}`}
            style={{ left: `${item.start * 100}%` }}
            onClick={() => onJump(item.start + 0.015)}
            aria-label={`走到${item.name}，${item.timeRange}`}
            aria-current={zone === item.id ? 'true' : undefined}
          >
            <span className="street-progress__dot" aria-hidden="true" />
            <span className="street-progress__name">{item.name}</span>
            <span className="street-progress__time">{item.timeRange}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
