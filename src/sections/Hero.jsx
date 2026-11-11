import { content } from '@/lib/content'
import Button from '@/components/Button'
import Ruler from '@/components/Ruler'

export default function Hero() {
  const h = content.hero
  return (
    <section data-theme="dark" className="hero" aria-labelledby="hero-t">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="piece" data-reveal><span className="piece-dot" aria-hidden="true" />{h.piece}</p>
          <p className="prompt" data-reveal><span className="prompt-sign">&gt;</span> {h.prompt}<span className="cursor" aria-hidden="true">_</span></p>
          <h1 id="hero-t" className="display hero-title" data-reveal>
            <span>{h.titleLine1}</span>
            <em>{h.titleLine2}</em>
          </h1>
          <p className="lede" data-reveal>{h.lede}</p>
          <div className="actions" data-reveal>
            <Button href={h.primary.href}>{h.primary.label}</Button>
            <Button href={h.secondary.href} variant="ghost">{h.secondary.label}</Button>
          </div>
          <ul className="tags" data-reveal>
            {h.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        <figure className="hero-pattern" data-reveal aria-hidden="true">
          <div className="pattern-piece">
            <span className="pattern-label">molde · ambiente 01</span>
            <img src="/brand/atelierin-simbolo-osso-terminal-crimson.svg" alt="" className="pattern-mark" />
            <span className="pattern-address">{h.address}</span>
            <span className="notch notch-a" /><span className="notch notch-b" /><span className="notch notch-c" />
          </div>
        </figure>
      </div>
      <div className="wrap"><Ruler /></div>
    </section>
  )
}
