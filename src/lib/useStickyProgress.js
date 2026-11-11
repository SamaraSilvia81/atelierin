import { useEffect, useState } from 'react'

// Progresso (0 a 1) de um contêiner alto com conteúdo "sticky" dentro:
// 0 quando o topo encosta no topo da tela, 1 quando a base encosta na base.
// Escreve --p no elemento (para o trilho que se preenche) e devolve o passo
// ativo. Mesmo esquema da pipeline da Check.AI, com correção para o zoom
// de 80% do desktop. Com "reduzir movimento", tudo fica aberto (reduced).
export function useStickyProgress(ref, steps) {
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      // gBCR pode vir em px "de tela" ou em px do CSS (depende do navegador com zoom)
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
      const visual = Math.abs(rect.width / el.offsetWidth - zoom) < 0.05
      const vh = visual ? window.innerHeight : window.innerHeight / zoom
      const p = media.matches ? 1 : Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - vh)))
      el.style.setProperty('--p', p.toFixed(4))
      setActive(Math.min(steps - 1, Math.floor(p * steps)))
      setReduced(media.matches)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    media.addEventListener('change', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      media.removeEventListener('change', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref, steps])

  return { active, reduced }
}
