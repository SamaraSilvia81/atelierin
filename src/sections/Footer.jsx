import { content } from '@/lib/content'

export default function Footer() {
  const f = content.footer
  return (
    <footer data-theme="dark" className="foot">
      <div className="wrap foot-in">
        <img src="/brand/atelierin-horizontal-osso-terminal-crimson.svg" alt="Atelierin" height="24" />
        <p>{f.text}</p>
        <p className="foot-meta">© {new Date().getFullYear()} Atelierin · {f.place} · {f.credit}</p>
      </div>
    </footer>
  )
}
