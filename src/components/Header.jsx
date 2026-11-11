import { useState, useEffect } from 'react'
import { List, X, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play, setSounds, useSoundsEnabled } from '@/lib/sounds'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const sounds = useSoundsEnabled()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header data-theme="dark" className={`top ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="wrap top-in">
        <a href="#conteudo" className="top-logo" aria-label="Atelierin, início">
          <img src="/brand/atelierin-horizontal-osso-terminal-crimson.svg" alt="Atelierin" height="34" />
        </a>
        <nav id="menu" className="top-nav" aria-label="Principal">
          <ul>
            {content.nav.map((n) => (
              <li key={n.href}><a href={n.href} onPointerEnter={() => play('tick')} onClick={() => { play('click'); setOpen(false) }}>{n.label}</a></li>
            ))}
          </ul>
          <a href={content.navCta.href} className="top-cta" onClick={() => { play('click'); setOpen(false) }}>{content.navCta.label}</a>
        </nav>
        <button
          className="top-sound"
          aria-pressed={sounds}
          aria-label={sounds ? content.a11y.soundOff : content.a11y.soundOn}
          title={sounds ? content.a11y.soundOff : content.a11y.soundOn}
          onClick={() => setSounds(!sounds)}
        >
          {sounds ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />}
        </button>
        <button
          className="top-toggle"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? content.a11y.menuClose : content.a11y.menuOpen}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>
    </header>
  )
}
