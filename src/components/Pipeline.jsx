import { useRef } from 'react'
import { Check } from '@phosphor-icons/react'
import { useStickyProgress } from '@/lib/useStickyProgress'
import { play } from '@/lib/sounds'
import StepMock from '@/components/StepMock'

// Moldura de navegador do passo: imagem real (se houver) ou a telinha em código
function Screen({ step, url, className = '' }) {
  return (
    <figure className={`pl-screen ${className}`}>
      <div className="pl-screen-bar" aria-hidden="true">
        <span className="dots"><i /><i /><i /></span>
        <code>{url}</code>
        <span className="pl-screen-step">{step.n} · {step.title}</span>
      </div>
      {step.image?.src
        ? <img src={step.image.src} alt={step.image.alt ?? ''} loading="lazy" />
        : <div className="pl-screen-mock" aria-hidden="true"><StepMock kind={step.mock} /></div>}
    </figure>
  )
}

function Actors({ list, labels }) {
  return (
    <span className="pl-actors">
      {list.map((a) => <span key={a} className={`pl-actor is-${a}`}>{labels[a]}</span>)}
    </span>
  )
}

// Pipeline em linha do tempo presa na tela (como a da Check.AI): enquanto a
// pessoa rola, o passo ativo abre e a telinha dele aparece à direita.
// No celular e com "reduzir movimento", vira uma lista com tudo aberto.
export default function Pipeline({ data }) {
  const steps = data.items
  const ref = useRef(null)
  const { active, reduced } = useStickyProgress(ref, steps.length)

  const goTo = (i) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const top = r.top + window.scrollY + (r.height - window.innerHeight) * ((i + 0.5) / steps.length)
    play('click')
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <>
      <div className="pipeline-intro" data-reveal>
        <div className="pipeline-head">
          <p className="label"><b aria-hidden="true">&gt;</b> {data.label}</p>
          <h3 className="display">{data.title}</h3>
          <p className="lede">{data.lede}</p>
        </div>
        <aside className="pl-needs">
          <strong>{data.needs.title}</strong>
          <ul>{data.needs.items.map((n) => <li key={n}>{n}</li>)}</ul>
        </aside>
      </div>

      <div ref={ref} className={`pipeline ${reduced ? 'is-reduced' : ''}`} style={{ '--n': steps.length }}>
        <div className="pipeline-pin">
          <div className="pl-progress" aria-hidden="true">
            <span>passo <b>{String(active + 1).padStart(2, '0')}</b> de {String(steps.length).padStart(2, '0')}</span>
            <i><em /></i>
          </div>
          <div className="pipeline-grid">
            <ol className="pl-steps">
              <span className="pl-rail" aria-hidden="true" />
              <span className="pl-rail pl-fill" aria-hidden="true" />
              {steps.map((s, i) => {
                const done = reduced || i < active
                const current = !reduced && i === active
                return (
                  <li key={s.n} className={`pl-step ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}>
                    <span className="pl-marker" aria-hidden="true">{done && !current ? <Check size={14} weight="bold" /> : s.n}</span>
                    <div className="pl-body">
                      <div className="pl-title-row">
                        <button className="pl-title" onClick={() => goTo(i)} aria-current={current ? 'step' : undefined}>{s.title}</button>
                        <Actors list={s.actors} labels={data.actors} />
                      </div>
                      <div className="pl-detail" aria-live={current ? 'polite' : undefined}>
                        <p>{s.text}</p>
                        <p className="pl-deliv"><b>›</b> {data.deliverableLabel}: <span>{s.deliverable}</span></p>
                      </div>
                      <Screen step={s} url={data.screenUrl} className="pl-screen-inline" />
                    </div>
                  </li>
                )
              })}
            </ol>
            <div className="pl-stage">
              <Screen key={active} step={steps[active]} url={data.screenUrl} className="pl-enter" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
