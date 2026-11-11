import { WhatsappLogo, EnvelopeSimple, MapPin, ArrowRight } from '@phosphor-icons/react'
import { content, whatsappWith, mailHref } from '@/lib/content'

// Rodapé com a ilustração carmesim (terminais entre a mata) emendando no fundo
export default function Footer() {
  const f = content.footer
  const s = content.site
  const mail = mailHref()
  return (
    <footer data-theme="dark" className="foot">
      <div className="foot-body" style={{ '--foot-art': `url(${f.image})` }}>
        <div className="wrap foot-grid">
          <div className="foot-brand">
            <a href="/" aria-label="Atelierin, início"><img src="/brand/atelierin-horizontal-osso-terminal-crimson.svg" alt="Atelierin" height="30" /></a>
            <p>{f.text}</p>
          </div>
          {f.cols.map((col) => (
            <nav key={col.title} className="foot-col" aria-label={col.title}>
              <strong>{col.title}</strong>
              <ul>{col.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
            </nav>
          ))}
          <div className="foot-col foot-contact">
            <strong>{f.contactTitle}</strong>
            <ul>
              <li><a href={whatsappWith(s.whatsappMessage)} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={15} weight="fill" /> {s.whatsappDisplay}</a></li>
              {mail && <li><a href={mail}><EnvelopeSimple size={15} /> {s.contactEmail}</a></li>}
              <li><span><MapPin size={15} /> {f.place}</span></li>
            </ul>
            <a href={whatsappWith(s.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="foot-cta">{f.cta} <ArrowRight size={14} weight="bold" /></a>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="wrap foot-bottom-in">
            <span>© {new Date().getFullYear()} Atelierin</span>
            <span>{f.credit}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
