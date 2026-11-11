import { useLayoutEffect, useRef, useState } from 'react'

// Linha de alinhavo com laçadas: sai de baixo do texto de fechamento,
// desce, faz duas voltinhas indo para a direita, desce pela lateral e
// termina apontando para o texto de "Como funciona" (seletor em "to").
// LOOPS é o desenho das laçadas (coordenadas de um rascunho 1200x560);
// ele é escalado para caber na largura disponível.
const LOOPS = [
  [48, 100], [45, 160], [55, 220], [85, 280], [140, 320], [200, 330], [240, 322], [285, 285],
  [295, 245], [268, 228], [240, 245], [225, 290], [232, 345], [260, 385], [310, 400], [370, 395],
  [450, 365], [530, 325], [600, 312], [660, 325], [705, 355], [725, 410], [718, 465], [680, 490],
  [635, 480], [622, 440], [645, 400], [690, 378], [745, 375], [790, 410], [830, 460], [880, 490],
  [940, 480], [985, 430], [995, 350], [980, 270], [1000, 220], [1050, 203], [1100, 212],
  [1150, 250], [1175, 300], [1180, 350],
]
const LW = 1132, LH = 250 // largura do desenho e altura do ponto final em relação ao início

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
      const kk = Math.max(0.25, Math.min((w - sx + 30) / LW, (ey - 170) / LH))
      const pts = LOOPS.map(([x, y]) => [sx + (x - 48) * kk, (y - 100) * kk])
      const [lx, ly] = pts[pts.length - 1]
      // depois das laçadas: desce pela lateral e vira para a esquerda
      pts.push([lx + 4, ly + (ey - ly) * 0.45], [lx - 4, ey - 50], [lx - 40, ey - 6], [lx - 120, ey])
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
