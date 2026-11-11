import { Palette, ToggleRight, Receipt, UsersThree, Sparkle } from '@phosphor-icons/react'

// Ícones disponíveis para o campo "icon" em content.json (custom.features)
const ICONS = { Palette, ToggleRight, Receipt, UsersThree, Sparkle }
import { content } from '@/lib/content'
import Section from '@/components/Section'

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

        <figure className="mock" data-reveal aria-label="Exemplo de ambiente com a marca do profissional">
          <div className="mock-bar"><span /><span /><span /><code>seunome.atelierin.com.br</code></div>
          <div className="mock-body">
            <aside className="mock-side">
              <span className="mock-brand">{c.mock.name}</span>
              <ul>{c.mock.items.map((m, i) => <li key={m} className={i === 3 ? 'on' : ''}>{m}</li>)}</ul>
            </aside>
            <div className="mock-main">
              <span className="mock-h">Financeiro · novembro</span>
              {[['Ana', 'em dia'], ['Bruno', 'pendente'], ['Carla', 'em dia'], ['Diego', 'atrasado']].map(([n, s]) => (
                <div key={n} className="mock-row"><span>{n}</span><b className={`st st-${s.replace(' ', '-')}`}>{s}</b></div>
              ))}
            </div>
          </div>
          <figcaption className="mock-foot">{c.mock.footer} <strong>Atelierin</strong></figcaption>
        </figure>
      </div>
    </Section>
  )
}
