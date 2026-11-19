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
  const open = (e) => { play('click'); onOpen(s, e?.currentTarget) }
  return (
    <li data-path={s.path} className={`gcard is-${s.status} is-clickable`} style={{ animationDelay: `${i * 50}ms` }} onPointerEnter={() => play('tick')}
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
      <p className="gview-sub"><b>›_</b> {s.detail.title} <span>{s.detail.rows.length} itens</span></p>
      <div className="gview-scroll">
        <table className="gview-table">
          <thead><tr>{s.detail.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{s.detail.rows.map((r, k) => (
            <tr key={r.join()} style={{ animationDelay: `${250 + Math.min(k, 6) * 70}ms` }}>
              {r.map((v, j) => <td key={j} className={j === r.length - 1 ? 'st' : undefined}>{v}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="gview-note">{s.detail.note}</p>
    </div>
  )
}

// Módulo aberto: substitui os cards no mesmo lugar, entrando com um recorte
// circular que nasce do card clicado. As abas trocam de módulo com o mesmo
// recorte (como as telas de "A marca é sua"). Voltar faz o caminho inverso.
function ModuleView({ start, all, host, origin, closing, onBack, onUser }) {
  const [i, setI] = useState(() => Math.max(0, all.findIndex((m) => m.path === start.path)))
  const [prev, setPrev] = useState(null)
  const go = (k) => { if (k === i) return; setPrev(i); setI(k) }
  useEffect(() => { if (prev === null) return undefined; const t = setTimeout(() => setPrev(null), 1000); return () => clearTimeout(t) }, [prev])
  const s = all[i]
  return (
    <div className={`gview is-${s.status} ${closing ? 'is-closing' : ''}`} style={{ '--cx': origin.x, '--cy': origin.y }}>
      <span className="gcard-bar" aria-hidden="true" />
      <div className="gview-top">
        <button className="gview-back" onClick={(e) => { if (e.isTrusted) onUser(); onBack() }} onPointerEnter={() => play('tick')}><ArrowLeft size={14} weight="bold" aria-hidden="true" /> todos os módulos</button>
        <code key={s.path} className="lgs-url">{host}/{s.path}</code>
      </div>
      <div className="gview-stage">
        {prev !== null && <div className="gview-layer is-out"><ModuleBody s={all[prev]} /></div>}
        <div key={s.path} className={`gview-layer ${prev !== null ? 'is-wipe' : ''}`}><ModuleBody s={s} /></div>
      </div>
      <div className="gview-tabs" role="tablist" aria-label="Módulos">
        {all.map((m, k) => (
          <button key={m.path} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''}
            onClick={() => { onUser(); play('click'); go(k) }} onPointerEnter={() => play('tick')}>
            <i className={`dot-${m.status === 'ativo' ? 'green' : 'amber'}`} />{m.title}
          </button>
        ))}
      </div>
    </div>
  )
}

// Roteiro do cursor de demonstração: em cada volta ele filtra, abre um
// módulo, rola a lista e volta. Três voltas, uma por módulo, e recomeça.
const DEMO = [
  { filter: 'atencao', card: 'cobranca' },
  { filter: 'ativo', card: 'agenda' },
  { filter: 'todos', card: 'atendimento' },
]

// Frase de fechamento digitada letra por letra quando entra na tela,
// com o som de tecla (se os sons estiverem ligados). O texto inteiro fica
// reservado de forma invisível, então nada pula enquanto digita.
function TypedLine({ text }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  const [go, setGo] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); return undefined }
    // só começa quando a frase está inteira na tela e já passou do terço de baixo,
    // ou seja, quando a pessoa rolou até ela
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect() } }, { threshold: 1, rootMargin: '0px 0px -30% 0px' })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [text])
  useEffect(() => {
    if (!go || n >= text.length) return undefined
    const ch = text[n]
    const t = setTimeout(() => { if (ch !== ' ') play('key'); setN((x) => x + 1) }, ch === ',' || ch === '.' ? 260 : 55 + Math.random() * 45)
    return () => clearTimeout(t)
  }, [go, n, text])
  return (
    <p ref={ref} className="typed" aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      <b className={`typed-caret ${n >= text.length ? 'is-done' : ''}`} aria-hidden="true" />
      <span className="typed-rest" aria-hidden="true">{text.slice(n)}</span>
    </p>
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
  // demonstração: um cursor faz o caminho sozinho enquanto a seção está na
  // tela. Se a pessoa clicar em algo, o cursor some e ela assume.
  const [user, setUser] = useState(false)
  const [inView, setInView] = useState(false)
  const [cursor, setCursor] = useState({ x: 60, y: 40, on: false, click: 0 })
  const area = useRef(null)
  const api = useRef({})
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setUser(true); return undefined }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    if (stage.current) io.observe(stage.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => { if (!inView) setUser(false) }, [inView]) // saiu e voltou: a demonstração recomeça
  useEffect(() => {
    if (user || !inView) { setCursor((c) => ({ ...c, on: false })); return undefined }
    let dead = false
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const el = (sel) => area.current?.querySelector(sel)
    const moveTo = async (sel, dx = 0.5, dy = 0.5) => {
      const a = area.current; const t = el(sel); if (!a || !t) return
      const ar = a.getBoundingClientRect(); const tr = t.getBoundingClientRect()
      const k = ar.width / a.offsetWidth || 1 // zoom de 80% no desktop
      setCursor((c) => ({ ...c, on: true, x: (tr.left - ar.left + tr.width * dx) / k, y: (tr.top - ar.top + tr.height * dy) / k }))
      await sleep(850)
    }
    const click = async () => { play('click'); setCursor((c) => ({ ...c, click: c.click + 1 })); await sleep(220) }
    const run = async () => {
      let lap = 0
      await sleep(700)
      while (!dead) {
        const step = DEMO[lap % DEMO.length]
        await moveTo(`[data-f="${step.filter}"]`); if (dead) return
        await click(); api.current.filter(step.filter); await sleep(900); if (dead) return
        await moveTo(`[data-path="${step.card}"]`, 0.45, 0.4); if (dead) return
        await click(); api.current.open(step.card); await sleep(1300); if (dead) return
        await moveTo('.gview-scroll', 0.6, 0.55); if (dead) return
        const sc = el('.gview-scroll')
        sc?.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' }); await sleep(1600); if (dead) return
        sc?.scrollTo({ top: 0, behavior: 'smooth' }); await sleep(1200); if (dead) return
        await moveTo('.gview-back'); if (dead) return
        await click(); api.current.back(); await sleep(1100)
        lap += 1
      }
    }
    run()
    return () => { dead = true }
  }, [user, inView])
  const takeOver = () => setUser(true)
  const openAt = (s, el) => {
    const st = stage.current?.getBoundingClientRect(); const r = el?.getBoundingClientRect()
    if (st && r) setOrigin({ x: `${((r.left + r.width / 2 - st.left) / st.width) * 100}%`, y: `${((r.top + r.height / 2 - st.top) / st.height) * 100}%` })
    setClosing(false); setOpen(s)
  }
  const back = () => {
    setClosing(true)
    setTimeout(() => { setOpen(null); setClosing(false) }, 650)
  }
  api.current = {
    filter: (f) => setFilter(f),
    open: (path) => { const s = p.scraps.find((x) => x.path === path); openAt(s, stage.current?.querySelector(`[data-path="${path}"]`)) },
    back,
  }
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') { takeOver(); back() } }
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

        <div className="gdemo" ref={area}>
        <span className={`gcursor ${cursor.on ? 'is-on' : ''}`} style={{ '--x': `${cursor.x}px`, '--y': `${cursor.y}px` }} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l16 9.5-7 1.6-3.6 6.4z" fill="#F0EDE8" stroke="#1A0F0F" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          <i key={cursor.click} className={cursor.click ? 'is-click' : ''} />
        </span>
        {/* barra de filtros igual à do Atelier.sh */}
        <div className="pfilters" data-reveal>
          <p className="pfilters-intro">{p.cardsIntro}</p>
          <div className="pfilters-row">
            <div role="group" aria-label="Filtrar retalhos">
              {p.filters.map((f) => (
                <button key={f.id} data-f={f.id} className={`filter-btn ${filter === f.id ? 'active' : ''}`} aria-pressed={filter === f.id}
                  onClick={() => { takeOver(); play('click'); setFilter(f.id) }} onPointerEnter={() => play('tick')}>
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

        {/* o data-reveal fica num invólucro próprio: se ficasse no mesmo div do className
            dinâmico, o React apagaria a classe is-in a cada troca e os cards sumiriam */}
        <div data-reveal><div className={`gstage ${open ? 'is-open' : ''} ${closing ? 'is-closing' : ''}`} ref={stage}><ul className="gcards" aria-live="polite" inert={open && !closing ? '' : undefined}>
          {shown.map((s, i) => <ScrapCard key={s.path} s={s} i={i} onOpen={(s, el) => { takeOver(); openAt(s, el) }} />)}
          <li className="gcard-add">
            <a href={p.addCard.href} onClick={() => play('click')} onPointerEnter={() => play('tick')}>
              <Plus size={18} aria-hidden="true" />
              <strong>{p.addCard.label}</strong>
              <span>{p.addCard.note}</span>
            </a>
          </li>
        </ul>
        {open && <ModuleView key={open.path} start={open} all={p.scraps} host={p.host} origin={origin} closing={closing} onBack={back} onUser={takeOver} />}
        </div></div>
        </div>

        <div className="problem-end">
          <span className="problem-blob" aria-hidden="true" />
          <TypedLine text={p.closing} />
          <div className="stitch-host">
            <Stitch to="#como-funciona h2" />
          </div>
        </div>
      </div>
    </section>
  )
}
