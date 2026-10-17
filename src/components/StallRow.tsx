import { STALLS } from '@/content/stalls'

export function StallRow() {
  return (
    <div className="stall-row" aria-hidden="true">
      {STALLS.map((stall) => (
        <article key={stall.id} className={`stall stall--${stall.id}`}>
          <div className="stall__steam">
            <span />
            <span />
            <span />
          </div>

          <div className="stall__sign">
            <span className="stall__seal">{stall.seal}</span>
            <span>{stall.shopName}</span>
          </div>

          <div className="stall__awning" />

          <div className="stall__body">
            <div className="stall__bulbs">
              <i />
              <i />
              <i />
            </div>
            <div className="stall__window" />
            <div className="stall__glow" />
            <div className="stall__counter" />
            <div className="stall__legs">
              <i />
              <i />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
