import { useEffect, useRef } from 'react'
import {
  SquaresFour, ChatsCircle, Devices, Circle, GraduationCap, Stethoscope, Door, Briefcase, UserCircle, Storefront,
  ArrowLeft, ArrowRight, ArrowUpRight,
} from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { useScrollProgress } from '@/lib/useScrollProgress'
import { useAb } from '@/lib/ab'

// Nº 01 · o que é. A definição é a do documento consolidado, palavra por
// palavra; os [colchetes] em content.json só marcam quais palavras viram chip.
// Três versões em teste A/B (?oquee=a|b|c, ou o painel "Teste A/B" no yarn dev):
//   a · leitura acesa por rolagem, nota ao lado e carrossel de cards grandes
//   b · cards em arco por cima da frase, tudo centralizado
//   c · editorial: frase à esquerda, nota à direita e cards variados em carrossel
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
    <div className={`wcar ${className}`}>
      <ul ref={ref} className="wcar-track">{children}</ul>
      <div className="wcar-nav">
        <button type="button" onClick={() => go(-1)} aria-label={w.carouselPrev}><ArrowLeft size={16} aria-hidden="true" /></button>
        <button type="button" onClick={() => go(1)} aria-label={w.carouselNext}><ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
  )
}

const Label = ({ w }) => <p className="label" data-reveal><b aria-hidden="true">&gt;</b> {w.label}</p>
const num = (i) => String(i + 1).padStart(2, '0')

function VersionA({ w }) {
  return (
    <div className="wrap">
      <div className="problem-top">
        <Label w={w} />
        <Lit w={w} />
        <p className="problem-aside wa-aside" data-reveal>{w.aside}</p>
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
  )
}

function VersionB({ w }) {
  const n = w.segments.length
  return (
    <div className="wrap wb">
      <div className="wb-stage">
        <span className="wb-ring" aria-hidden="true" />
        <ul className="wb-cards">
          {w.segments.map((s, i) => {
            const Icon = Ico(s.icon)
            const a = -66 + (132 / (n - 1)) * i
            return (
              <li key={s.label} className={`wb-card ${i === 2 ? 'is-acc' : ''}`} style={{ '--a': `${a}deg` }}>
                <small>{num(i)}</small>
                <Icon size={26} weight="light" aria-hidden="true" />
                <span>{s.label}</span>
              </li>
            )
          })}
        </ul>
        <div className="wb-center">
          <p className="wb-badge" data-reveal><b aria-hidden="true">&gt;</b> {w.label}</p>
          <Lit w={w} className="wb-statement" />
        </div>
      </div>
      <p className="wb-aside" data-reveal>{w.aside}</p>
    </div>
  )
}

function VersionC({ w }) {
  const card = (c, i) => {
    if (c.type === 'segs') return (
      <li key={i} className="wc-card wc-segs">
        <div className="wc-pills">
          {w.segments.map((s) => { const Icon = Ico(s.icon); return <span key={s.label}><Icon size={14} aria-hidden="true" />{s.label}</span> })}
        </div>
        <div><small>{w.segmentsLabel}</small><b>{String(w.segments.length).padStart(2, '0')}</b></div>
      </li>
    )
    if (c.type === 'families') return (
      <li key={i} className="wc-card wc-acc">
        <small>{c.title}</small><b>{c.n}</b><p>{c.text}</p>
      </li>
    )
    if (c.type === 'address') return (
      <li key={i} className="wc-card wc-img">
        <span className="wc-img-bg" aria-hidden="true" />
        <code>{c.big}</code><p>{c.text}</p>
      </li>
    )
    return (
      <li key={i} className="wc-card wc-link">
        <a href={c.href}><strong>{c.title}</strong><span>{c.text}<ArrowUpRight size={14} aria-hidden="true" /></span></a>
      </li>
    )
  }
  return (
    <div className="wrap">
      <div className="wc-top">
        <Label w={w} />
        <Lit w={w} className="wc-statement" />
        <p className="wc-aside" data-reveal>{w.aside}</p>
      </div>
      <div data-reveal><Carousel w={w} className="wc-car">{w.cardsC.map(card)}</Carousel></div>
    </div>
  )
}

export default function What() {
  const w = content.what
  const v = useAb('oquee', w.variant || 'a')
  const View = { a: VersionA, b: VersionB, c: VersionC }[v] ?? VersionA
  // ao trocar de versão, os blocos novos já entram visíveis (o useReveal só
  // observa o que existia quando a página abriu)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    document.querySelectorAll('#o-que-e [data-reveal]').forEach((el) => el.classList.add('is-in'))
  }, [v])
  return (
    <section id="o-que-e" data-theme="dark" className={`section what what-${v}`} aria-labelledby="what-t">
      <View w={w} />
    </section>
  )
}
