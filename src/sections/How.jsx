import { content } from '@/lib/content'
import Section from '@/components/Section'

export default function How() {
  const h = content.how
  return (
    <Section id="como-funciona" theme="dark" piece={h.piece} title={h.title} accent={h.titleAccent} lede={h.lede}>
      <ol className="layers">
        {h.layers.map((l) => (
          <li key={l.name} className="layer" data-reveal>
            <span className="layer-tag">{l.tag}</span>
            <h3 className="display layer-name">{l.name}</h3>
            <p>{l.text}</p>
            <ul>{l.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
