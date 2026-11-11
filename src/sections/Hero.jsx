import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { useHeroLayout } from '@/lib/useHeroLayout'
import { play } from '@/lib/sounds'

// Hero "mesa de trabalho": a foto ocupa a tela inteira e o texto vive DENTRO
// do monitor. O palco (.stage) mantém a proporção da foto e cobre a tela como
// object-fit: cover, então as porcentagens da tela do monitor continuam
// batendo em qualquer tamanho. A posição de cada bloco vem de hero.layout
// (content.json) e pode ser ajustada arrastando em /?editar.
// Em telas em pé o texto sai do monitor e fica empilhado no centro.
const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 30)

export default function Hero() {
  const h = content.hero
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const { layout, editing, toggle, selected, screenRef, bind, reset, copy } = useHeroLayout(h.layout)
  const devTools = import.meta.env.DEV
  const address = `${slug(name) || h.addressPlaceholder}${h.addressSuffix}`

  const pos = (id, delay) => ({
    className: `el el-${id} h-in`,
    style: { '--x': `${layout[id].x}%`, '--y': `${layout[id].y}%`, '--s': layout[id].s ?? 1, '--d': delay },
    'data-el': id,
    ...bind(id),
  })

  const onSubmit = (e) => {
    e.preventDefault()
    if (editing) return
    play('click')
    const digits = String(content.site.whatsapp).replace(/\D/g, '')
    if (!digits) { document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' }); return }
    const text = h.ctaMessage.replace('{endereco}', address)
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <section data-theme="dark" className={`hero-desk ${editing ? 'is-editing' : ''}`} aria-labelledby="hero-t">
      <div className="stage" aria-hidden="true">
        <picture>
          <source srcSet={h.image} type="image/webp" />
          <img src={h.imageFallback} alt={h.imageAlt} className="stage-img" fetchpriority="high" />
        </picture>
      </div>

      <div className="stage stage-ui">
        <div className="screen" ref={screenRef}>
          <div {...pos('badge', '.2s')}>
            <p className="badge"><b aria-hidden="true">&gt;</b>{h.badge}</p>
          </div>
          <div {...pos('title', '.3s')}>
            <h1 id="hero-t" className="h-title">
              <span>{h.titleLine1}</span>
              <span className="h-fade">{h.titleLine2}</span>
            </h1>
          </div>
          <div {...pos('lede', '.45s')}>
            <p className="h-lede">{h.lede}</p>
          </div>
          <div {...pos('address', '.6s')}>
            <form className="address" onSubmit={onSubmit}>
              <label htmlFor="hero-name" className="sr-only">{h.addressLabel}</label>
              <span className="address-field">
                <b className="address-prompt" aria-hidden="true">{h.addressPrompt}</b>
                <input
                  id="hero-name"
                  value={name}
                  onChange={(e) => { play('key'); setName(e.target.value) }}
                  maxLength={30}
                  placeholder={h.addressPlaceholder}
                  autoComplete="off"
                  spellCheck="false"
                  tabIndex={editing ? -1 : undefined}
                  style={{ width: `${Math.max((slug(name) || h.addressPlaceholder).length, 4)}ch` }}
                />
                <span className="address-suffix">{h.addressSuffix}</span>
              </span>
              <button type="submit" tabIndex={editing ? -1 : undefined}>
                {h.cta}<ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {editing && (
        <div className="edit-panel" role="region" aria-label="Modo de edição do hero">
          <strong>Modo edição {selected && <em>· {selected}</em>}</strong>
          <span>Arraste os blocos (grudam no centro, Alt solta livre). Clique para selecionar: setas movem, Shift + setas move mais, + e - mudam o tamanho, 0 volta ao normal.</span>
          <code>{Object.entries(layout).map(([k, v]) => `${k} ${v.x},${v.y}${v.s !== 1 ? ` ×${v.s}` : ''}`).join(' · ')}</code>
          <div>
            <button onClick={async () => { await copy(); setCopied(true); setTimeout(() => setCopied(false), 1800) }}>
              {copied ? 'Copiado!' : 'Copiar layout'}
            </button>
            <button onClick={reset} className="ghost">Voltar ao do content.json</button>
            {devTools && <button onClick={toggle} className="ghost">Sair</button>}
          </div>
        </div>
      )}
      {devTools && !editing && (
        <button className="edit-fab" onClick={toggle}>Editar layout</button>
      )}
    </section>
  )
}
