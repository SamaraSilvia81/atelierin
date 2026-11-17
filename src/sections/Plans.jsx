import { useState } from 'react'
import { Check, ArrowRight, Seal } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'
import PriceCalc from '@/components/PriceCalc'
import Waitlist from '@/components/Waitlist'
import FounderCard from '@/sections/Founder'

// Planos, com navegação em abas: "Modelo pronto" (assinatura, em breve) e
// "Sob medida" (disponível). Cada aba mostra os quatro planos com valores.
// Abaixo: "Sua área" (lista de espera) e, só no sob medida, fundador, tabela
// "Uma vez, e todo mês" e calculadora (valores em plans.pricing).
// Conteúdo em content.json > plans (tabs, sets, items).
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

function PlanCard({ it, fOn, f }) {
  return (
    <li className={`plan tone-${it.tone}`} data-reveal>
      <div className="plan-top">
        <span className="plan-line">{it.line}</span>
        <span className="plan-status"><i />{it.status}</span>
      </div>
      <h3 className="display">{it.name}</h3>
      <p className="plan-for">{it.for}</p>
      {it.text && <p className="plan-text">{it.text}</p>}

      <Price it={it} />

      {fOn && (it.monthly || it.founderNote) && (
        <p className="plan-fdr-price">
          <Seal size={14} weight="fill" aria-hidden="true" />
          <span>Fundador: <b>{it.monthly ? `${brl(it.monthly * (1 - f.discount))} por mês` : it.founderNote}</b></span>
        </p>
      )}

      {it.waitlist ? (
        <Waitlist cfg={it.waitlist} />
      ) : it.cta && (
        <div className="plan-act">
          <a href={it.cta.href} className="plan-cta" onClick={() => play('click')} onPointerEnter={() => play('tick')}>
            {it.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </a>
          {it.ctaNote && <p className="plan-note">{it.ctaNote}</p>}
        </div>
      )}

      <ul className="plan-feat">
        {it.features.map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" />{x}</li>)}
      </ul>
    </li>
  )
}

export default function Plans() {
  const p = content.plans
  const r = p.rules
  const [tab, setTab] = useState('medida')
  const set = p.sets[tab]
  // Cliente fundador (PRD-008): com vagas abertas, os cards do sob medida mostram
  // o valor de fundador e a tabela ganha a coluna com os 20% já aplicados.
  const f = content.founder
  const fOn = f && f.enabled !== false && f.open
  // const fTier = (name) => p.pricing.tiers.find((t) => t.label.toLowerCase() === name.toLowerCase())
  const fTier = (name) => p.pricing.tiers.find((t) => t.name.toLowerCase() === name.toLowerCase())
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

        <div className="plans-tabs" role="tablist" aria-label="Tipo de plano" data-reveal>
          {p.tabs.map((t) => (
            <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls="planos-painel"
              className="plans-tab" onClick={() => { play('click'); setTab(t.id) }}>
              <b>{t.label}</b><small>{t.sub}</small>
            </button>
          ))}
        </div>

        <div id="planos-painel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <p className="plans-tabnote">{set.note}</p>
          <ul className="plans is-4">
            {set.items.map((it) => <PlanCard key={it.name} it={it} fOn={fOn && tab === 'medida'} f={f} />)}
          </ul>

          {set.waitlist && (
            <div className="plans-wait" data-reveal>
              <h3 className="display">{set.waitlistTitle}</h3>
              <Waitlist cfg={set.waitlist} />
            </div>
          )}

          {tab === 'medida' && f && f.enabled !== false && <FounderCard />}

          {tab === 'medida' && (
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
                          return <td className={`is-founder ${t ? 'is-acc' : ''}`}>{t ? brl(t.price * (1 - f.discount)) : (row.founder ?? f.tableSame)}</td>
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
          )}
        </div>

        <ul className="plans is-area">
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
              <Waitlist cfg={it.waitlist} />
              <ul className="plan-feat">
                {it.features.map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" />{x}</li>)}
              </ul>
            </li>
          ))}
        </ul>

        <div className="plans-foot" data-reveal>
          <p>{p.foot.text}</p>
          <a href={p.foot.href} className="bridge-link">{p.foot.link} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
