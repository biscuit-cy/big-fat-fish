import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface ModalProps {
  labelId: string
  onClose: () => void
  children: ReactNode
  variant?: 'center' | 'drawer'
  className?: string
}

/**
 * 统一的弹层：遮罩、Esc 关闭、焦点陷阱、锁定页面滚动。
 * 通过 portal 渲染到 body，避免被场景的 transform / overflow 裁切。
 */
export function Modal({
  labelId,
  onClose,
  children,
  variant = 'center',
  className = '',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap(dialogRef)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      className={`modal-backdrop modal-backdrop--${variant}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={`modal modal--${variant} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
