import { getHotspotsByZone } from '@/content/hotspots'
import { Stall } from '@/components/Stall'

/** 序章里并排的三家早点摊（纯装饰，不可交互） */
export function StallRow() {
  return (
    <div className="stall-row" aria-hidden="true">
      {getHotspotsByZone('dawn').map((hotspot) => (
        <Stall
          key={hotspot.id}
          theme={hotspot.theme}
          seal={hotspot.fragment.seal}
          shopName={hotspot.name}
        />
      ))}
    </div>
  )
}
