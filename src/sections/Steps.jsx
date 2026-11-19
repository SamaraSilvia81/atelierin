import { ArrowDown, ArrowRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'
import Pipeline from '@/components/Pipeline'

// Passo a passo de como o ambiente fica pronto, em fundo claro, emendando com "As linhas".
export default function Steps() {
  const h = content.how
  return (
    <section id="passo-a-passo" data-theme="light" className="section steps-sec" aria-label={h.steps.title}>
      <div className="wrap">
        <Pipeline data={h.steps} />
        {h.steps.sobMedida && (
          <p className="steps-sm" data-reveal>
            {h.steps.sobMedida.text}{' '}
            <a href={h.steps.sobMedida.href} onClick={() => play('click')} onPointerEnter={() => play('tick')}>{h.steps.sobMedida.link} <ArrowRight size={13} weight="bold" aria-hidden="true" /></a>
          </p>
        )}
        <div className="bridge" data-reveal>
          <span className="bridge-tape" aria-hidden="true">{Array.from({ length: 21 }, (_, i) => <i key={i} />)}</span>
          <span className="bridge-label"><b aria-hidden="true">&gt;</b> {h.bridge.label}</span>
          <p>{h.bridge.text} <em>{h.bridge.textAccent}</em> {h.bridge.textAfter}</p>
          <a href={h.bridge.href} className="bridge-link" onClick={() => play('click')} onPointerEnter={() => play('tick')}>
            {h.bridge.link} <ArrowDown size={14} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
