import { Plus } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import Section from '@/components/Section'

export default function Faq() {
  const f = content.faq
  return (
    <Section id="duvidas" theme="dark" piece={f.piece} title={f.title}>
      <div className="faq">
        {f.items.map((it) => (
          <details key={it.q} className="faq-item" data-reveal>
            <summary>{it.q}<Plus size={18} aria-hidden="true" /></summary>
            <p>{it.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
