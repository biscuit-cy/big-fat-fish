import type { RefObject } from 'react'

interface StoveProps {
  lit: boolean
  dragging: boolean
  stoveRef: RefObject<HTMLButtonElement | null>
  onIgnite: () => void
}

export function Stove({ lit, dragging, stoveRef, onIgnite }: StoveProps) {
  return (
    <button
      type="button"
      ref={stoveRef}
      className={`stove ${dragging ? 'is-target' : ''}`}
      onClick={onIgnite}
      disabled={lit}
      aria-label={lit ? '炉火已经点燃' : '点燃炉火'}
    >
      <span className="stove__halo" aria-hidden="true" />

      <span className="stove__pot" aria-hidden="true">
        <span className="stove__lid" />
        {lit && (
          <span className="stove__pot-steam">
            <i />
            <i />
            <i />
          </span>
        )}
      </span>

      <span className="stove__body" aria-hidden="true">
        {lit && (
          <span className="stove__flames">
            <i className="flame flame--one" />
            <i className="flame flame--two" />
            <i className="flame flame--three" />
          </span>
        )}
        <span className="stove__door" />
        <span className="stove__grate" />
      </span>

      <span className="stove__legs" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}
