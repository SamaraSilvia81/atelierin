import { useEffect, useRef, useState } from 'react'
import { Eraser, ArrowCounterClockwise, Trash, X } from '@phosphor-icons/react'

// Canetinha: só existe rodando local (yarn dev). Tecla H abre e fecha. Desenha por cima da página
// inteira (os traços ficam presos ao conteúdo quando rola), para apontar e riscar
// durante a revisão ou a reunião. Nada é salvo: recarregou, limpou.
const COLORS = [['#C0211C', 'carmim'], ['#1A0F0F', 'preto'], ['#F2C230', 'amarelo'], ['#2F7DE1', 'azul']]

export default function DevPen() {
  const cv = useRef(null)
  const strokes = useRef([])
  const cur = useRef(null)
  const [on, setOn] = useState(false)
  const [color, setColor] = useState(COLORS[0][0])
  const [size, setSize] = useState(4)
  const [erase, setErase] = useState(false)
  const [, tick] = useState(0)

  const fit = () => {
    const c = cv.current
    if (!c) return
    const h = document.documentElement.scrollHeight
    c.style.height = `${h}px`
    c.width = c.clientWidth
    c.height = h
    draw()
  }
  const draw = () => {
    const c = cv.current
    if (!c) return
    const g = c.getContext('2d')
    g.clearRect(0, 0, c.width, c.height)
    for (const s of strokes.current) {
      g.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over'
      g.globalAlpha = s.color === '#F2C230' && !s.erase ? 0.45 : 1
      g.strokeStyle = s.color
      g.lineWidth = s.erase ? s.size * 5 : s.color === '#F2C230' ? s.size * 4 : s.size
      g.lineCap = 'round'; g.lineJoin = 'round'
      g.beginPath()
      s.pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
      g.stroke()
    }
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1
  }
  const pos = (e) => {
    const r = cv.current.getBoundingClientRect()
    return [(e.clientX - r.left) * (cv.current.width / r.width), (e.clientY - r.top) * (cv.current.height / r.height)]
  }

  useEffect(() => {
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(document.body)
    const key = (e) => {
      if (e.key === 'Escape') setOn(false)
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
      if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'h' || e.key === 'H')) { fit(); setOn((v) => !v) }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && strokes.current.length) { strokes.current.pop(); draw(); tick((n) => n + 1) }
    }
    window.addEventListener('keydown', key)
    return () => { ro.disconnect(); window.removeEventListener('keydown', key) }
  }, [])

  const down = (e) => { e.preventDefault(); cv.current.setPointerCapture(e.pointerId); cur.current = { color, size, erase, pts: [pos(e)] }; strokes.current.push(cur.current) }
  const move = (e) => { if (!cur.current) return; cur.current.pts.push(pos(e)); draw() }
  const up = () => { cur.current = null; tick((n) => n + 1) }

  return (
    <>
      <canvas ref={cv} className={`devpen-cv ${on ? 'is-on' : ''}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      {on && (
        <div className="devpen-bar" data-theme="light">
          <span className="devpen-k">canetinha · H fecha</span>
          {COLORS.map(([c, n]) => (
            <button key={c} type="button" className={`devpen-dot ${!erase && color === c ? 'is-on' : ''}`} style={{ '--c': c }} title={n} aria-label={n} onClick={() => { setErase(false); setColor(c) }} />
          ))}
          {[3, 6, 10].map((s) => (
            <button key={s} type="button" className={`devpen-size ${size === s ? 'is-on' : ''}`} onClick={() => setSize(s)} aria-label={`espessura ${s}`}><i style={{ width: s + 2, height: s + 2 }} /></button>
          ))}
          <button type="button" className={`devpen-ic ${erase ? 'is-on' : ''}`} onClick={() => setErase((v) => !v)} title="Borracha"><Eraser size={18} /></button>
          <button type="button" className="devpen-ic" onClick={() => { strokes.current.pop(); draw(); tick((n) => n + 1) }} title="Desfazer (Ctrl+Z)"><ArrowCounterClockwise size={18} /></button>
          <button type="button" className="devpen-ic" onClick={() => { strokes.current = []; draw(); tick((n) => n + 1) }} title="Apagar tudo"><Trash size={18} /></button>
          <button type="button" className="devpen-ic" onClick={() => setOn(false)} title="Fechar (H)"><X size={18} /></button>
        </div>
      )}
    </>
  )
}
