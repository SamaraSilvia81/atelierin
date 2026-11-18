import { useState } from 'react'
import { Check, Minus, ArrowRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'
import PriceCalc from '@/components/PriceCalc'
import Waitlist from '@/components/Waitlist'

// Planos: título "Planos"; seletor Gestão | Portal (à direita) que troca o texto
// de apresentação; seletor de cobrança (mensal, trimestral, anual) com o desconto
// dentro do preço; guia "qual é o seu" que destaca o plano indicado; cards no
// visual da identidade (.plan); "Comparar todas as funcionalidades"; adicionais,
// calculadora e Sob medida. Conteúdo: content.json > plans.
const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 })

function Seg({ label, options, value, onChange }) {
  return (
    <div className="pseg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" aria-pressed={value === o.value} onClick={() => { play('click'); onChange(o.value) }}>
          {o.label}{o.badge && <em> {o.badge}</em>}
        </button>
      ))}
    </div>
  )
}

function Cell({ v }) {
  if (v === true) return <Check size={16} weight="bold" aria-label="Incluído" />
  if (v === false) return <Minus size={14} aria-label="Não incluído" className="pcmp-no" />
  return v
}

function PCard({ it, b, fam, pick }) {
  const avail = it.tone === 'plain'
  const has = it.amount != null
  const month = has ? it.amount * (1 - b.disc) : 0
  const off = Math.round(b.disc * 100)
  return (
    <li className={`plan ${avail ? 'tone-avail' : ''} ${pick ? 'is-pick' : ''}`} data-reveal>
      {pick && <span className="plan-pick">Indicado para você</span>}
      <div className="plan-top">
        <span className="plan-line">{fam}</span>
        <span className="plan-status"><i />{avail ? 'Disponível' : 'Em breve'}</span>
      </div>
      <h3 className="display">{it.name}</h3>
      <p className="plan-for">{it.for}</p>
      <p className="plan-text">{it.text}</p>
      {has ? (
        <div className="plan-price">
          <span className="plan-price-label">{it.amount === 0 ? 'Plano gratuito' : off ? `${b.label} · −${off}%` : b.label}</span>
          <div className="plan-amount"><strong>{brl(month)}</strong></div>
          <span className="plan-price-sub">por mês</span>
          <small>
            {it.amount === 0 ? 'sem custo' : off
              ? <><s>{brl(it.amount)}</s> · cobrado {brl(month * b.months)} {b.months === 3 ? 'a cada 3 meses' : 'por ano'}</>
              : 'cobrado todo mês'}
          </small>
        </div>
      ) : (
        <div className="plan-price is-soft"><strong>{it.priceBig}</strong><small>{it.priceExtra}</small></div>
      )}
      {it.cta && (
        <div className="plan-act">
          <a href={it.cta.href} className="plan-cta" onClick={() => play('click')}>{it.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
        </div>
      )}
      <ul className="plan-feat">{it.features.slice(0, 5).map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" />{x}</li>)}</ul>
    </li>
  )
}

function Compare({ cm, pick }) {
  const hi = (c) => (c === pick ? 'is-pick' : undefined)
  return (
    <details className="pcmp" onToggle={() => play('click')}>
      <summary>Comparar todas as funcionalidades</summary>
      <div className="pcmp-scroll">
        <table>
          <thead><tr><th><span className="sr-only">Recurso</span></th>{cm.cols.map((c) => <th key={c} scope="col" className={hi(c)}>{c}</th>)}</tr></thead>
          {cm.sections.map((s) => (
            <tbody key={s.title}>
              <tr className="pcmp-sec"><th colSpan={cm.cols.length + 1}>{s.title}</th></tr>
              {s.rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th>{r.slice(1).map((v, i) => <td key={i} className={hi(cm.cols[i])}><Cell v={v} /></td>)}</tr>)}
            </tbody>
          ))}
        </table>
      </div>
    </details>
  )
}

// Um painel por família; o guia escolhe o plano indicado e o destaca nos cards.
function Panel({ t, set, b, hidden }) {
  const p = content.plans
  const F = p.pricing[t.id]
  const [cl, setCl] = useState(null)
  const [tm, setTm] = useState(0)
  const pick = cl == null ? null : (F.tiers.find((x) => x.clients >= cl && x.team >= tm)?.name ?? p.pricing.over[t.id])
  const r = set.rules
  return (
    <div hidden={hidden} role="tabpanel">
      <div className="plans-guide" data-reveal>
        <p className="label">Qual é o seu?</p>
        <div className="guide-row"><span>Quantos clientes você atende</span><Seg label="Clientes" value={cl} onChange={setCl} options={set.guide.clients.map(([label, value]) => ({ label, value }))} /></div>
        <div className="guide-row"><span>Equipe além de você</span><Seg label="Equipe" value={tm} onChange={setTm} options={[{ label: 'Só eu', value: 0 }, { label: 'Até 5', value: 5 }, { label: 'Até 15', value: 15 }]} /></div>
        <p className="guide-res">{pick ? <>Indicado para você: <b className="display">{pick}</b> Passou pouco do limite? Dá para adicionar clientes, veja abaixo.</> : 'Escolha uma faixa e a gente destaca o plano certo.'}</p>
      </div>

      <ul className="plans-grid">{set.items.map((it) => <PCard key={it.name} it={it} b={b} fam={t.label} pick={it.name === pick} />)}</ul>
      <Compare cm={set.compare} pick={pick} />

      {set.waitlist && (
        <div id="lista-espera" className="plans-band" data-reveal>
          <div><h3 className="display">{set.waitlistTitle}</h3></div>
          <Waitlist cfg={set.waitlist} />
        </div>
      )}

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
        <PriceCalc fam={t.id} />
      </div>
    </div>
  )
}

export default function Plans() {
  const p = content.plans
  const [tab, setTab] = useState('relacionamento')
  const [bid, setBid] = useState('anual')
  const b = p.billing.find((x) => x.id === bid)
  const cur = p.tabs.find((x) => x.id === tab)
  const c = p.custom

  return (
    <section id="planos" data-theme="light" className="section plans-sec" aria-labelledby="planos-t">
      <div className="wrap">
        <header className="plans-head" data-reveal>
          <div>
            <p className="label"><b aria-hidden="true">&gt;</b> {p.piece}</p>
            <h2 id="planos-t" className="display">{p.title}</h2>
          </div>
          <div className="plans-head-r">
            <Seg label="Família de planos" value={tab} onChange={setTab} options={p.tabs.map((x) => ({ label: x.label, value: x.id }))} />
            <p className="lede" aria-live="polite">{cur.lede}</p>
          </div>
        </header>

        <div className="plans-bill" data-reveal>
          <Seg label="Cobrança" value={bid} onChange={setBid} options={p.billing.map((x) => ({ label: x.label, value: x.id, badge: x.badge }))} />
        </div>

        {p.tabs.map((t) => <Panel key={t.id} t={t} set={p.sets[t.id]} b={b} hidden={tab !== t.id} />)}

        <div className="plans-band plans-area" data-reveal>
          <div>
            <p className="plan-line">{c.line}</p>
            <h3 className="display">{c.name}</h3>
            <p className="plan-for">{c.for}</p>
            <ul className="plan-feat">{c.features.map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" />{x}</li>)}</ul>
          </div>
          <div>
            <div className="plan-price">
              <span className="plan-price-label">{c.priceLabel}</span>
              <div className="plan-amount"><strong>{c.priceBig}</strong></div>
              <span className="plan-price-sub">{c.priceSub}</span>
              <small>{c.priceNote}</small>
            </div>
            <div className="plan-act"><a href={c.cta.href} className="plan-cta" onClick={() => play('click')}>{c.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a></div>
          </div>
        </div>

        {/* "Sua área ainda não tem linha": escondido por enquanto, a UI vai ser refeita
        {p.items.map((it) => (
          <div key={it.name} className="plans-band plans-area" data-reveal>
            <div>
              <p className="plan-line">{it.line} · {it.status}</p>
              <h3 className="display">{it.name}</h3>
              <p className="plan-for">{it.for}</p>
              <p className="plan-text">{it.text}</p>
            </div>
            <Waitlist cfg={it.waitlist} />
          </div>
        ))}
        */}

        <div className="plans-foot" data-reveal>
          <p>{p.foot.text}</p>
          <a href={p.foot.href} className="bridge-link">{p.foot.link} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
