import { ArrowRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'
import LoginShowcase from '@/components/LoginShowcase'

// Sob medida: serviço opcional, pago uma vez. A vitrine de telas de login
// mostra o que muda, e logo abaixo vêm os degraus de preço.
export default function Custom() {
  const c = content.custom
  const pr = c.pricing
  return (
    <section id="sob-medida" data-theme="dark" className="section custom" aria-labelledby="sob-medida-t">
      <div className="wrap">
        <header className="custom-head" data-reveal>
          <div>
            <p className="label"><b aria-hidden="true">&gt;</b> {c.piece}</p>
            <h2 id="sob-medida-t" className="display">{c.title} <em>{c.titleAccent}</em></h2>
          </div>
          <p className="lede">{c.lede}</p>
        </header>
        <div data-reveal><LoginShowcase data={c.showcase} /></div>

        {pr && (
          <div className="sm-pricing" data-reveal>
            <p className="label"><b aria-hidden="true">&gt;</b> {pr.label}</p>
            <ol className="sm-steps">
              {pr.steps.map((s, i) => (
                <li key={s.name} className={i === 0 ? 'is-acc' : undefined}>
                  <b>{s.name}</b>
                  <span>{s.text}</span>
                  <strong>{s.price}</strong>
                  <small>{s.total || '\u00a0'}</small>
                </li>
              ))}
            </ol>
            <div className="sm-foot">
              <p>{pr.note}</p>
              {pr.cta && <a href={pr.cta.href} className="sm-cta" onClick={() => play('click')} onPointerEnter={() => play('tick')}>{pr.cta.label} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
