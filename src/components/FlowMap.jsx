import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { User, Scissors, Eye, Browsers, Users, Bank, ArrowCounterClockwise } from '@phosphor-icons/react'
import { play } from '@/lib/sounds'

// Diagrama de como funciona contratar, no estilo de arquitetura de software:
// fundo quadriculado, blocos e ligações. Nada se mexe sozinho: a pessoa clica
// numa etapa (ou num bloco) e só aquela parte acende e anima.
// Com ?para=nome no endereço, "você" vira o nome do cliente.

const ICONS = { User, Scissors, Eye, Browsers, Users, Bank }

// posições (centro do bloco) em % do palco
const NODES = [
  { id: 'voce', icon: 'User', x: 14, y: 18 },
  { id: 'previa', icon: 'Eye', x: 34, y: 18 },
  { id: 'alunos', icon: 'Users', x: 85, y: 18 },
  { id: 'ambiente', icon: 'Browsers', x: 58, y: 56, big: true },
  { id: 'samara', icon: 'Scissors', x: 14, y: 84 },
  { id: 'conta', icon: 'Bank', x: 85, y: 84, money: true },
]

// ligações em ângulo reto, como num diagrama de arquitetura.
// a/b: lado de saída e de chegada (t, b, l, r); oa/ob: deslocamento no lado, em px;
// at: em que fração do caminho fica a etiqueta
const EDGES = [
  { id: 'conversa', from: 'voce', a: 'b', oa: -34, to: 'samara', b: 't', ob: -34, step: 1, at: 0.3 },
  { id: 'implanta-pay', from: 'voce', a: 'b', oa: 0, to: 'samara', b: 't', ob: 0, step: 3, at: 0.5 },
  { id: 'mensal', from: 'voce', a: 'b', oa: 34, to: 'samara', b: 't', ob: 34, step: 6, at: 0.7 },
  { id: 'previa-a', from: 'samara', a: 'r', oa: -14, to: 'previa', b: 'b', ob: 0, step: 2, at: 0.62 },
  { id: 'previa-b', from: 'previa', a: 'l', oa: 0, to: 'voce', b: 'r', ob: 0, step: 2, at: 0.5 },
  { id: 'implanta', from: 'samara', a: 'r', oa: 0, to: 'ambiente', b: 'b', ob: -40, step: 3, at: 0.22 },
  { id: 'cuida', from: 'samara', a: 'r', oa: 14, to: 'ambiente', b: 'b', ob: 40, step: 6, at: 0.5 },
  { id: 'login', from: 'alunos', a: 'b', oa: -24, to: 'ambiente', b: 'r', ob: 0, step: 4, at: 0.6 },
  { id: 'pix', from: 'alunos', a: 'b', oa: 24, to: 'conta', b: 't', ob: 24, step: 5, money: true, at: 0.5 },
]

