import { useLayoutEffect, useRef, useState } from 'react'

// Linha de alinhavo desenhada à mão: sai de baixo do texto de fechamento,
// dá uma voltinha, passeia para a direita, desce pela lateral e termina
// apontando para o texto de "Como funciona" (seletor em "to").
// Os pontos vêm do rascunho da Samara (em px, relativos ao início) e são
// escalados para caber entre o início e o alvo em qualquer tela.
const SKETCH = [
  [0, 0], [-20, 18], [-16, 43], [12, 53], [10, 73], [-6, 113], [7, 148], [32, 183],
  [72, 195], [132, 195], [182, 197], [232, 188], [312, 184], [372, 196], [412, 228],
  [434, 260], [412, 308], [402, 348], [414, 393], [410, 433], [387, 453], [332, 453], [297, 447],
]
const H = 453, W = 434 // altura e largura do rascunho

// Catmull-Rom -> curvas cúbicas, para o traço ficar suave passando pelos pontos
function smooth(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

export default function Stitch({ to }) {
  const ref = useRef(null)
  const [geo, setGeo] = useState(null)

  useLayoutEffect(() => {
    const measure = () => {
      const svg = ref.current; const host = svg?.parentElement
      const target = document.querySelector(to)
      if (!host || !target) return
      const hr = host.getBoundingClientRect(); const tr = target.getBoundingClientRect()
      const k = hr.width / host.offsetWidth || 1 // corrige o zoom de 80% do desktop
      const w = host.offsetWidth
      const sx = w / 2
      const ey = (tr.top - hr.top) / k + (tr.height / k) / 2   // meio do texto alvo
      const ky = ey / H
      const kx = Math.min(ky, (w - sx + 40) / W)                // não passa muito da borda direita
      const pts = SKETCH.map(([x, y]) => [sx + x * kx, y * ky])
      const end = pts[pts.length - 1], prev = pts[pts.length - 2]
      const ang = Math.atan2(end[1] - prev[1], end[0] - prev[0])
      const head = [ang + 2.6, ang - 2.6].map((a) => [end[0] + Math.cos(a) * 10, end[1] + Math.sin(a) * 10])
      setGeo({ w, h: ey + 30, d: smooth(pts), head: `M ${head[0][0]} ${head[0][1]} L ${end[0]} ${end[1]} L ${head[1][0]} ${head[1][1]}` })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [to])

  return (
    <svg ref={ref} className="stitch" width={geo?.w ?? 0} height={geo?.h ?? 0} aria-hidden="true">
      {geo && (<><path className="stitch-line" d={geo.d} /><path className="stitch-head" d={geo.head} /></>)}
    </svg>
  )
}
