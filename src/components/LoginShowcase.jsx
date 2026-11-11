import { useEffect, useState } from 'react'
import { ArrowRight, GoogleLogo, Eye } from '@phosphor-icons/react'
import { play } from '@/lib/sounds'

// Vitrine de telas de login: o mesmo ambiente com três identidades
// (editorial, moderno, retrô). Cada tela entra com um recorte circular,
// os elementos chegam em sequência e o e-mail e a senha se digitam sozinhos.
// Pausa com o mouse em cima. Com "reduzir movimento", não troca sozinho.
const SCENES = [700, 1500, 800, 450, 1700] // entrada, e-mail, senha, clique, pausa

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useTyping(text, on, speed = 55) {
  const [n, setN] = useState(0)
  useEffect(() => { if (!on) setN(0) }, [on])
  useEffect(() => {
    if (!on || n >= text.length) return undefined
    const t = setTimeout(() => setN((x) => x + 1), speed)
    return () => clearTimeout(t)
  }, [on, n, text, speed])
  return text.slice(0, n)
}

function Fields({ s, email, scene, labels = ['E-mail', 'Senha'], btn, caret = '|' }) {
  const typed = useTyping(email, scene >= 1, 45)
  const pass = useTyping('••••••••', scene >= 2, 70)
  return (
    <>
      <label className="lg-field">
        <span>{labels[0]}</span>
        <i className={scene === 1 ? 'is-focus' : ''}>{typed || <em>{s === 'retro' ? 'usuario@...' : 'seu@email.com'}</em>}{scene === 1 && <b className="lg-caret">{caret}</b>}</i>
      </label>
      <label className="lg-field">
        <span>{labels[1]}</span>
        <i className={scene === 2 ? 'is-focus' : ''}>{pass || <em>••••••••</em>}{scene === 2 && <b className="lg-caret">{caret}</b>}{s === 'moderno' && <Eye size={15} className="lg-eye" />}</i>
      </label>
      <span className={`lg-btn ${scene === 3 ? 'is-press' : ''} ${scene >= 4 ? 'is-done' : ''}`}>
        {scene >= 4 ? (s === 'retro' ? 'OK! ENTRANDO_' : 'Entrando…') : btn}
        {scene < 4 && s !== 'retro' && <ArrowRight size={15} weight="bold" />}
      </span>
    </>
  )
}

function Editorial({ st, scene }) {
  return (
    <div className="lg lg-editorial">
      <div className="lg-photo">
        <div className="lg-brand"><span className="lg-mark">M</span><div><strong>{st.name}</strong><small>música · desde 2014</small></div></div>
        <p className="lg-quote">A música<br />começa <em>aqui.</em></p>
        <small className="lg-credit">turma de sábado · 2026</small>
      </div>
      <div className="lg-form">
        <p className="lg-eyebrow">área do aluno</p>
        <h4>Bem-vinda<br /><em>de volta</em></h4>
        <div className="lg-role"><b>Aluno</b><span>Professor</span></div>
        <Fields s="editorial" email={st.email} scene={scene} btn="Entrar" />
        <small className="lg-foot">feito com Atelierin</small>
      </div>
    </div>
  )
}

function Moderno({ st, scene }) {
  return (
    <div className="lg lg-moderno">
      <span className="lg-blob a" /><span className="lg-blob b" />
      <div className="lg-card">
        <span className="lg-mark">CR</span>
        <h4>Entrar na sua conta</h4>
        <p>{st.name}</p>
        <span className="lg-google"><GoogleLogo size={16} weight="bold" /> Continuar com Google</span>
        <span className="lg-or">ou</span>
        <Fields s="moderno" email={st.email} scene={scene} btn="Entrar" />
        <small className="lg-foot">feito com Atelierin</small>
      </div>
    </div>
  )
}

function Retro({ st, scene }) {
  return (
    <div className="lg lg-retro">
      <div className="lg-win">
        <div className="lg-titlebar"><i /><span>LENTE_ESTUDIO.EXE</span><i /></div>
        <div className="lg-win-body">
          <div className="lg-retro-brand"><span className="lg-mark">LE</span><strong>{st.name.toUpperCase()}</strong></div>
          <h4>&gt; LOGIN_</h4>
          <Fields s="retro" email={st.email} scene={scene} labels={['USUÁRIO', 'SENHA']} btn="[ ENTRAR ]" caret="█" />
          <small className="lg-foot">feito com atelierin</small>
        </div>
      </div>
      <span className="lg-sticker">área do cliente ★</span>
    </div>
  )
}

const VIEWS = { editorial: Editorial, moderno: Moderno, retro: Retro }

export default function LoginShowcase({ data }) {
  const styles = data.styles
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(null)
  const [scene, setScene] = useState(() => (reduce() ? SCENES.length : 0))
  const [paused, setPaused] = useState(false)
  const [reduced] = useState(reduce)

  const go = (k) => { if (k === i) return; setPrev(i); setI(k); setScene(reduced ? SCENES.length : 0) }

  useEffect(() => {
    if (paused || reduced) return undefined
    if (scene >= SCENES.length) {
      const t = setTimeout(() => go((i + 1) % styles.length), 200)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setScene((n) => n + 1), SCENES[scene])
    return () => clearTimeout(t)
  }, [scene, paused, reduced, i])

  useEffect(() => { if (prev === null) return undefined; const t = setTimeout(() => setPrev(null), 1000); return () => clearTimeout(t) }, [prev])

  const st = styles[i]
  const View = VIEWS[st.id]
  const Prev = prev !== null ? VIEWS[styles[prev].id] : null

  return (
    <div className="lgs" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <figure className="lgs-frame" aria-label={`Tela de login no estilo ${st.tab}: ${st.name}`}>
        <div className="lgs-bar" aria-hidden="true">
          <span className="dots"><i /><i /><i /></span>
          <code key={st.slug} className="lgs-url">{st.slug}.atelierin.com.br/entrar</code>
          <span className="lgs-tag">{st.tab}</span>
        </div>
        <div className="lgs-stage" aria-hidden="true">
          {Prev && <div className="lgs-layer is-out"><Prev st={styles[prev]} scene={SCENES.length} /></div>}
          <div key={st.id} className={`lgs-layer is-in ${prev !== null ? 'is-wipe' : ''}`}><View st={st} scene={scene} /></div>
        </div>
        {!paused && !reduced && <span key={`p-${i}`} className="lgs-progress" aria-hidden="true" />}
      </figure>

      <div className="lgs-tabs" role="tablist" aria-label={data.label}>
        {styles.map((x, k) => (
          <button key={x.id} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''}
            onClick={() => { play('click'); go(k) }} onPointerEnter={() => play('tick')}>
            <span className="lgs-n">0{k + 1}</span>
            <strong>{x.tab}</strong>
            <small>{x.caption}</small>
          </button>
        ))}
      </div>
      <p className="lgs-note">{data.note}</p>
    </div>
  )
}
