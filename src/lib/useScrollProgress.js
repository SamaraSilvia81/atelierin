import { useEffect, useRef, useState } from 'react'

// Progresso (0 a 1) de um elemento atravessando a tela: 0 quando o topo
// entra por baixo, 1 quando o centro do elemento chega um pouco abaixo do meio da tela. Com "reduzir
// movimento", devolve 1 direto.
export function useScrollProgress() {
  const ref = useRef(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setP(1); return }
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current; if (!el) return
      const r = el.getBoundingClientRect(); const vh = window.innerHeight
      const start = vh * 0.88, end = vh * 0.6 - r.height * 0.5
      setP(Math.min(1, Math.max(0, (start - r.top) / (start - end))))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return [ref, p]
}
