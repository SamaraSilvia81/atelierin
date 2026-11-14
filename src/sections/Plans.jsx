import { Check, ArrowRight, Seal } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'
import PriceCalc from '@/components/PriceCalc'
import Waitlist from '@/components/Waitlist'
import FounderCard, { FounderInline } from '@/sections/Founder'
import { useAb } from '@/lib/ab'

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

const brl = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR')

export default function Plans() {
  const p = content.plans
  const r = p.rules
  // Cliente fundador (PRD-008): com vagas abertas, os cards ganham o selo e a
  // tabela ganha a coluna com os 20% já aplicados. Tudo sai de content.founder.
  const f = content.founder
  const fOn = f && f.enabled !== false && f.open
  // Teste A/B de como o fundador aparece: "card" (card horizontal abaixo dos
  // planos) ou "dentro" (bloco retrátil dentro do card Personalizado). Padrão
  // em founder.planStyle; o painel "Teste A/B" (yarn dev) troca na hora.
  const fStyle = useAb('fundador', f?.planStyle || 'card')
  const fTier = (name) => p.pricing.tiers.find((t) => t.label.toLowerCase() === name.toLowerCase())
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
            <li key={it.name} className={`plan tone-${it.tone} ${fOn && it.name === f.plan ? 'has-founder' : ''}`} data-reveal>
              {fOn && it.name === f.plan && (
                <a href="#fundador" className="plan-founder" onClick={() => play('click')}>
                  <Seal size={18} weight="fill" aria-hidden="true" />
                  <span><b>{f.planBadge}</b><small>{f.planBadgeSub}</small></span>
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </a>
              )}
              <div className="plan-top">
                <span className="plan-line">{it.line}</span>
                <span className="plan-status"><i />{it.status}</span>
              </div>
              <h3 className="display">{it.name}</h3>
              <p className="plan-for">{it.for}</p>
              <p className="plan-text">{it.text}</p>

              <Price it={it} />

              {f && f.enabled !== false && fStyle === 'dentro' && it.name === f.plan && <FounderInline />}

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

        {f && f.enabled !== false && fStyle === 'card' && <FounderCard />}

        <div className="pricing">
          <div className="rules" data-reveal>
            <p className="label">{r.label}</p>
            <h3 className="display">{r.title}</h3>
            <table>
              <thead><tr><th><span className="sr-only">Item</span></th>{r.cols.map((c) => <th key={c} scope="col">{c}</th>)}{fOn && <th scope="col" className="is-founder">{f.tableCol}</th>}</tr></thead>
              <tbody>
                {r.rows.map((row) => (
                  <tr key={row.name}>
                    <th scope="row"><b aria-hidden="true">{row.mark}</b>{row.name}</th>
                    {row.values.map((v, i) => <td key={i} className={row.accent === i ? 'is-acc' : ''}>{v}</td>)}
                    {fOn && (() => {
                      const t = fTier(row.name)
                      return <td className={`is-founder ${t ? 'is-acc' : ''}`}>{t ? brl(t.price * (1 - f.discount)) : f.tableSame}</td>
                    })()}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="rules-note">{r.note}</p>
            {fOn && (
              <p className="rules-founder">
                <Seal size={15} weight="fill" aria-hidden="true" />
                <span>{f.tableNote} <a href={f.link.href}>{f.link.label}</a></span>
              </p>
            )}
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
