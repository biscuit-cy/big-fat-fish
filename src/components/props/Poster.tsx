/** 褪色的楚剧团旧海报 */
export function Poster() {
  return (
    <span className="poster">
      <span className="poster__paper">
        <span className="poster__top">楚剧团</span>
        <span className="poster__main">柜中缘</span>
        <span className="poster__year">1987 · 最后一场</span>
        <span className="poster__note">等你回来，老位置</span>
        <span className="poster__tear poster__tear--one" aria-hidden="true" />
        <span className="poster__tear poster__tear--two" aria-hidden="true" />
      </span>
    </span>
  )
}
