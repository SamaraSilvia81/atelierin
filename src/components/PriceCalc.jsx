import { useState } from 'react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'

// Calculadora de Planos. Regras em content.plans.pricing:
// até `threshold` alunos indica o Padrão; acima, o Personalizado.
// Manutenção = max(pct% da receita, mínimo). Bunny só no Personalizado.
const brl = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR')

function Seg({ label, options, value, onChange }) {
  return (
    <fieldset className="calc-field">
      <legend>{label}</legend>
      <div className="seg">
        {options.map((o) => (
          <button key={String(o.value)} type="button" aria-pressed={value === o.value} disabled={o.disabled}
            title={o.title} onClick={() => { play('click'); onChange(o.value) }}>{o.label}</button>
        ))}
      </div>
    </fieldset>
  )
}

export default function PriceCalc() {
  const { pricing: P, calc: t } = content.plans
  const [students, setStudents] = useState(8)
  const [fee, setFee] = useState(250)
  const [access, setAccess] = useState(true)
  const [bunny, setBunny] = useState(false)

  const pers = students > P.threshold
  const plan = pers ? P.personalizado : P.padrao
  const useBunny = pers && bunny
  const revenue = students * (Number(fee) || 0)
  const setup = pers ? plan.setup : (access ? plan.setupStudents : plan.setup)
  const maint = Math.max(revenue * plan.pct / 100, plan.min)
  const video = useBunny ? plan.bunny : 0
  const month = maint + plan.infra + video

  return (
    <div className="calc" data-reveal>
      <p className="label">{t.label}</p>

      <div className="calc-field">
        <label htmlFor="calc-students">{t.students} <b>{students}</b></label>
        <input id="calc-students" type="range" min="1" max="80" value={students} onChange={(e) => setStudents(+e.target.value)} />
      </div>

      <div className="calc-field">
        <label htmlFor="calc-fee">{t.fee}</label>
        <div className="calc-money"><span>R$</span>
          <input id="calc-fee" type="number" inputMode="numeric" min="0" step="10" value={fee} onChange={(e) => setFee(e.target.value)} />
        </div>
      </div>

      <Seg label={t.access} value={access} onChange={setAccess}
        options={[{ value: true, label: t.accessYes }, { value: false, label: t.accessNo }]} />
      <Seg label={t.video} value={useBunny} onChange={setBunny}
        options={[{ value: false, label: t.videoFree }, { value: true, label: t.videoBunny, disabled: !pers, title: pers ? undefined : t.bunnyHint }]} />

      <div className="calc-res" aria-live="polite">
        <div className="calc-res-top"><span>{t.plan}</span><strong>{plan.name}</strong></div>
        <div className="calc-row"><span>{t.setup} <em>{t.once}</em></span><b>{pers ? `${plan.installments}x ${brl(plan.setup / plan.installments)}` : brl(setup)}</b></div>
        <div className="calc-row"><span>{t.maint} <em>{plan.pct}% · mín. {brl(plan.min)}</em></span><b>{brl(maint)}</b></div>
        <div className="calc-row"><span>{t.infra}</span><b>{brl(plan.infra)}</b></div>
        {useBunny && <div className="calc-row"><span>{t.bunny} <em>{t.estimated}</em></span><b>{brl(video)}</b></div>}
        <div className="calc-total">
          <span>{t.month}</span><strong>{brl(month)}</strong>
          {revenue > 0 && <small>{Math.round(month / revenue * 100)}% {t.share}</small>}
        </div>
        <div className="calc-years">
          <div><span>{t.year1}</span><b>{brl(setup + 12 * month)}</b></div>
          <div><span>{t.years}</span><b>{brl(12 * month)}</b></div>
        </div>
        <p className="calc-note">{t.note}</p>
      </div>
    </div>
  )
}
