import { useEffect, useState } from 'react'
import { Check, Checks, FilePdf, CursorClick, CircleNotch, PaperPlaneTilt } from '@phosphor-icons/react'

// Telinhas animadas de cada passo da implantação. Cada uma roda um roteiro
// curto quando o passo fica ativo (o componente é recriado a cada troca).
// Com "reduzir movimento", mostra direto o estado final.
// Aparecem enquanto não houver imagem real no passo (how.steps.items[].image.src).

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Avança "cenas" segundo uma lista de durações (ms). Devolve o número da cena atual.
function useScenes(durations) {
  const [s, setS] = useState(() => (reduce() ? durations.length : 0))
  useEffect(() => {
    if (s >= durations.length) return undefined
    const t = setTimeout(() => setS((n) => n + 1), durations[s])
    return () => clearTimeout(t)
  }, [s, durations])
  return s
}

// Texto que se digita sozinho quando `on` fica verdadeiro
function Typed({ text, on, speed = 38 }) {
  const [n, setN] = useState(() => (reduce() ? text.length : 0))
  useEffect(() => {
    if (!on || n >= text.length) return undefined
    const t = setTimeout(() => setN((x) => x + 1), speed)
    return () => clearTimeout(t)
  }, [on, n, text, speed])
  return <>{text.slice(0, n)}{on && n < text.length && <span className="sm-caret" />}</>
}

// Cursor de mouse que passeia pela telinha (posições em %)
function Cursor({ at, click }) {
  if (!at) return null
  return (
    <span className={`sm-cursor ${click ? 'is-click' : ''}`} style={{ left: `${at[0]}%`, top: `${at[1]}%` }} aria-hidden="true">
      <CursorClick size={22} weight="fill" />
    </span>
  )
}

/* 01 · Conversa: mensagens chegando, "digitando…", vistos e a proposta em PDF */
const CHAT = [
  ['me', 'Oi! Me conta como você trabalha hoje?'],
  ['you', 'Dou aula de teclado pra uns 30 alunos. Tudo pelo WhatsApp e um Drive.'],
  ['me', 'E a cobrança, como fica?'],
  ['you', 'Pix. Confiro no extrato no fim do mês 😅'],
]
function Conversa() {
  // cena par = "digitando", cena ímpar = mensagem chega; no fim, a proposta
  const s = useScenes([500, 900, 700, 1300, 600, 800, 700, 1100, 700, 1600])
  const shown = Math.min(CHAT.length, Math.ceil(s / 2))
  const typing = s < CHAT.length * 2 && s % 2 === 0 ? CHAT[s / 2][0] : null
  const sendingPdf = s === 8, pdf = s >= 9, pdfDone = s >= 10
  return (
    <div className="sm sm-chat">
      <div className="sm-chat-head">
        <span className="sm-av">S</span>
        <div><strong>Samara · Atelierin</strong><small>{typing === 'me' || sendingPdf ? 'digitando…' : 'online'}</small></div>
      </div>
      <div className="sm-chat-body">
        {CHAT.slice(0, shown).map(([who, txt], i) => (
          <p key={i} className={`sm-msg ${who}`}>
            {txt}
            {who === 'me' && <Checks size={14} className={`sm-read ${shown > i + 1 ? 'is-read' : ''}`} />}
          </p>
        ))}
        {(typing === 'you' || typing === 'me' || sendingPdf) && (
          <p className={`sm-typing ${typing === 'you' ? 'you' : ''}`}><i /><i /><i /></p>
        )}
        {pdf && (
          <div className="sm-msg me sm-file">
            <FilePdf size={26} weight="duotone" />
            <div><strong>proposta-maestro.pdf</strong><small>escopo · módulos · prazo</small><i className={pdfDone ? 'done' : ''}><em /></i></div>
          </div>
        )}
      </div>
    </div>
  )
}

/* 02 · Molde: cursor escolhe a linha, vocabulário se escreve e os módulos ligam */
const MODS = [['Cursos e aulas', 1], ['Agenda', 1], ['Materiais', 1], ['Financeiro', 1], ['Avaliações', 0], ['Mural', 0]]
const MOLDE_CURSOR = [[18, 22], [62, 22], [62, 22], [30, 58], [75, 58], [30, 74], [75, 74], [75, 74]]
function Molde() {
  const s = useScenes([500, 600, 350, 900, 450, 450, 450, 450, 900])
  const lineOn = s >= 3
  const modsOn = Math.max(0, s - 4)
  const count = MODS.filter(([, on], i) => on && i < modsOn).length
  return (
    <div className="sm sm-panel sm-molde">
      <div className="sm-row">
        <span className="sm-k">linha</span>
        <span className="sm-lines">
          {['School', 'Consult', 'Fit'].map((l) => <b key={l} className={`sm-line ${lineOn && l === 'School' ? 'on' : ''}`}>{l}</b>)}
        </span>
      </div>
      <div className="sm-row">
        <span className="sm-k">vocabulário</span>
        <span className="sm-mono"><Typed text="alunos · aulas · turmas" on={s >= 3} speed={30} /></span>
      </div>
      <div className="sm-grid">
        {MODS.map(([m, on], i) => {
          const active = on && i < modsOn
          return (
            <span key={m} className={`sm-mod ${active ? 'on' : ''}`}>
              <span className="sm-switch"><i /></span>{m}
            </span>
          )
        })}
      </div>
      <p className="sm-foot"><b>{count}</b> módulos · linha <b>{lineOn ? 'School' : '—'}</b></p>
      {s < 9 && <Cursor at={MOLDE_CURSOR[Math.min(s, MOLDE_CURSOR.length - 1)]} click={s === 3 || (s >= 5 && s <= 8)} />}
    </div>
  )
}

