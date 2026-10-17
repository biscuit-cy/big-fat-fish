interface StallProps {
  theme: string
  seal: string
  shopName: string
}

/**
 * 纯 CSS 摊位插画，原有样式保持不变。
 * 用 span 而不是 div，方便整个摊位放进 <button> 热点里。
 */
export function Stall({ theme, seal, shopName }: StallProps) {
  return (
    <span className={`stall stall--${theme}`}>
      <span className="stall__steam">
        <span />
        <span />
        <span />
      </span>

      <span className="stall__sign">
        <span className="stall__seal">{seal}</span>
        <span>{shopName}</span>
      </span>

      <span className="stall__awning" />

      <span className="stall__body">
        <span className="stall__bulbs">
          <i />
          <i />
          <i />
        </span>
        <span className="stall__window" />
        <span className="stall__glow" />
        <span className="stall__counter" />
        <span className="stall__legs">
          <i />
          <i />
        </span>
      </span>
    </span>
  )
}
