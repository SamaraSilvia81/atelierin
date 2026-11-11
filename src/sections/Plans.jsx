import { Check } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import Section from '@/components/Section'
import Button from '@/components/Button'

export default function Plans() {
  const p = content.plans
  return (
    <Section id="planos" theme="light" piece={p.piece} title={p.title} accent={p.titleAccent} lede={p.lede}>
      <ul className="plans">
        {p.items.map((it) => (
          <li key={it.name} className={`plan ${it.highlight ? 'is-hi' : ''}`} data-reveal>
            <span className="plan-hole" aria-hidden="true" />
            <span className="plan-status">{it.status}</span>
            <h3 className="display">{it.name}</h3>
            <p>{it.text}</p>
            <ul>{it.features.map((f) => <li key={f}><Check size={16} aria-hidden="true" />{f}</li>)}</ul>
            <Button href={it.cta.href} variant={it.highlight ? 'primary' : 'ghost'}>{it.cta.label}</Button>
          </li>
        ))}
      </ul>
    </Section>
  )
}
