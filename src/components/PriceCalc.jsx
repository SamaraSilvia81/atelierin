import { useEffect, useState } from 'react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'

// Calculadora de Planos, por família (fam = 'estrutura' | 'relacionamento').
// Escolhe o plano mais barato que comporta os clientes e a equipe, usando até
// pricing.extraMax adicionais. Regras em content.plans.pricing.
const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 })

export default function PriceCalc({ fam, onPick }) {
  const { pricing: P, calc: t } = content.plans
  const f = content.founder
  const fOn = f && f.enabled !== false && f.open && fam === 'relacionamento'
  const [clients, setClients] = useState(fam === 'estrutura' ? 12 : 33)
  const [team, setTeam] = useState(0)
  const F = P[fam]

  const options = F.tiers
    .filter((x) => x.team >= team && clients <= x.clients + (x.price > 0 && F.extra ? P.extraMax : 0))
    .map((x) => {
      const extras = Math.max(0, clients - x.clients)
      return { ...x, extras, total: x.price + extras * F.extra }
    })
  const best = options.sort((a, b) => a.total - b.total)[0]
  const next = best && F.tiers[F.tiers.indexOf(F.tiers.find((x) => x.name === best.name)) + 1]
  const discount = fOn && best ? best.price * f.discount : 0
  const month = best ? best.total - discount : null
  useEffect(() => { onPick?.(best ? best.name : null) }, [best?.name])

  return (
    <div className="calc calc-wide" data-reveal>
      <div className="calc-in">
      <p className="label">{t.label}</p>
      <h3 className="display calc-title">{t.title}</h3>
      <div className="calc-field">
        <label htmlFor={`calc-${fam}`}>{t.clients[fam]} <b>{clients}</b></label>
        <input id={`calc-${fam}`} type="range" min="1" max="160" value={clients} onChange={(e) => setClients(+e.target.value)} />
      </div>
      <fieldset className="calc-field">
        <legend>{t.team}</legend>
        <div className="seg">
          {[[0, t.team0], [5, t.team5], [15, t.team15]].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={team === v} onClick={() => { play('click'); setTeam(v) }}>{l}</button>
          ))}
        </div>
      </fieldset>

      </div>
      <div className="calc-res" aria-live="polite">
        <div className="calc-res-top"><span>{t.plan}</span><strong>{best ? best.name : P.over[fam]}</strong></div>
        {best ? (
          <>
            <div className="calc-row"><span>{t.base}</span><b>{brl(best.price)}</b></div>
            {best.extras > 0 && <div className="calc-row"><span>{t.extra[fam]} <em>{best.extras} × {brl(F.extra)}</em></span><b>{brl(best.extras * F.extra)}</b></div>}
            {discount > 0 && <div className="calc-row calc-founder"><span>{t.founder} <em>−{Math.round(f.discount * 100)}% na mensalidade</em></span><b>−{brl(discount)}</b></div>}
            <div className="calc-total"><span>{t.month}</span><strong>{brl(month)}</strong></div>
            <div className="calc-years"><div><span>{t.year}</span><b>{brl(12 * month)}</b></div></div>
            {best.extras > 0 && next && <p className="calc-note">{t.next}: {next.name}, {brl(next.price)} por mês.</p>}
          </>
        ) : <p className="calc-note">{t.overNote}</p>}
        <p className="calc-note">{t.note}</p>
      </div>
    </div>
  )
}
