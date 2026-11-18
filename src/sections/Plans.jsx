import { useEffect, useRef, useState } from 'react'
import { Check, Minus, ArrowRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'
import PriceCalc from '@/components/PriceCalc'
import Waitlist from '@/components/Waitlist'

// Planos: título com os seletores de família (Estrutura | Relacionamento) e de
// cobrança (mensal, trimestral, anual) ao lado; cards com o valor no centro, que
// anima ao trocar a cobrança e mostra o valor cheio riscado; o plano "sob consulta"
// sai dos cards e vira uma faixa própria; comparar; simulador (que destaca o card
// indicado); Sob medida em degraus. Conteúdo: content.json > plans.
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

// Número que corre do valor anterior até o novo quando a cobrança muda
function Count({ value }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const a = from.current, b = value
    if (a === b) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShown(b); from.current = b; return }
    const t0 = performance.now(), dur = 650
    let raf
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - k, 3)
      setShown(Math.round((a + (b - a) * e) * 100) / 100)
      if (k < 1) raf = requestAnimationFrame(step)
      else from.current = b
    }
    raf = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(raf); from.current = b }
  }, [value])
  return <>{brl(shown)}</>
}

function Cell({ v }) {
  if (v === true) return <Check size={16} weight="bold" aria-label="Incluído" />
  if (v === false) return <Minus size={14} aria-label="Não incluído" className="pcmp-no" />
  return v
}

function PCard({ it, b, fam, pick }) {
  const avail = it.tone === 'plain'
  const month = it.amount * (1 - b.disc)
  const off = Math.round(b.disc * 100)
  const free = it.amount === 0
  return (
    <li className={`plan ${pick ? 'is-pick' : ''}`} data-reveal>
      {pick && <span className="plan-pick">Indicado para você</span>}
      <div className="plan-top">
        <span className="plan-line">{fam}</span>
        <span className="plan-status"><i />{avail ? 'Disponível' : 'Em breve'}</span>
      </div>
      <h3 className="display">{it.name}</h3>
      <p className="plan-for">{it.for}</p>
      <div className="plan-price">
        <span className="plan-price-label">{free ? 'Plano gratuito' : off ? `${b.label} · −${off}%` : b.label}</span>
        <span className={`plan-was ${off && !free ? 'is-on' : ''}`} aria-hidden={!off || free}>{brl(it.amount)}</span>
        <div className="plan-amount"><strong><Count value={month} /></strong></div>
        <span className="plan-price-sub">por mês</span>
        <small>
          {free ? 'sem custo' : off
            ? <>cobrado <Count value={month * b.months} /> {b.months === 3 ? 'a cada 3 meses' : 'por ano'}</>
            : 'cobrado todo mês'}
        </small>
      </div>
      <ul className="plan-feat">{it.features.slice(0, 5).map((x) => <li key={x}><Check size={14} weight="bold" aria-hidden="true" />{x}</li>)}</ul>
      {it.cta && (
        <div className="plan-act">
          <a href={it.cta.href} className="plan-cta" onClick={() => play('click')}>{it.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
        </div>
      )}
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

// Um painel por família: cards com preço, faixa do plano sob consulta, comparar e simulador
function Panel({ t, set, b, hidden }) {
  const [pick, setPick] = useState(null)
  const priced = set.items.filter((x) => x.amount != null)
  const custom = set.items.find((x) => x.amount == null)
  const cols = priced.length === 4 ? 4 : 3
  return (
    <div hidden={hidden} role="tabpanel">
      <ul className={`plans-grid cols-${cols}`}>{priced.map((it) => <PCard key={it.name} it={it} b={b} fam={t.label} pick={it.name === pick} />)}</ul>

      {custom && (
        <div className="plans-custom" data-reveal>
          <div className="plans-custom-id">
            <span className="plan-line">{t.label} · {custom.for}</span>
            <h3 className="display">{custom.name}</h3>
          </div>
          <p>{custom.text} {custom.features.slice(0, 3).join(' · ')}.</p>
          <div className="plans-custom-act">
            <strong>{custom.priceBig}</strong>
            {custom.cta && <a href={custom.cta.href} className="plan-cta" onClick={() => play('click')}>{custom.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>}
          </div>
        </div>
      )}

      <Compare cm={set.compare} pick={pick} />

      {set.waitlist && (
        <div id="lista-espera" className="plans-band" data-reveal>
          <div><h3 className="display">{set.waitlistTitle}</h3></div>
          <Waitlist cfg={set.waitlist} />
        </div>
      )}

      <PriceCalc fam={t.id} onPick={setPick} />
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
          <div className="plans-ctrls">
            <Seg label="Família de planos" value={tab} onChange={setTab} options={p.tabs.map((x) => ({ label: x.label, value: x.id }))} />
            <Seg label="Cobrança" value={bid} onChange={setBid} options={p.billing.map((x) => ({ label: x.label, value: x.id, badge: x.badge }))} />
          </div>
        </header>
        <p className="plans-lede" aria-live="polite">{cur.lede}</p>

        {p.tabs.map((t) => <Panel key={t.id} t={t} set={p.sets[t.id]} b={b} hidden={tab !== t.id} />)}

        {p.video && <p className="plans-video" data-reveal>{p.video}</p>}

        <div className="plans-sob" data-reveal>
          <div>
            <p className="plans-sob-k">{c.line}</p>
            <h3 className="display">{c.name}</h3>
            <p>{c.for}</p>
            {c.cta && <a href={c.cta.href} className="plans-sob-cta" onClick={() => play('click')}>{c.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>}
          </div>
          <ol className="plans-sob-steps">
            {c.steps.map((s) => (
              <li key={s.name}>
                <div><b>{s.name}</b><span>{s.text}</span></div>
                <div><strong>{s.price}</strong>{s.total && <small>{s.total}</small>}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* "Sua área ainda não tem linha": escondido por enquanto, a UI vai ser refeita
        {p.items.map((it) => (
          <div key={it.name} className="plans-band plans-area" data-reveal>
            ...
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
