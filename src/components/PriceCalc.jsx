import { useState } from 'react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'

// Calculadora de Planos. Regras em content.plans.pricing:
// o tipo de ambiente (como é / ajustado) define a implantação;
// o mensal é fixo pela faixa de alunos (tiers). Bunny só no Personalizado.
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
  const f = content.founder
  const fOn = f && f.enabled !== false && f.open
  const [students, setStudents] = useState(8)
  const [pers, setPers] = useState(false)
  const [access, setAccess] = useState(true)
  const [bunny, setBunny] = useState(false)

  const plan = pers ? P.personalizado : P.padrao
  const tier = P.tiers.find((x) => students <= x.max)
  const useBunny = pers && bunny
  const setup = pers ? plan.setup : (access ? plan.setupStudents : plan.setup)
  const video = useBunny ? plan.bunny : 0
  const month = tier ? tier.price + video : null

  return (
    <div className="calc" data-reveal>
      <p className="label">{t.label}</p>

      <div className="calc-field">
        <label htmlFor="calc-students">{t.students} <b>{students}</b></label>
        <input id="calc-students" type="range" min="1" max="80" value={students} onChange={(e) => setStudents(+e.target.value)} />
      </div>

      <Seg label={t.kind} value={pers} onChange={setPers}
        options={[{ value: false, label: t.kindPadrao }, { value: true, label: t.kindPers }]} />
      {!pers && <Seg label={t.access} value={access} onChange={setAccess}
        options={[{ value: true, label: t.accessYes }, { value: false, label: t.accessNo }]} />}
      <Seg label={t.video} value={useBunny} onChange={setBunny}
        options={[{ value: false, label: t.videoFree }, { value: true, label: t.videoBunny, disabled: !pers, title: pers ? undefined : t.bunnyHint }]} />

      <div className="calc-res" aria-live="polite">
        <div className="calc-res-top"><span>{t.plan}</span><strong>{plan.name}</strong></div>
        <div className="calc-row"><span>{t.setup} <em>{t.once}</em></span><b>{pers ? `${plan.installments}x ${brl(plan.setup / plan.installments)}` : brl(setup)}</b></div>
        <div className="calc-row"><span>{t.tier} <em>{tier ? tier.label : P.overLabel}</em></span><b>{tier ? brl(tier.price) : t.over}</b></div>
        {useBunny && <div className="calc-row"><span>{t.bunny} <em>{t.estimated}</em></span><b>{brl(video)}</b></div>}
        <div className="calc-total">
          <span>{t.month}</span><strong>{month != null ? brl(month) : t.over}</strong>
        </div>
        {fOn && pers && tier && (
          <div className="calc-row calc-founder"><span>{f.calcLabel} <em>{f.calcSub}</em></span><b>{brl(tier.price * (1 - f.discount) + video)}</b></div>
        )}
        {month != null ? (
          <div className="calc-years">
            <div><span>{t.year1}</span><b>{brl(setup + 12 * month)}</b></div>
            <div><span>{t.years}</span><b>{brl(12 * month)}</b></div>
          </div>
        ) : <p className="calc-note">{t.overNote}</p>}
        <p className="calc-note">{t.note}</p>
      </div>
    </div>
  )
}
