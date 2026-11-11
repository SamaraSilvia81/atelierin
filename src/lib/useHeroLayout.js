import { useEffect, useRef, useState, useCallback } from 'react'

// "Modo Figma" do hero.
// Como abrir: em `npm run dev` aparece o botão "Editar layout" no canto da
// tela (ou abra a página com ?editar no endereço, que funciona até no build).
//   - arraste os blocos (grudam no centro; segure Alt para soltar livre)
//   - clique num bloco para selecionar; setas movem (Shift = passo maior)
//   - + e - aumentam e diminuem o bloco selecionado; 0 volta ao tamanho normal
//   - "Copiar layout" copia o JSON para colar em content.json > hero.layout
// As posições ficam salvas neste navegador enquanto você edita.
const KEY = 'atelierin:hero-layout'
const SNAP = 1.2 // em %, distância para "grudar" no centro

const fromUrl = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('editar')

const clean = (l) =>
  Object.fromEntries(Object.entries(l).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, { s: 1, ...v }]))

const round = (n) => Math.round(n * 10) / 10

export function useHeroLayout(base) {
  const [editing, setEditing] = useState(fromUrl)
  const [selected, setSelected] = useState(null)
  const [layout, setLayout] = useState(() => {
    if (!fromUrl()) return clean(base)
    try { return { ...clean(base), ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return clean(base) }
  })
  const screenRef = useRef(null)
  const drag = useRef(null)

  const toggle = () => {
    setEditing((on) => {
      if (!on) {
        try { setLayout({ ...clean(base), ...JSON.parse(localStorage.getItem(KEY) || '{}') }) } catch { /* */ }
      } else setSelected(null)
      return !on
    })
  }

  useEffect(() => {
    if (!editing) return
    try { localStorage.setItem(KEY, JSON.stringify(layout)) } catch { /* sem storage */ }
  }, [layout, editing])

  const update = (id, fn) => setLayout((l) => ({ ...l, [id]: { ...l[id], ...fn(l[id]) } }))

  // teclado: setas movem, + / - escalam, Esc solta a seleção
  useEffect(() => {
    if (!editing || !selected) return
    const onKey = (e) => {
      const step = e.shiftKey ? 2 : 0.5
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
      if (moves[e.key]) {
        e.preventDefault()
        const [dx, dy] = moves[e.key]
        update(selected, (v) => ({ x: round(v.x + dx), y: round(v.y + dy) }))
      } else if (e.key === '+' || e.key === '=') {
        update(selected, (v) => ({ s: Math.min(3, round((v.s + 0.05) * 100) / 100) }))
      } else if (e.key === '-' || e.key === '_') {
        update(selected, (v) => ({ s: Math.max(0.3, round((v.s - 0.05) * 100) / 100) }))
      } else if (e.key === '0') {
        update(selected, () => ({ s: 1 }))
      } else if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editing, selected])

  const onPointerDown = useCallback((id) => (e) => {
    e.preventDefault()
    setSelected(id)
    const rect = screenRef.current.getBoundingClientRect()
    drag.current = { id, rect, sx: e.clientX, sy: e.clientY, x: layout[id].x, y: layout[id].y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [layout])

  const onPointerMove = useCallback((e) => {
    const d = drag.current
    if (!d) return
    let x = d.x + ((e.clientX - d.sx) / d.rect.width) * 100
    const y = d.y + ((e.clientY - d.sy) / d.rect.height) * 100
    if (Math.abs(x - 50) < SNAP && !e.altKey) x = 50
    update(d.id, () => ({ x: round(x), y: round(y) }))
  }, [])

  const onPointerUp = useCallback(() => { drag.current = null }, [])

  const bind = (id) => editing
    ? { onPointerDown: onPointerDown(id), onPointerMove, onPointerUp, onPointerCancel: onPointerUp, 'data-selected': selected === id || undefined }
    : {}

  const reset = () => { try { localStorage.removeItem(KEY) } catch { /* */ } setLayout(clean(base)) }
  const copy = async () => {
    const json = JSON.stringify(layout, null, 2)
    try { await navigator.clipboard.writeText(json); return true } catch { window.prompt('Copie o layout:', json); return false }
  }

  return { layout, editing, toggle, selected, screenRef, bind, reset, copy }
}
