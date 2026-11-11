import { useState } from 'react'
import { ArrowDown } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'

// Como funciona: as três camadas, um painel de módulos que liga e desliga
// de verdade, o passo a passo da implantação e a ponte para "As linhas".
export default function How() {
  const h = content.how
  const m = h.modules
  const [on, setOn] = useState(() => Object.fromEntries(m.items.map((i) => [i.id, i.on])))
  const active = m.items.filter((i) => on[i.id])

  return (
    <section id="como-funciona" data-theme="dark" className="section how" aria-labelledby="como-funciona-t">
      <div className="wrap">
        <header className="how-head" data-reveal>
          <p className="label piece"><b aria-hidden="true">&gt;</b> {h.label}</p>
          <h2 id="como-funciona-t" className="display">{h.title} <em>{h.titleAccent}</em></h2>
          <p className="lede">{h.lede}</p>
        </header>

        {/* camadas */}
        <ol className="layers">
          {h.layers.map((l, i) => (
            <li key={l.name} className={`layer layer-${i + 1}`} data-reveal>
              <span className="layer-bar" aria-hidden="true" />
              <div className="layer-top">
                <span className="layer-n">{l.n}</span>
                <span className="layer-kicker">{l.kicker}</span>
              </div>
              <h3 className="display">{l.name}</h3>
              <p>{l.text}</p>
              <ul>{l.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </li>
          ))}
        </ol>

        {/* módulos: painel interativo */}
        <div className="mods" data-reveal>
          <div className="mods-copy">
            <h3 className="display">{m.title}</h3>
            <p>{m.text}</p>
          </div>
          <div className="mods-panel" role="group" aria-label="Módulos do ambiente">
            <div className="mods-bar">
              <span className="dots" aria-hidden="true"><i /><i /><i /></span>
              <code>{m.address}</code>
              <span className="mods-count"><b>{active.length}</b> {m.activeLabel}</span>
            </div>
            <ul>
              {m.items.map((it) => (
                <li key={it.id}>
                  <button
                    className={`mod ${on[it.id] ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={on[it.id]}
                    onClick={() => { play('click'); setOn((s) => ({ ...s, [it.id]: !s[it.id] })) }}
                    onPointerEnter={() => play('tick')}
                  >
                    <span className="mod-txt"><strong>{it.label}</strong><small>{it.note}</small></span>
                    <span className="switch" aria-hidden="true"><i /></span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mods-log" aria-live="polite">
              <b>›_</b> {active.length ? `menu: ${active.map((a) => a.label.toLowerCase()).join(' · ')}` : 'nenhum módulo ativo'}
            </p>
          </div>
        </div>

        {/* passo a passo */}
        <div className="steps" data-reveal>
          <h3 className="steps-title">{h.steps.title}</h3>
          <ol>
            {h.steps.items.map((s) => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="bridge" data-reveal>
          <p>{h.bridge.text}</p>
          <a href={h.bridge.href} className="bridge-link" onClick={() => play('click')} onPointerEnter={() => play('tick')}>
            {h.bridge.link} <ArrowDown size={14} weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
