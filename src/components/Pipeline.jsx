import { useRef } from 'react'
import { Check } from '@phosphor-icons/react'
import { useStickyProgress } from '@/lib/useStickyProgress'
import { play } from '@/lib/sounds'

// Moldura de navegador com a imagem do passo (no desenho do Atelier.sh)
function Screen({ step, url, note, className = '' }) {
  return (
    <figure className={`pl-screen ${className}`}>
      <div className="pl-screen-bar" aria-hidden="true">
        <span className="dots"><i /><i /><i /></span>
        <code>{url}</code>
      </div>
      <img src={step.image.src} alt={step.image.alt} loading="lazy" />
      {step.image.src.includes('picsum') && <figcaption>{note}</figcaption>}
    </figure>
  )
}

// Pipeline em linha do tempo presa na tela (como a da Check.AI): enquanto a
// pessoa rola, o passo ativo abre e a imagem dele aparece à direita.
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
    <div ref={ref} className={`pipeline ${reduced ? 'is-reduced' : ''}`} style={{ '--n': steps.length }}>
      <div className="pipeline-pin">
        <div className="pipeline-head">
          <p className="label"><b aria-hidden="true">&gt;</b> {data.label}</p>
          <h3 className="display">{data.title}</h3>
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
                  <span className="pl-marker" aria-hidden="true">{done ? <Check size={14} weight="bold" /> : s.n}</span>
                  <div className="pl-body">
                    <button className="pl-title" onClick={() => goTo(i)} aria-current={current ? 'step' : undefined}>{s.title}</button>
                    <div className="pl-detail" aria-live={current ? 'polite' : undefined}>
                      <p>{s.text}</p>
                      <code>{s.meta}</code>
                    </div>
                    <Screen step={s} url={data.screenUrl} note={data.placeholderNote} className="pl-screen-inline" />
                  </div>
                </li>
              )
            })}
          </ol>
          <div className="pl-stage">
            <Screen key={active} step={steps[active]} url={data.screenUrl} note={data.placeholderNote} className="pl-enter" />
          </div>
        </div>
      </div>
    </div>
  )
}
