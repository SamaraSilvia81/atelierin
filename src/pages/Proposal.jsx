import { Check } from '@phosphor-icons/react'
import { content, whatsappHref } from '@/lib/content'
import PageHead from '@/pages/PageHead'

// Proposta comercial em "slides" que se lê rolando: cada bloco ocupa
// quase a tela inteira, alternando fundo escuro e claro.
export default function Proposal() {
  const p = content.pages.proposal
  const total = String(p.slides.length).padStart(2, '0')
  return (
    <div className="page page-proposal">
      <section data-theme="dark" className="section slide slide-cover">
        <div className="wrap">
          <PageHead label={p.label} title={p.title} lede={p.lede}>
            <ol className="slide-index">
              {p.slides.map((s, i) => <li key={s.kicker}><a href={`#slide-${i + 1}`}><b>{String(i + 1).padStart(2, '0')}</b> {s.kicker}</a></li>)}
            </ol>
          </PageHead>
        </div>
      </section>
      {p.slides.map((s, i) => {
        const n = String(i + 1).padStart(2, '0')
        const theme = i % 2 === 0 ? 'light' : 'dark'
        return (
          <section key={s.kicker} id={`slide-${i + 1}`} data-theme={theme} className="section slide">
            <div className="wrap slide-grid" data-reveal>
              <div className="slide-side">
                <span className="slide-n">{n}<small>/{total}</small></span>
                <p className="label"><b aria-hidden="true">&gt;</b> {s.kicker}</p>
              </div>
              <div className="slide-main">
                <h2 className="display">{s.title}</h2>
                <p className="slide-text">{s.text}</p>
                {s.points.length > 0 && (
                  <ul className="slide-points">
                    {s.points.map((pt) => <li key={pt}><Check size={16} weight="bold" aria-hidden="true" />{pt}</li>)}
                  </ul>
                )}
                {s.cta && <a href={whatsappHref() === '#contato' ? s.cta.href : whatsappHref()} className="bridge-link slide-cta">{s.cta.label}</a>}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
