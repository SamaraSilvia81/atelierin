import { useState } from 'react'
import {
  ChatCircle, FolderSimple, CalendarBlank, Receipt, Circle, Users, FileText, Monitor, Copy, PencilSimple,
  Trash, CaretRight, GitBranch, Plus,
} from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { useScrollProgress } from '@/lib/useScrollProgress'
import { play } from '@/lib/sounds'
import Stitch from '@/components/Stitch'

// Ícones disponíveis para problem.chips em content.json
const ICONS = { ChatCircle, FolderSimple, CalendarBlank, Receipt }
const STATUS = { atencao: 'atenção', parado: 'parado', ativo: 'ativo' }

// Quebra o texto em palavras; trechos entre [colchetes] viram chips com ícone.
function tokenize(text) {
  const out = []
  text.split(/(\[[^\]]+\])/).filter(Boolean).forEach((part) => {
    if (part.startsWith('[')) { out.push({ chip: part.slice(1, -1), tail: '' }); return }
    // pontuação colada logo depois de um chip fica junto dele (sem espaço antes)
    const m = part.match(/^([.,;:!?]+)/)
    let rest = part
    if (m && out.length && out[out.length - 1].chip) { out[out.length - 1].tail = m[1]; rest = part.slice(m[1].length) }
    rest.split(/\s+/).filter(Boolean).forEach((w) => out.push({ word: w }))
  })
  return out
}

// Card no mesmo desenho dos cards de grupo do Atelier.sh
function ScrapCard({ s, i }) {
  return (
    <li className={`gcard is-${s.status}`} style={{ animationDelay: `${i * 50}ms` }} onPointerEnter={() => play('tick')}>
      <span className="gcard-bar" aria-hidden="true" />
      <div className="gcard-head">
        <div className="gcard-id">
          <h3>{s.title} <span className="gcard-count" aria-hidden="true"><Users size={10} /> {s.count}</span></h3>
          <p className="gcard-desc">{s.desc}</p>
        </div>
        <div className="gcard-side">
          <span className="gcard-status"><i />{STATUS[s.status]}</span>
          <span className="gcard-actions" aria-hidden="true">
            <i><FileText size={11} /></i><i><Monitor size={11} /></i><i><Copy size={11} /></i><i><PencilSimple size={11} /></i><i className="danger"><Trash size={11} /></i>
          </span>
        </div>
      </div>
      <span className="gcard-rule" aria-hidden="true" />
      <div className="gcard-log">
        <p><b>›_</b> <span>{s.log}</span></p>
        <small>{s.logMeta}</small>
      </div>
      <div className="gcard-group">
        <span className="gcard-label">{s.group}</span>
        <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
      </div>
      <div className="gcard-foot">
        <span><GitBranch size={10} aria-hidden="true" /> {s.source}</span>
        <span className="gcard-more">{s.foot} <CaretRight size={11} aria-hidden="true" /></span>
      </div>
    </li>
  )
}

export default function Problem() {
  const p = content.problem
  const tokens = tokenize(p.statement)
  const [ref, progress] = useScrollProgress()
  const lit = Math.ceil(progress * tokens.length)
  const [filter, setFilter] = useState('todos')
  const shown = p.scraps.filter((s) => filter === 'todos' || s.status === filter)
  const count = (id) => p.scraps.filter((s) => s.status === id).length

  return (
    <section id="problema" data-theme="dark" className="section problem" aria-labelledby="problema-t">
      <div className="wrap">
        <div className="problem-top">
          <p className="label" data-reveal><b aria-hidden="true">&gt;</b> {p.label}</p>
          <h2 id="problema-t" ref={ref} className="statement">
            {tokens.map((t, i) => {
              const on = i < lit ? ' is-lit' : ''
              if (t.word) return <span key={i} className={`w${on}`}>{t.word} </span>
              const Icon = ICONS[p.chips[t.chip]] ?? Circle
              return (
                <span key={i} className="chip-wrap"><span className={`chip${on}`}>
                  <Icon size="0.9em" weight="regular" aria-hidden="true" />{t.chip}
                </span>{t.tail && <span className={`w${on}`}>{t.tail}</span>} </span>
              )
            })}
          </h2>
          <p className="problem-aside" data-reveal>{p.aside}</p>
        </div>

        {/* barra de filtros igual à do Atelier.sh */}
        <div className="pfilters" data-reveal>
          <div className="pfilters-row">
            <div role="group" aria-label="Filtrar retalhos">
              {p.filters.map((f) => (
                <button key={f.id} className={`filter-btn ${filter === f.id ? 'active' : ''}`} aria-pressed={filter === f.id}
                  onClick={() => { play('click'); setFilter(f.id) }} onPointerEnter={() => play('tick')}>
                  // {f.label}
                </button>
              ))}
            </div>
            <span className="pfilters-count"><b>{shown.length}</b> {p.countLabel}</span>
          </div>
          <div className="pfilters-stats" aria-hidden="true">
            <span><i className="dot-red" />total <b>{p.scraps.length}</b></span>
            <span><i className="dot-amber" />atenção <b>{count('atencao')}</b></span>
            <span><i className="dot-dim" />parados <b>{count('parado')}</b></span>
          </div>
        </div>

        <div data-reveal><ul className="gcards" aria-live="polite">
          {shown.map((s, i) => <ScrapCard key={s.path} s={s} i={i} />)}
          <li className="gcard-add">
            <a href={p.addCard.href} onClick={() => play('click')} onPointerEnter={() => play('tick')}>
              <Plus size={18} aria-hidden="true" />
              <strong>{p.addCard.label}</strong>
              <span>{p.addCard.note}</span>
            </a>
          </li>
        </ul></div>

        <div className="problem-end">
          <span className="problem-blob" aria-hidden="true" />
          <p data-reveal>{p.closing}</p>
          <div className="stitch-host">
            <Stitch to="#como-funciona .piece" />
          </div>
        </div>
      </div>
    </section>
  )
}
