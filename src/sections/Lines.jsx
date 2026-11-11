import { content } from '@/lib/content'
import Section from '@/components/Section'

export default function Lines() {
  const l = content.lines
  return (
    <Section id="linhas" theme="light" piece={l.piece} title={l.title} accent={l.titleAccent} lede={l.lede}>
      <ul className="looks">
        {l.items.map((it) => {
          const live = it.status === 'Disponível'
          return (
            <li key={it.id} className={`look ${live ? 'is-live' : ''}`} data-reveal>
              <div className="look-top">
                <span className="look-piece">{it.piece}</span>
                <span className={`look-status ${live ? 'on' : ''}`}>{it.status}</span>
              </div>
              <img
                className="look-lockup"
                src={`/brand/atelierin-${it.id}-tinta-terminal-crimson.svg`}
                alt={`Atelierin ${it.name}`}
                loading="lazy"
              />
              <p className="look-for">{it.for}</p>
              <p>{it.text}</p>
              <ul className="look-mods">{it.modules.map((m) => <li key={m}>{m}</li>)}</ul>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
