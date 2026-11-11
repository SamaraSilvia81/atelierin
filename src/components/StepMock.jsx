import { Check, CircleNotch } from '@phosphor-icons/react'

// Telinhas desenhadas em código para cada passo da implantação. Aparecem
// enquanto não houver imagem real no passo (how.steps.items[].image.src).
export default function StepMock({ kind }) {
  if (kind === 'conversa') return (
    <div className="sm sm-chat">
      <p className="sm-msg me">Oi! Me conta como você trabalha hoje?</p>
      <p className="sm-msg you">Dou aula de teclado pra uns 30 alunos. Tudo pelo WhatsApp e um Drive.</p>
      <p className="sm-msg me">E a cobrança, como fica?</p>
      <p className="sm-msg you">Pix. Confiro no extrato no fim do mês 😅</p>
      <p className="sm-typing"><i /><i /><i /></p>
    </div>
  )
  if (kind === 'molde') return (
    <div className="sm sm-molde">
      <div className="sm-row"><span className="sm-k">linha</span><b className="sm-tag">School</b></div>
      <div className="sm-row"><span className="sm-k">vocabulário</span><span>alunos · aulas · turmas</span></div>
      <div className="sm-grid">
        {[['Cursos e aulas', 1], ['Agenda', 1], ['Materiais', 1], ['Financeiro', 1], ['Avaliações', 0], ['Mural', 0]].map(([m, on]) => (
          <span key={m} className={`sm-mod ${on ? 'on' : ''}`}>{on ? <Check size={11} weight="bold" /> : '·'} {m}</span>
        ))}
      </div>
    </div>
  )
  if (kind === 'prova') return (
    <div className="sm sm-prova">
      <div className="sm-brand"><span className="sm-logo">EM</span><div><strong>Escola Maestro</strong><small>maestro.atelierin.com.br</small></div></div>
      <div className="sm-swatches">{['#1F2A44', '#E0B04C', '#FBF8F2', '#2B2B2B'].map((c) => <i key={c} style={{ background: c }} title={c} />)}</div>
      <div className="sm-preview">
        <aside><span /><span className="on" /><span /><span /></aside>
        <div><b /><span /><span /><span /></div>
      </div>
    </div>
  )
  if (kind === 'ajuste') return (
    <div className="sm sm-ajuste">
      {[['Trocar "turmas" por "grupos"', 1], ['Logo um pouco maior no menu', 1], ['Financeiro antes de Materiais', 1], ['Texto de boas-vindas mais curto', 0]].map(([t, done]) => (
        <p key={t} className={`sm-note ${done ? 'done' : ''}`}>
          {done ? <Check size={12} weight="bold" /> : <CircleNotch size={12} />} <span>{t}</span>
        </p>
      ))}
    </div>
  )
  return (
    <div className="sm sm-noar">
      <p className="sm-online"><i /> maestro.atelierin.com.br · <b>no ar</b></p>
      {['Ana Luiza', 'Bruno', 'Carla', 'Diego', '+ 29 alunos'].map((n) => (
        <p key={n} className="sm-invite"><Check size={12} weight="bold" /> convite enviado · {n}</p>
      ))}
    </div>
  )
}
