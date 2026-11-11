import { useLayoutEffect, useRef, useState } from 'react'

// Linha de alinhavo: sai de baixo do elemento "from" e desce pela lateral
// esquerda até o elemento "to" (seletor CSS), terminando numa seta.
// Mede as posições no DOM, então acompanha qualquer tamanho de tela.
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
      const sx = w / 2, sy = 0                              // começa no centro, embaixo do texto
      const ex = (tr.left - hr.left) / k - 18               // termina à esquerda do rótulo
      const ey = (tr.top - hr.top) / k + (tr.height / k) / 2
      const lx = Math.max(ex - 40, -60)                     // lateral por onde a linha desce
      const turn = Math.min(sy + 200, ey - 80)              // onde a linha chega na lateral
      const d = [
        `M ${sx} ${sy}`,
        `C ${sx} ${sy + 110}, ${lx} ${sy + 60}, ${lx} ${turn}`, // curva do centro até a lateral
        `L ${lx} ${ey - 50}`,                                   // desce reta pela lateral
        `Q ${lx} ${ey}, ${ex} ${ey}`,                           // vira para o rótulo
      ].join(' ')
      setGeo({ w, h: ey + 20, d, ex, ey })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [to])

  return (
    <svg ref={ref} className="stitch" width={geo?.w ?? 0} height={geo?.h ?? 0} aria-hidden="true">
      {geo && (
        <>
          <path className="stitch-line" d={geo.d} />
          <path className="stitch-head" d={`M ${geo.ex - 9} ${geo.ey - 7} L ${geo.ex} ${geo.ey} L ${geo.ex - 9} ${geo.ey + 7}`} />
        </>
      )}
    </svg>
  )
}
