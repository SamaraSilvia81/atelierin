import { useRef } from 'react'
import {
  SquaresFour, ChatsCircle, Devices, Circle, GraduationCap, Stethoscope, Door, Briefcase, UserCircle, Storefront,
  ArrowLeft, ArrowRight,
} from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { useScrollProgress } from '@/lib/useScrollProgress'

// Nº 01 · o que é. A definição é a do documento consolidado, palavra por
// palavra; os [colchetes] em content.json só marcam quais palavras viram chip.
// Depois vem um carrossel com os segmentos do documento.
const ICONS = { SquaresFour, ChatsCircle, Devices, GraduationCap, Stethoscope, Door, Briefcase, UserCircle, Storefront }
const Ico = (name) => ICONS[name] ?? Circle

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

// A frase acendendo palavra por palavra, igual à dos retalhos
function Lit({ w, className = '' }) {
  const tokens = tokenize(w.statement)
  const [ref, progress] = useScrollProgress()
  const lit = Math.ceil(progress * tokens.length)
  return (
    <h2 id="what-t" ref={ref} className={`statement ${className}`} aria-label={w.statement.replace(/[[\]]/g, '')}>
      {tokens.map((t, i) => {
        const on = i < lit ? ' is-lit' : ''
        if (t.word) return <span key={i} className={`w${on}`} aria-hidden="true">{t.word} </span>
        const Icon = Ico(w.chips[t.chip])
        return (
          <span key={i} className="chip-wrap" aria-hidden="true"><span className={`chip${on}`}>
            <Icon size="0.9em" weight="regular" aria-hidden="true" />{t.chip}
          </span>{t.tail && <span className={`w${on}`}>{t.tail}</span>} </span>
        )
      })}
    </h2>
  )
}

// Carrossel simples: rola com o dedo/trackpad e tem setas sempre visíveis
function Carousel({ w, children, className = '' }) {
  const ref = useRef(null)
  const go = (dir) => {
    const el = ref.current; if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * ((card?.offsetWidth || 300) + 16), behavior: 'smooth' })
  }
  return (
    <div className={`wcar ${className}`.trim()}>
      <ul ref={ref} className="wcar-track">{children}</ul>
      <div className="wcar-nav">
        <button type="button" onClick={() => go(-1)} aria-label={w.carouselPrev}><ArrowLeft size={16} aria-hidden="true" /></button>
        <button type="button" onClick={() => go(1)} aria-label={w.carouselNext}><ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
  )
}

const num = (i) => String(i + 1).padStart(2, '0')

export default function What() {
  const w = content.what
  return (
    <section id="o-que-e" data-theme="dark" className="section what" aria-labelledby="what-t">
      <div className="wrap">
        <div className="problem-top">
          <p className="label" data-reveal><b aria-hidden="true">&gt;</b> {w.label}</p>
          <Lit w={w} />
        </div>
        <div className="wa-segs" data-reveal>
          <p className="label"><b aria-hidden="true">&gt;</b> {w.segmentsLabel}</p>
          <Carousel w={w}>
            {w.segments.map((s, i) => {
              const Icon = Ico(s.icon)
              return (
                <li key={s.label} className={`wa-card ${i === 0 ? 'is-acc' : ''}`}>
                  <small>{num(i)}</small>
                  <Icon size={34} weight="light" aria-hidden="true" />
                  <strong>{s.label}</strong>
                </li>
              )
            })}
          </Carousel>
        </div>
      </div>
    </section>
  )
}
