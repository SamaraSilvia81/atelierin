import { content } from '@/lib/content'
import LoginShowcase from '@/components/LoginShowcase'

// "A marca é sua": a vitrine de telas de login ocupa a seção inteira.
export default function Custom() {
  const c = content.custom
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
      </div>
    </section>
  )
}
