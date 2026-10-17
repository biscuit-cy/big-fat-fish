import { motion } from 'framer-motion'
import { useRef } from 'react'
import type { KeyboardEvent, RefObject } from 'react'

interface MatchStickProps {
  stoveRef: RefObject<HTMLButtonElement | null>
  onIgnite: () => void
  onDraggingChange: (dragging: boolean) => void
}

export function MatchStick({ stoveRef, onIgnite, onDraggingChange }: MatchStickProps) {
  const matchRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = () => {
    onDraggingChange(false)

    const matchRect = matchRef.current?.getBoundingClientRect()
    const stoveRect = stoveRef.current?.getBoundingClientRect()
    if (!matchRect || !stoveRect) return

    const margin = 26
    const droppedOnStove =
      matchRect.right >= stoveRect.left - margin &&
      matchRect.left <= stoveRect.right + margin &&
      matchRect.bottom >= stoveRect.top - margin &&
      matchRect.top <= stoveRect.bottom + margin

    if (droppedOnStove) onIgnite()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onIgnite()
    }
  }

  return (
    <motion.div
      ref={matchRef}
      className="match"
      drag
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={{ scale: 1.06, rotate: -8 }}
      onDragStart={() => onDraggingChange(true)}
      onDragEnd={handleDragEnd}
      onTap={onIgnite}
      role="button"
      tabIndex={0}
      aria-label="拖动火柴到炉口点燃炉火，也可以按回车或直接点击点火"
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
      transition={{ delay: 0.55, duration: 0.8, ease: 'easeOut' }}
    >
      <svg className="match__stick" viewBox="0 0 40 120" aria-hidden="true">
        <rect x="17" y="24" width="6" height="92" rx="3" fill="#c7a87d" />
        <path d="M17 26h6l-1 19h-4z" fill="#f4ecde" opacity=".2" />
        <path d="M14 18c0-6 3-13 6-16 3 3 6 10 6 16 0 4-2.7 7-6 7s-6-3-6-7Z" fill="#c9502e" />
        <circle cx="20" cy="16" r="4" fill="#f0b47b" opacity=".45" />
      </svg>
      <span className="match__label">
        <span className="match__arrow" aria-hidden="true" />
        拖我点火
      </span>
    </motion.div>
  )
}
