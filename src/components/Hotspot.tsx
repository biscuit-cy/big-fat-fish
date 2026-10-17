import type { CSSProperties } from 'react'
import type { Hotspot as HotspotData } from '@/content/hotspots'
import { Cat } from '@/components/props/Cat'
import { Poster } from '@/components/props/Poster'
import { Stall } from '@/components/Stall'

interface HotspotProps {
  hotspot: HotspotData
  collected: boolean
  onOpen: (id: string) => void
  style?: CSSProperties
}

/**
 * 可交互热点。按 art 类型渲染不同插画，整体是一个原生按钮，
 * 键盘可直接 Tab 聚焦、回车打开故事卡。
 */
export function Hotspot({ hotspot, collected, onOpen, style }: HotspotProps) {
  return (
    <button
      type="button"
      className={`hotspot hotspot--${hotspot.art} hotspot--${hotspot.theme}${
        collected ? ' is-collected' : ''
      }`}
      style={style}
      onClick={() => onOpen(hotspot.id)}
      aria-label={`${hotspot.name}，${collected ? '已收集碎片，再看一次故事' : '查看故事并收集碎片'}`}
    >
      <span className="hotspot__art" aria-hidden="true">
        {hotspot.art === 'stall' && (
          <Stall theme={hotspot.theme} seal={hotspot.fragment.seal} shopName={hotspot.name} />
        )}
        {hotspot.art === 'cat' && <Cat />}
        {hotspot.art === 'poster' && <Poster />}
      </span>

      <span className="hotspot__label">
        <span className="hotspot__name">{hotspot.name}</span>
        <span className="hotspot__time">{hotspot.time}</span>
      </span>

      {collected && (
        <span className="hotspot__stamp" aria-hidden="true">
          已收
        </span>
      )}
    </button>
  )
}
