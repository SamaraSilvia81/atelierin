import { Quotes, WhatsappLogo } from '@phosphor-icons/react'
import { content, whatsappWith } from '@/lib/content'
import PageHead from '@/pages/PageHead'

// Página /fundador: as regras completas do programa cliente fundador.
// Textos em pages.json (founder); desconto, vagas e faixas em content.json.
const brl = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR')

export default function Founder() {
  const a = content.pages.founder
  const f = content.founder
  const { tiers, overLabel } = content.plans.pricing
  const off = 1 - f.discount
  return (
    <div className="page page-founder">
      <section data-theme="dark" className="section founder-hero">
        {/* lado direito com a textura topográfica, como a faixa da proposta */}
        <div className="founder-art" aria-hidden="true">
          <span className="founder-art-band" style={{ backgroundImage: `url(${f.modal?.images?.carmim ?? '/topo-carmim.webp'})` }} />
          <span className="cover-tag">{a.coverTag}</span>
        </div>
        <div className="wrap">
          <PageHead label={a.label} title={a.title} titleAccent={a.titleAccent} lede={a.lede}>
            <dl className="founder-facts">
              {a.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            {!f.open && <p className="founder-closed">{f.closedNote}</p>}
          </PageHead>
        </div>
      </section>

      <section data-theme="light" className="section about-cv">
        <div className="wrap">
          {a.blocks.map((b) => (
            <div key={b.title} className="cv-block" data-reveal>
              <h2 className="display">{b.title}</h2>
              <ol>
                {b.items.map((it) => <li key={it.h}><strong>{it.h}</strong><p>{it.p}</p></li>)}
              </ol>
            </div>
          ))}

          <div className="cv-block" data-reveal>
            <h2 className="display">{a.testimonial.title}</h2>
            <div className="fdr-quote-wrap">
              <p className="fdr-quote-lede">{a.testimonial.lede}</p>
              <figure className="fdr-quote">
                <span className="fdr-quote-tag">{a.testimonial.tag}</span>
                <Quotes size={30} weight="fill" aria-hidden="true" />
                <blockquote>{a.testimonial.quote}</blockquote>
                <figcaption>
                  <span className="fdr-quote-avatar" aria-hidden="true">{a.testimonial.name[0]}</span>
                  <span><b>{a.testimonial.name}</b><small>{a.testimonial.role}</small></span>
                  <em>{a.testimonial.link} →</em>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="cv-block" data-reveal>
            <h2 className="display">{a.tableTitle}</h2>
            <div className="rules founder-table">
              <table>
                <thead><tr><th scope="col">Alunos</th><th scope="col">Tabela</th><th scope="col">Fundador</th></tr></thead>
                <tbody>
                  {tiers.map((t) => (
                    <tr key={t.max}>
                      <th scope="row">{t.label}</th>
                      <td><s>{brl(t.price)}</s></td>
                      <td className="is-acc">{brl(t.price * off)} por mês</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">{overLabel}</th>
                    <td>sob consulta</td>
                    <td className="is-acc">{Math.round(f.discount * 100)}% sobre o combinado</td>
                  </tr>
                </tbody>
              </table>
              <p className="rules-note">{a.tableNote}</p>
            </div>
          </div>

          {f.open && (
            <div className="page-cta" data-reveal>
              <p>{a.cta.text}</p>
              <a href={whatsappWith(f.cta.message)} target="_blank" rel="noopener noreferrer" className="bridge-link">
                <WhatsappLogo size={16} aria-hidden="true" /> {a.cta.label}
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
