import { content } from '@/lib/content'
import PageHead from '@/pages/PageHead'

// Estudos de caso: um bloco por sistema já feito
export default function Cases() {
  const c = content.pages.cases
  return (
    <div className="page page-cases">
      <section data-theme="dark" className="section cases-hero">
        <div className="wrap"><PageHead label={c.label} title={c.title} lede={c.lede} /></div>
      </section>
      {c.items.map((it) => (
        <article key={it.id} id={it.id} className="case">
          <section data-theme="dark" className="section case-top">
            <div className="wrap">
              <div className="case-title" data-reveal>
                <span className="case-tag">{it.tag}</span>
                <h2 className="display">{it.name}</h2>
                <p className="lede">{it.summary}</p>
              </div>
              <figure className="case-shot" data-reveal><img src={it.image} alt={it.imageAlt} /></figure>
              <dl className="case-meta" data-reveal>
                {it.meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </div>
          </section>
          <section data-theme="light" className="section case-body">
            <div className="wrap case-cols">
              <div className="case-story">
                {it.sections.map((s, i) => (
                  <div key={s.h} className="case-part" data-reveal>
                    <span className="case-n">0{i + 1}</span>
                    <h3 className="display">{s.h}</h3>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
              <aside className="case-aside" data-reveal>
                <strong>O que o sistema faz</strong>
                <ul>{it.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </aside>
            </div>
          </section>
        </article>
      ))}
      <section data-theme="dark" className="section cases-next">
        <div className="wrap page-cta" data-reveal>
          <p>{c.next.text}</p>
          <a href={c.next.href} className="bridge-link">{c.next.label}</a>
        </div>
      </section>
    </div>
  )
}
