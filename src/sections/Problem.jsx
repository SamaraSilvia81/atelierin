import { useEffect, useRef, useState } from 'react'
import {
  ChatCircle, FolderSimple, CalendarBlank, Receipt, Circle, Users, FileText, Monitor, Copy, PencilSimple,
  Trash, CaretRight, GitBranch, Plus, ArrowLeft,
} from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { useScrollProgress } from '@/lib/useScrollProgress'
import { play } from '@/lib/sounds'
import Stitch from '@/components/Stitch'

// Ícones disponíveis para problem.chips em content.json
const ICONS = { ChatCircle, FolderSimple, CalendarBlank, Receipt }
const STATUS = { atencao: 'atenção', parado: 'parado', ativo: 'em dia' }

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
function ScrapCard({ s, i, onOpen }) {
  const open = (e) => { play('click'); onOpen(s, e.currentTarget) }
  return (
    <li className={`gcard is-${s.status} is-clickable`} style={{ animationDelay: `${i * 50}ms` }} onPointerEnter={() => play('tick')}
      role="button" tabIndex={0} aria-label={`Abrir ${s.title}`} onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}>
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

const LOOP = 5200 // tempo de cada módulo antes de passar para o próximo

function ModuleBody({ s }) {
  return (
    <div className="gview-body">
      <div className="gview-head">
        <div>
          <h3>{s.title}</h3>
          <p className="gcard-desc">{s.desc}</p>
        </div>
        <span className="gcard-status"><i />{STATUS[s.status]}</span>
      </div>
      <p className="gview-sub"><b>›_</b> {s.detail.title}</p>
      <table className="gview-table">
        <thead><tr>{s.detail.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{s.detail.rows.map((r, k) => (
          <tr key={r.join()} style={{ animationDelay: `${250 + k * 70}ms` }}>
            {r.map((v, j) => <td key={j} className={j === r.length - 1 ? 'st' : undefined}>{v}</td>)}
          </tr>
        ))}</tbody>
      </table>
      <p className="gview-note">{s.detail.note}</p>
    </div>
  )
}

// Módulo aberto: substitui os cards no mesmo lugar, entrando com um recorte
// circular que nasce do card clicado. Depois passa sozinho de um módulo para
// o outro, em loop, com o mesmo recorte e a barra de progresso de
// "A marca é sua". Pausa com o mouse em cima; com "reduzir movimento" não
// troca sozinho. Voltar faz o caminho inverso até os cards.
function ModuleView({ start, all, host, origin, closing, onBack }) {
  const [i, setI] = useState(() => Math.max(0, all.findIndex((m) => m.path === start.path)))
  const [prev, setPrev] = useState(null)
  const [paused, setPaused] = useState(false)
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const go = (k) => { if (k === i) return; setPrev(i); setI(k) }

  useEffect(() => {
    if (paused || reduced || closing) return undefined
    const t = setTimeout(() => go((i + 1) % all.length), LOOP)
    return () => clearTimeout(t)
  }, [i, paused, reduced, closing, all.length])
  useEffect(() => { if (prev === null) return undefined; const t = setTimeout(() => setPrev(null), 1000); return () => clearTimeout(t) }, [prev])

  const s = all[i]
  return (
    <div className={`gview is-${s.status} ${closing ? 'is-closing' : ''}`} style={{ '--cx': origin.x, '--cy': origin.y }}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <span className="gcard-bar" aria-hidden="true" />
      <div className="gview-top">
        <button className="gview-back" onClick={onBack} onPointerEnter={() => play('tick')}><ArrowLeft size={14} weight="bold" aria-hidden="true" /> todos os módulos</button>
        <code key={s.path} className="lgs-url">{host}/{s.path}</code>
      </div>
      <div className="gview-stage">
        {prev !== null && <div className="gview-layer is-out"><ModuleBody s={all[prev]} /></div>}
        <div key={s.path} className={`gview-layer ${prev !== null ? 'is-wipe' : ''}`}><ModuleBody s={s} /></div>
        {!paused && !reduced && !closing && <span key={`p-${i}`} className="gview-progress" aria-hidden="true" />}
      </div>
      <div className="gview-tabs" role="tablist" aria-label="Módulos">
        {all.map((m, k) => (
          <button key={m.path} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''}
            onClick={() => { play('click'); go(k) }} onPointerEnter={() => play('tick')}>
            <i className={`dot-${m.status === 'ativo' ? 'green' : 'amber'}`} />{m.title}
          </button>
        ))}
      </div>
    </div>
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
  const [open, setOpen] = useState(null)
  const [closing, setClosing] = useState(false)
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' })
  const stage = useRef(null)
  const openAt = (s, el) => {
    const st = stage.current?.getBoundingClientRect(); const r = el?.getBoundingClientRect()
    if (st && r) setOrigin({ x: `${((r.left + r.width / 2 - st.left) / st.width) * 100}%`, y: `${((r.top + r.height / 2 - st.top) / st.height) * 100}%` })
    setClosing(false); setOpen(s)
  }
  const back = () => {
    play('click'); setClosing(true)
    setTimeout(() => { setOpen(null); setClosing(false) }, 650)
  }
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') back() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

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
          <p className="pfilters-intro">{p.cardsIntro}</p>
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
            <span><i className="dot-green" />em dia <b>{count('ativo')}</b></span>
            <span><i className="dot-amber" />atenção <b>{count('atencao')}</b></span>
            <code className="pfilters-host">{p.host}</code>
          </div>
        </div>

        <div data-reveal className={`gstage ${open ? 'is-open' : ''} ${closing ? 'is-closing' : ''}`} ref={stage}><ul className="gcards" aria-live="polite" inert={open && !closing ? '' : undefined}>
          {shown.map((s, i) => <ScrapCard key={s.path} s={s} i={i} onOpen={openAt} />)}
          <li className="gcard-add">
            <a href={p.addCard.href} onClick={() => play('click')} onPointerEnter={() => play('tick')}>
              <Plus size={18} aria-hidden="true" />
              <strong>{p.addCard.label}</strong>
              <span>{p.addCard.note}</span>
            </a>
          </li>
        </ul>
        {open && <ModuleView key={open.path} start={open} all={p.scraps} host={p.host} origin={origin} closing={closing} onBack={back} />}
        </div>

        <div className="problem-end">
          <span className="problem-blob" aria-hidden="true" />
          <p data-reveal>{p.closing}</p>
          <div className="stitch-host">
            <Stitch to="#como-funciona h2" />
          </div>
        </div>
      </div>
    </section>
  )
}
