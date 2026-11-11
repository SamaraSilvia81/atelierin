import { useEffect, useState } from 'react'
import { play } from '@/lib/sounds'

// Animação de "A marca é sua": o mesmo ambiente trocando de identidade
// (nome, logo, cores, fonte e vocabulário) a cada poucos segundos.
// Pausa com o mouse em cima; com "reduzir movimento" não troca sozinho,
// só pelos botões de baixo.
const TICK = 3200

export default function BrandMorph({ data }) {
  const ids = data.identities
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])
  useEffect(() => {
    if (paused || reduced) return
    const t = setTimeout(() => setI((n) => (n + 1) % ids.length), TICK)
    return () => clearTimeout(t)
  }, [i, paused, reduced, ids.length])

  const b = ids[i]
  const vars = {
    '--m-side': b.side, '--m-side-ink': b.sideInk, '--m-acc': b.acc, '--m-acc-ink': b.accInk,
    '--m-paper': b.paper, '--m-font': b.font, '--m-tick': `${TICK}ms`,
  }

  return (
    <div className="morph" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <figure className="morph-app" style={vars} aria-label={`Exemplo de ambiente com a marca ${b.name}`}>
        <div className="morph-bar" aria-hidden="true">
          <span className="dots"><i /><i /><i /></span>
          <code key={b.id} className="morph-swap">{b.slug}.atelierin.com.br</code>
        </div>
        <div className="morph-body">
          <aside className="morph-side">
            <div className="morph-brand" key={b.id}>
              <span className="morph-logo">{b.initials}</span>
              <strong>{b.name}</strong>
            </div>
            <ul key={`m-${b.id}`} className="morph-swap">
              {b.menu.map((m, k) => <li key={m} className={k === b.menu.length - 1 ? 'on' : ''}>{m}</li>)}
            </ul>
          </aside>
          <div className="morph-main">
            <div className="morph-head">
              <span className="morph-h" key={`h-${b.id}`}>Financeiro · {b.people}</span>
              <span className="morph-btn">+ novo</span>
            </div>
            <div className="morph-rows" key={`r-${b.id}`}>
              {b.rows.map(([n, s], k) => (
                <div key={n} className="morph-row" style={{ animationDelay: `${k * 60}ms` }}>
                  <span className="morph-av">{n.slice(0, 1)}</span>
                  <span className="morph-name">{n}</span>
                  <b className={`st st-${s.replace(' ', '-')}`}>{s}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <figcaption className="morph-foot">feito com <strong>Atelierin</strong></figcaption>
        {!paused && !reduced && <span key={`p-${i}`} className="morph-progress" aria-hidden="true" />}
      </figure>

      <div className="morph-tabs" role="tablist" aria-label={data.label}>
        {ids.map((x, k) => (
          <button key={x.id} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''}
            onClick={() => { play('click'); setI(k) }} onPointerEnter={() => play('tick')}>
            <i style={{ background: x.acc }} />{x.line}
          </button>
        ))}
      </div>
    </div>
  )
}
