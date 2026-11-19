import {
  SquaresFour, ChatsCircle, Circle, GraduationCap, Stethoscope, Door, Briefcase, UserCircle, Storefront,
} from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { useScrollProgress } from '@/lib/useScrollProgress'

// Nº 01 · o que é. A definição é a do documento consolidado, palavra por
// palavra; os [colchetes] em content.json só marcam quais palavras viram chip.
// A leitura acende conforme a rolagem, igual à frase dos retalhos.
const ICONS = { SquaresFour, ChatsCircle, GraduationCap, Stethoscope, Door, Briefcase, UserCircle, Storefront }

function tokenize(text) {
  const out = []
  text.split(/(\[[^\]]+\])/).filter(Boolean).forEach((part) => {
    if (part.startsWith('[')) { out.push({ chip: part.slice(1, -1), tail: '' }); return }
    const m = part.match(/^([.,;:!?]+)/)
    let rest = part
    if (m && out.length && out[out.length - 1].chip) { out[out.length - 1].tail = m[1]; rest = part.slice(m[1].length) }
    rest.split(/\s+/).filter(Boolean).forEach((w) => out.push({ word: w }))
  })
  return out
}

export default function What() {
  const w = content.what
  const tokens = tokenize(w.statement)
  const [ref, progress] = useScrollProgress()
  const lit = Math.ceil(progress * tokens.length)

  return (
    <section id="o-que-e" data-theme="dark" className="section what" aria-labelledby="what-t">
      <div className="wrap">
        <div className="problem-top">
          <p className="label" data-reveal><b aria-hidden="true">&gt;</b> {w.label}</p>
          <h2 id="what-t" ref={ref} className="statement" aria-label={w.statement.replace(/[[\]]/g, '')}>
            {tokens.map((t, i) => {
              const on = i < lit ? ' is-lit' : ''
              if (t.word) return <span key={i} className={`w${on}`} aria-hidden="true">{t.word} </span>
              const Icon = ICONS[w.chips[t.chip]] ?? Circle
              return (
                <span key={i} className="chip-wrap" aria-hidden="true"><span className={`chip${on}`}>
                  <Icon size="0.9em" weight="regular" aria-hidden="true" />{t.chip}
                </span>{t.tail && <span className={`w${on}`}>{t.tail}</span>} </span>
              )
            })}
          </h2>
          <p className="problem-aside" data-reveal>{w.aside}</p>

          <div className="what-segs" data-reveal>
            <p className="label"><b aria-hidden="true">&gt;</b> {w.segmentsLabel}</p>
            <ul>
              {w.segments.map((s, i) => {
                const Icon = ICONS[s.icon] ?? Circle
                return (
                  <li key={s.label}>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    <Icon size={18} aria-hidden="true" />
                    <span>{s.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
