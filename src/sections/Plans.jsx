import { Check, ArrowRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'

// Planos: hoje só a linha School está aberta; as outras entram por lista de espera.
export default function Plans() {
  const p = content.plans
  return (
    <section id="planos" data-theme="light" className="section plans-sec" aria-labelledby="planos-t">
      <div className="wrap">
        <header className="plans-head" data-reveal>
          <div>
            <p className="label"><b aria-hidden="true">&gt;</b> {p.piece}</p>
            <h2 id="planos-t" className="display">{p.title}</h2>
          </div>
          <p className="lede">{p.lede}</p>
        </header>

        <ul className="plans">
          {p.items.map((it) => (
            <li key={it.name} className={`plan tone-${it.tone}`} data-reveal>
              <div className="plan-top">
                <span className="plan-line">{it.line}</span>
                <span className="plan-status"><i />{it.status}</span>
              </div>
              <h3 className="display">{it.name}</h3>
              <p className="plan-for">{it.for}</p>
              <p className="plan-text">{it.text}</p>
              <ul>{it.features.map((f) => <li key={f}><Check size={14} weight="bold" aria-hidden="true" />{f}</li>)}</ul>
              <div className="plan-foot">
                <span className="plan-price">{it.price}</span>
                <a href={it.cta.href} className="plan-cta" onClick={() => play('click')} onPointerEnter={() => play('tick')}>
                  {it.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="plans-incl" data-reveal>
          <strong>{p.includesTitle}</strong>
          <ul>{p.includes.map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" />{x}</li>)}</ul>
        </div>

        <div className="bridge" data-reveal>
          <p>{p.proposal.text}</p>
          <a href={p.proposal.href} className="bridge-link">{p.proposal.link} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