const NORMAL = { t: [0, -1], b: [0, 1], l: [-1, 0], r: [1, 0] }
function anchor(box, side, off) {
  const { x, y, w, h } = box
  if (side === 't') return [x + w / 2 + off, y]
  if (side === 'b') return [x + w / 2 + off, y + h]
  if (side === 'l') return [x, y + h / 2 + off]
  return [x + w, y + h / 2 + off]
}
// caminho em L ou em Z entre dois lados, com cantos arredondados
function route(A, a, B, b) {
  const g = 14
  const s = [A[0] + NORMAL[a][0] * g, A[1] + NORMAL[a][1] * g]
  const e = [B[0] + NORMAL[b][0] * g, B[1] + NORMAL[b][1] * g]
  const vA = a === 't' || a === 'b'; const vB = b === 't' || b === 'b'
  let mid
  if (vA && vB) { const my = (s[1] + e[1]) / 2; mid = [[s[0], my], [e[0], my]] }
  else if (!vA && !vB) { const mx = (s[0] + e[0]) / 2; mid = [[mx, s[1]], [mx, e[1]]] }
  else if (vA) mid = [[s[0], e[1]]]
  else mid = [[e[0], s[1]]]
  const pts = [A, s, ...mid, e, B].filter((p, i, arr) => i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1])
  // cantos arredondados
  const r = 10
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [p0, p1, p2] = [pts[i - 1], pts[i], pts[i + 1]]
    const l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); const l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    const rr = Math.min(r, l1 / 2, l2 / 2)
    const q0 = [p1[0] - ((p1[0] - p0[0]) / (l1 || 1)) * rr, p1[1] - ((p1[1] - p0[1]) / (l1 || 1)) * rr]
    const q1 = [p1[0] + ((p2[0] - p1[0]) / (l2 || 1)) * rr, p1[1] + ((p2[1] - p1[1]) / (l2 || 1)) * rr]
    d += ` L ${q0[0]} ${q0[1]} Q ${p1[0]} ${p1[1]} ${q1[0]} ${q1[1]}`
  }
  d += ` L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`
  return { d, pts }
}
function pointAt(pts, f) {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  let left = segs.reduce((a, b) => a + b, 0) * f
  for (let i = 0; i < segs.length; i++) {
    if (left <= segs[i]) { const k = left / (segs[i] || 1); return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k] }
    left -= segs[i]
  }
  return pts[pts.length - 1]
}

function useClientName() {
  return useMemo(() => {
    if (typeof window === 'undefined') return null
    const raw = new URLSearchParams(window.location.search).get('para')
    if (!raw) return null
    const name = raw.trim().slice(0, 30)
    const slug = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '')
    return name && slug ? { name: name[0].toUpperCase() + name.slice(1), slug } : null
  }, [])
}

