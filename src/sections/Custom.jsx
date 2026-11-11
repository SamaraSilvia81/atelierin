import { Palette, ToggleRight, Receipt, UsersThree, Sparkle } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import Section from '@/components/Section'
import BrandMorph from '@/components/BrandMorph'

// Ícones disponíveis para o campo "icon" em content.json (custom.features)
const ICONS = { Palette, ToggleRight, Receipt, UsersThree, Sparkle }

export default function Custom() {
  const c = content.custom
  return (
    <Section id="sob-medida" theme="dark" piece={c.piece} title={c.title} accent={c.titleAccent} lede={c.lede}>
      <div className="custom-grid">
        <ul className="features">
          {c.features.map((f) => {
            const Icon = ICONS[f.icon] ?? Sparkle
            return (
              <li key={f.title} className="feature" data-reveal>
                <Icon size={24} weight="light" aria-hidden="true" />
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <div data-reveal><BrandMorph data={c.morph} /></div>
      </div>
    </Section>
  )
}
