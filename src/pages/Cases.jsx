import { content } from '@/lib/content'
import PageHead from '@/pages/PageHead'

// Estudos de caso: um bloco por sistema já feito
export default function Cases() {
  const c = content.pages.cases
  return (
    <div className="page page-cases">
      {/* hero: o primeiro sistema já aparece aberto, numa janela de navegador */}
      <section data-theme="dark" className="section cases-hero">
        <div className="wrap cases-hero-grid">
          <PageHead label={c.label} title={c.title} lede={c.lede}>
            <ol className="cases-index">
              {c.items.map((it, i) => (
                <li key={it.id}><a href={`#${it.id}`}><b>{String(i + 1).padStart(2, '0')}</b><span>{it.name}<small>{it.tag}</small></span></a></li>
              ))}
            </ol>
          </PageHead>
          {c.items[0] && (
            <a href={`#${c.items[0].id}`} className="cases-window" data-reveal aria-label={`Ver o caso ${c.items[0].name}`}>
              <span className="cases-window-bar" aria-hidden="true"><i /><i /><i /><em>{c.items[0].host ?? 'atelier.sh'}</em></span>
              <img src={c.items[0].image} alt={c.items[0].imageAlt} />
              <span className="cases-window-tag">em uso · {c.items[0].meta?.[0]?.[1]}</span>
            </a>
          )}
        </div>
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
            <div className="wrap">
              <div className="case-story">
                {it.sections.map((s, i) => (
                  <div key={s.h} className="case-part" data-reveal>
                    <span className="case-n">0{i + 1}</span>
                    <h3 className="display">{s.h}</h3>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
              <div className="case-feats" data-reveal>
                <strong>O que o sistema faz</strong>
                <ul>{it.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            </div>
          </section>
        </article>
      ))}
      <section data-theme="light" className="section cases-next">
        <div className="wrap page-cta" data-reveal>
          <p>{c.next.text}</p>
          <div className="page-cta-acts">
            <a href={c.next.href} className="bridge-link">{c.next.label}</a>
            {c.next.second && <a href={c.next.second.href} className="bridge-link is-outline">{c.next.second.label}</a>}
          </div>
        </div>
      </section>
    </div>
  )
}
