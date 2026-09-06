import { useEffect, useRef } from 'react'

export function useProtectedContent() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const isFormTarget = (t) =>
      t instanceof HTMLElement &&
      (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)

    const stop = (e) => e.preventDefault()

    const onCopy = (e) => {
      if (!isFormTarget(e.target)) e.preventDefault()
    }

    const onKeyDown = (e) => {
      if (isFormTarget(e.target)) return
      const key = e.key.toLowerCase()
      const mod = e.ctrlKey || e.metaKey
      if (mod && ['c', 'u', 's', 'p'].includes(key)) {
        e.preventDefault()
      }
    }

    el.addEventListener('contextmenu', stop)
    el.addEventListener('copy', onCopy)
    el.addEventListener('cut', onCopy)
    el.addEventListener('dragstart', stop)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      el.removeEventListener('contextmenu', stop)
      el.removeEventListener('copy', onCopy)
      el.removeEventListener('cut', onCopy)
      el.removeEventListener('dragstart', stop)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return ref
}
