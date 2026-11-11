import { content } from '@/lib/content'

export default function Footer() {
  const f = content.footer
  return (
    <footer data-theme="dark" className="foot">
      <div className="wrap foot-in">
        <a href="/" aria-label="Atelierin, início"><img src="/brand/atelierin-horizontal-osso-terminal-crimson.svg" alt="Atelierin" height="24" /></a>
        <p>{f.text}</p>
        <ul className="foot-links">{f.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
        <p className="foot-meta">© {new Date().getFullYear()} Atelierin · {f.place} · {f.credit}</p>
      </div>
    </footer>
  )
}
