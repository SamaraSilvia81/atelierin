import { useEffect } from 'react'

// Efeito "a tela vai embora" (como no site do Miro): conforme a base da seção
// sobe na tela, escreve --exit (0 a 1) no elemento. O CSS usa esse valor para
// encolher a seção e arredondar os cantos, revelando a cor de baixo.
// Com "reduzir movimento", não faz nada.
export function useExitProgress(ref) {
  useEffect(() => {
    // o efeito vai na seção dentro do invólucro (o primeiro filho)
    const el = ref.current?.firstElementChild
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
      const visual = Math.abs(r.width / el.offsetWidth - zoom) < 0.05
      const vh = visual ? window.innerHeight : window.innerHeight / zoom
      // 0 quando a base da seção está no pé da tela, 1 quando chega a 35% da altura
      const p = Math.min(1, Math.max(0, (vh - r.bottom) / (vh * 0.65)))
      el.style.setProperty('--exit', p.toFixed(4))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}
