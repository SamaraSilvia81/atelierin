import { content } from '@/lib/content'
import Section from '@/components/Section'

export default function Problem() {
  const p = content.problem
  return (
    <Section id="problema" theme="light" piece={p.piece} title={p.title} accent={p.titleAccent} lede={p.lede}>
      <ul className="scraps">
        {p.scraps.map((s, i) => (
          <li key={s.label} className="scrap" style={{ '--tilt': `${[-2.5, 1.8, -1, 2.4, -1.8][i % 5]}deg` }} data-reveal>
            <span className="scrap-n">0{i + 1}</span>
            <strong>{s.label}</strong>
            <span>{s.note}</span>
          </li>
        ))}
      </ul>
      <p className="closing" data-reveal>{p.closing}</p>
    </Section>
  )
}