/* 03 · Prova: a interface cinza ganha cores, logo, nome e endereço */
const SW = ['#1F2A44', '#E0B04C', '#FBF8F2', '#2B2B2B']
function Prova() {
  const s = useScenes([600, 500, 500, 500, 500, 700, 900, 1200, 600])
  return (
    <div className={`sm sm-panel sm-prova ${s >= 5 ? 'is-branded' : ''}`}>
      <div className="sm-brand">
        <span className={`sm-logo ${s >= 6 ? 'on' : ''}`}>{s >= 6 ? 'EM' : ''}</span>
        <div>
          <strong className="sm-serif"><Typed text="Escola Maestro" on={s >= 6} speed={45} /></strong>
          <small><Typed text="maestro.atelierin.com.br" on={s >= 7} speed={28} /></small>
        </div>
      </div>
      <div className="sm-swatches">
        {SW.map((c, i) => <i key={c} className={s >= i + 1 ? 'on' : ''} style={{ '--c': c }} />)}
        <span className="sm-k">{s >= 5 ? 'paleta aplicada' : 'paleta'}</span>
      </div>
      <div className="sm-preview">
        <aside><span /><span className="on" /><span /><span /></aside>
        <div><b /><span /><span /><span /></div>
      </div>
      {s >= 8 && <p className="sm-toast"><PaperPlaneTilt size={14} weight="fill" /> link de prova enviado para você</p>}
    </div>
  )
}

/* 04 · Ajuste: pedidos chegando e sendo resolvidos um a um */
const NOTES = ['Trocar "turmas" por "grupos"', 'Logo um pouco maior no menu', 'Financeiro antes de Materiais', 'Texto de boas-vindas mais curto']
function Ajuste() {
  const s = useScenes([400, 500, 500, 500, 900, 800, 800, 800, 900])
  const arrived = Math.min(NOTES.length, s)
  const solved = Math.max(0, s - 4)
  return (
    <div className="sm sm-panel sm-ajuste">
      <div className="sm-row"><span className="sm-k">ajustes pedidos</span><span className="sm-mono"><b>{Math.min(solved, NOTES.length)}</b>/{arrived || 0} resolvidos</span></div>
      {NOTES.slice(0, arrived).map((t, i) => {
        const done = i < solved
        const working = i === solved && s >= 4 && s < 8
        return (
          <p key={t} className={`sm-note ${done ? 'done' : ''}`}>
            <span className="sm-who">você</span>
            <span className="sm-note-t">{t}</span>
            <span className="sm-state">{done ? <Check size={13} weight="bold" /> : working ? <CircleNotch size={13} className="sm-spin" /> : null}</span>
          </p>
        )
      })}
      <div className="sm-bar"><em style={{ transform: `scaleX(${Math.min(solved, 4) / 4})` }} /></div>
    </div>
  )
}

/* 05 · No ar: publicação estilo terminal e convites saindo */
const DEPLOY = ['publicando maestro.atelierin.com.br', 'certificado de segurança ativo', 'endereço apontado', 'ambiente no ar']
const INVITES = ['Ana Luiza', 'Bruno', 'Carla', 'Diego']
function NoAr() {
  const s = useScenes([500, 700, 600, 600, 800, 450, 450, 450, 450, 700])
  const lines = Math.min(DEPLOY.length, s)
  const live = s >= 4
  const sent = Math.max(0, s - 5)
  return (
    <div className="sm sm-panel sm-noar">
      <div className="sm-term">
        {DEPLOY.slice(0, lines).map((l, i) => (
          <p key={l}><b>{i === DEPLOY.length - 1 ? '✓' : '›'}</b> {l}{i === lines - 1 && !live && <span className="sm-caret" />}</p>
        ))}
      </div>
      <p className={`sm-online ${live ? 'is-live' : ''}`}><i /> maestro.atelierin.com.br · <b>{live ? 'no ar' : 'publicando…'}</b></p>
      <div className="sm-invites">
        {INVITES.map((n, i) => (
          <p key={n} className={`sm-invite ${i < sent ? 'sent' : ''}`}>
            {i < sent ? <Check size={12} weight="bold" /> : i === sent && live ? <CircleNotch size={12} className="sm-spin" /> : <span className="sm-dot" />}
            convite · {n}
          </p>
        ))}
        <p className="sm-invite more">{sent >= INVITES.length ? <><Check size={12} weight="bold" /> + 29 alunos convidados</> : '+ 29 alunos'}</p>
      </div>
    </div>
  )
}

export default function StepMock({ kind }) {
  if (kind === 'conversa') return <Conversa />
  if (kind === 'molde') return <Molde />
  if (kind === 'prova') return <Prova />
  if (kind === 'ajuste') return <Ajuste />
  return <NoAr />
}
