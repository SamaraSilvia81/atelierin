import { Check, ArrowRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'
import PriceCalc from '@/components/PriceCalc'
import Waitlist from '@/components/Waitlist'

// Planos: Padrão e Personalizado (School) disponíveis; outras linhas por lista
// de espera. O card do meio é o destaque. O mensal fica fora dos cards, na
// tabela "Uma vez, e todo mês" e na calculadora (valores em plans.pricing).
function Price({ it }) {
  if (it.priceBig) {
    return (
      <div className="plan-price is-soft">
        <strong>{it.priceBig}</strong>
        {it.priceExtra && <small>{it.priceExtra}</small>}
      </div>
    )
  }
  return (
    <div className="plan-price">
      {it.priceLabel && <span className="plan-price-label">{it.priceLabel}</span>}
      <div className="plan-amount">
        {it.pricePre && <em>{it.pricePre}</em>}
        <strong>{it.price}</strong>
      </div>
      {it.priceSub && <span className="plan-price-sub">{it.priceSub}</span>}
      {it.priceExtra && <small>{it.priceExtra}</small>}
    </div>
  )
}

export default function Plans() {
  const p = content.plans
  const r = p.rules
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

              <Price it={it} />

              {it.waitlist ? (
                <Waitlist cfg={it.waitlist} />
              ) : (
                <div className="plan-act">
                  <a href={it.cta.href} className="plan-cta" onClick={() => play('click')} onPointerEnter={() => play('tick')}>
                    {it.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </a>
                  {it.ctaNote && <p className="plan-note">{it.ctaNote}</p>}
                </div>
              )}

              <ul className="plan-feat">
                {it.features.map((f) => <li key={f}><Check size={14} weight="bold" aria-hidden="true" />{f}</li>)}
              </ul>
            </li>
          ))}
        </ul>

        <div className="pricing">
          <div className="rules" data-reveal>
            <p className="label">{r.label}</p>
            <h3 className="display">{r.title}</h3>
            <table>
              <thead><tr><th><span className="sr-only">Item</span></th>{r.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {r.rows.map((row) => (
                  <tr key={row.name}>
                    <th scope="row"><b aria-hidden="true">{row.mark}</b>{row.name}</th>
                    {row.values.map((v, i) => <td key={i} className={row.accent === i ? 'is-acc' : ''}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="rules-note">{r.note}</p>
          </div>
          <PriceCalc />
        </div>

        <div className="plans-foot" data-reveal>
          <p>{p.foot.text}</p>
          <a href={p.foot.href} className="bridge-link">{p.foot.link} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
