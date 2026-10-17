import { useEffect } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * 把键盘焦点限制在弹层内，关闭时还给打开它的元素。
 * 同时处理 Tab / Shift+Tab 的循环。
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const previous = document.activeElement as HTMLElement | null
    const getFocusable = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      )

    const first = getFocusable()[0]
    ;(first ?? node).focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const index = items.indexOf(document.activeElement as HTMLElement)
      const next = event.shiftKey
        ? items[index <= 0 ? items.length - 1 : index - 1]
        : items[index === items.length - 1 || index < 0 ? 0 : index + 1]
      event.preventDefault()
      next.focus()
    }

    node.addEventListener('keydown', handleKeyDown)
    return () => {
      node.removeEventListener('keydown', handleKeyDown)
      previous?.focus?.({ preventScroll: true })
    }
  }, [ref, active])
}
