/** 檐下打盹的猫：内联 SVG，方便改色与做夜灯轮廓光 */
export function Cat() {
  return (
    <span className="cat">
      <svg viewBox="0 0 180 110" aria-hidden="true">
        <path
          className="cat__tail"
          d="M138 84c14 2 23-5 24-17 1-7-5-12-11-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <ellipse className="cat__body" cx="94" cy="80" rx="46" ry="20" />
        <circle className="cat__head" cx="57" cy="68" r="19" />
        <path className="cat__ear" d="M43 55l-4-14 13 7Z" />
        <path className="cat__ear" d="M66 53l8-13 5 12Z" />
        <path className="cat__stripe" d="M70 77c7 2 13 1 17-2" />
        <path className="cat__stripe" d="M84 84c8 2 14 1 18-2" />
        <path className="cat__eye" d="M49 68c2 2 5 2 7 0" />
        <path className="cat__eye" d="M62 67c2 2 5 2 7 0" />
        <path className="cat__nose" d="M58 73l3 2-3 2" />
        <text className="cat__z" x="72" y="40">
          z
        </text>
        <text className="cat__z cat__z--two" x="85" y="30">
          z
        </text>
      </svg>
    </span>
  )
}
