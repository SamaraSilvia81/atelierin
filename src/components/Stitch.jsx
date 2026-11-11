import { useLayoutEffect, useRef, useState } from 'react'

// Linha de alinhavo com laçadas: sai de baixo do texto de fechamento,
// faz duas voltinhas indo para a direita e termina numa curva curta que
// aponta para baixo, em direção a "Como funciona".
// LOOPS é o desenho das laçadas (coordenadas de um rascunho 1200x560);
// ele é escalado para caber na largura disponível.
const LOOPS = [
  [48, 100], [45, 160], [55, 220], [85, 280], [140, 320], [200, 330], [240, 322], [285, 285],
  [295, 245], [268, 228], [240, 245], [225, 290], [232, 345], [260, 385], [310, 400], [370, 395],
  [450, 365], [530, 325], [600, 312], [660, 325], [705, 355], [725, 410], [718, 465], [680, 490],
  [635, 480], [622, 440], [645, 400], [690, 378], [730, 385],
  // depois da segunda laçada: uma curva curta descendo para a esquerda, em direção a "Como funciona"
  [750, 420], [735, 470], [695, 505], [640, 525],
]

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
      const kk = Math.max(0.3, Math.min(0.6, (w - sx) / 760))
      const pts = LOOPS.map(([x, y]) => [sx + (x - 48) * kk, (y - 100) * kk])
      const end = pts[pts.length - 1], prev = pts[pts.length - 2]
      const ang = Math.atan2(end[1] - prev[1], end[0] - prev[0])
      const head = [ang + 2.6, ang - 2.6].map((a) => [end[0] + Math.cos(a) * 10, end[1] + Math.sin(a) * 10])
      setGeo({ w, h: Math.max(...pts.map((q) => q[1])) + 30, d: smooth(pts), head: `M ${head[0][0]} ${head[0][1]} L ${end[0]} ${end[1]} L ${head[1][0]} ${head[1][1]}` })
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