export default function FlowMap({ data }) {
  const client = useClientName()
  const who = client?.name ?? data.you
  const slug = client?.slug ?? 'seunome'
  const fill = (s) => String(s).replaceAll('{voce}', who).replaceAll('{slug}', slug)

  const [step, setStep] = useState(0)      // 0 = visão geral, nada animando
  const [node, setNode] = useState(null)   // bloco clicado
  const [run, setRun] = useState(0)        // reinicia a animação a cada clique

  const stageRef = useRef(null)
  const nodeRefs = useRef({})
  const [geo, setGeo] = useState(null)
  useLayoutEffect(() => {
    const measure = () => {
      const st = stageRef.current; if (!st) return
      const sr = st.getBoundingClientRect(); const k = sr.width / st.offsetWidth || 1
      const boxes = {}
      NODES.forEach((n) => {
        const el = nodeRefs.current[n.id]; if (!el) return
        const r = el.getBoundingClientRect()
        boxes[n.id] = { x: (r.left - sr.left) / k, y: (r.top - sr.top) / k, w: r.width / k, h: r.height / k }
      })
      const paths = {}
      EDGES.forEach((e) => {
        const A = anchor(boxes[e.from], e.a, e.oa); const B = anchor(boxes[e.to], e.b, e.ob)
        const r = route(A, e.a, B, e.b)
        paths[e.id] = { ...r, label: pointAt(r.pts, e.at ?? 0.5) }
      })
      setGeo({ w: st.offsetWidth, h: st.offsetHeight, paths })
    }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [who])

  const pickStep = (n) => { play('click'); setNode(null); setStep(n); setRun((r) => r + 1) }
  const pickNode = (id) => { play('click'); setStep(0); setNode(id); setRun((r) => r + 1) }
  const reset = () => { play('click'); setStep(0); setNode(null) }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setStep((s) => { setNode(null); setRun((r) => r + 1); return Math.min(data.steps.length, s + 1) })
      if (e.key === 'ArrowLeft') setStep((s) => { setNode(null); setRun((r) => r + 1); return Math.max(1, s - 1) })
    }
    const el = document.getElementById('fluxo')
    el?.addEventListener('keydown', onKey)
    return () => el?.removeEventListener('keydown', onKey)
  }, [data.steps.length])

  const active = (e) => (step ? e.step === step : node ? e.from === node || e.to === node : false)
  const nodeOn = (id) => {
    if (step) return EDGES.some((e) => e.step === step && (e.from === id || e.to === id))
    if (node) return id === node || EDGES.some((e) => (e.from === node && e.to === id) || (e.to === node && e.from === id))
    return true
  }
  const focus = step || node
  const info = step ? data.steps[step - 1] : node ? data.nodes[node] : data.overview

  return (
    <div className="flow" id="fluxo" tabIndex={-1}>
      <div className="flow-stage" ref={stageRef}>
        {geo && (
          <svg className="flow-edges" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
            {EDGES.map((e) => {
              const on = active(e); const g = geo.paths[e.id]
              return (
                <g key={`${e.id}-${on ? run : 'off'}`} className={`flow-edge ${e.money ? 'is-money' : ''} ${on ? 'is-on' : ''} ${focus && !on ? 'is-dim' : ''}`}>
                  <path d={g.d} className="flow-line" />
                  {on && <path d={g.d} className="flow-run" pathLength="1" />}
                  {on && (
                    <circle r="4.5" className="flow-dot">
                      <animateMotion dur="1.1s" fill="freeze" path={g.d} calcMode="spline" keyTimes="0;1" keySplines=".6 0 .2 1" />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>
        )}

        {geo && EDGES.filter(active).map((e) => {
          const [x, y] = geo.paths[e.id].label
          return (
            <span key={`l-${e.id}-${run}`} className={`flow-tag ${e.money ? 'is-money' : ''}`} style={{ left: x, top: y }}>
              {fill(data.edges[e.id])}
            </span>
          )
        })}

        {NODES.map((n) => {
          const Icon = ICONS[n.icon]
          const d = data.nodes[n.id]
          return (
            <button key={n.id} ref={(el) => { nodeRefs.current[n.id] = el }} className={`flow-node ${n.big ? 'is-big' : ''} ${n.money ? 'is-money' : ''} ${nodeOn(n.id) ? '' : 'is-dim'} ${node === n.id ? 'is-picked' : ''}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              onClick={() => pickNode(n.id)} onPointerEnter={() => play('tick')}>
              <span className="flow-node-k"><Icon size={14} aria-hidden="true" /> {fill(d.kind)}</span>
              <strong>{fill(d.name)}</strong>
              {n.big && (
                <span className="flow-mods">{data.modules.map((m) => <i key={m}>{m}</i>)}</span>
              )}
            </button>
          )
        })}
        <span className="flow-crop c1" /><span className="flow-crop c2" /><span className="flow-crop c3" /><span className="flow-crop c4" />
        <span className="flow-legend" aria-hidden="true"><i className="l-work" /> trabalho <i className="l-money" /> dinheiro dos alunos</span>
      </div>

      <div className="flow-side">
        <div className="flow-steps" role="tablist" aria-label="Etapas">
          {data.steps.map((s, i) => (
            <button key={s.title} role="tab" aria-selected={step === i + 1} className={step === i + 1 ? 'on' : ''}
              onClick={() => pickStep(i + 1)} onPointerEnter={() => play('tick')}>
              <b>{String(i + 1).padStart(2, '0')}</b> {fill(s.short)}
            </button>
          ))}
          <button className="flow-reset" onClick={reset} disabled={!focus}><ArrowCounterClockwise size={13} aria-hidden="true" /> visão geral</button>
        </div>
        <div className="flow-info" key={`${step}-${node}`} aria-live="polite">
          <p className="flow-info-k">{step ? `etapa ${String(step).padStart(2, '0')}` : node ? 'bloco' : 'como ler'}</p>
          <h3>{fill(info.title)}</h3>
          <p>{fill(info.text)}</p>
        </div>
      </div>
    </div>
  )
}
