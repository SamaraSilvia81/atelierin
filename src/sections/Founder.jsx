import { ArrowRight, CaretDown, Check, Seal, WhatsappLogo } from '@phosphor-icons/react'
import { content, whatsappWith } from '@/lib/content'
import Waitlist from '@/components/Waitlist'
import { play } from '@/lib/sounds'

// Card horizontal "Quer ser cliente fundador?", dentro de Planos, entre os
// três cards e a tabela/calculadora. Vale só para o Personalizado (PRD-008).
// Regras em content.json (bloco founder). Para fechar as vagas, "open": false.
export function FounderLink({ f }) {
  return <a href={f.link.href} className="bridge-link founder-rules">{f.link.label} <ArrowRight size={14} weight="bold" aria-hidden="true" /></a>
}

export default function FounderCard() {
  const f = content.founder
  return (
    <div id="fundador" className="founder" data-reveal>
      <div className="founder-main">
        <p className={`founder-status ${f.open ? '' : 'is-closed'}`}><i aria-hidden="true" />{f.open ? f.statusOpen : f.statusClosed}</p>
        <p className="label"><b aria-hidden="true">&gt;</b> {f.piece} · {f.plan}</p>
        <h3 className="display">{f.title} <em>{f.titleAccent}</em></h3>
        <p className="founder-lede">{f.lede}</p>

        {f.open ? (
          <>
            <Waitlist cfg={f.waitlist} extra={<FounderLink f={f} />} />
            <a className="founder-wa" href={whatsappWith(f.cta.message)} target="_blank" rel="noopener noreferrer">
              <WhatsappLogo size={15} weight="fill" aria-hidden="true" /> {f.whatsappLabel}
            </a>
          </>
        ) : (
          <div className="founder-closed-row"><p className="founder-closed">{f.closedNote}</p><FounderLink f={f} /></div>
        )}
      </div>

      <div className="founder-side">
        <div className="founder-badge" aria-label={`${f.badge} ${f.badgeSub}`}>
          <strong>{f.badge}</strong>
          <span>{f.badgeSub}</span>
        </div>
        <div className="founder-trade">
          <div>
            <h4>{f.get.title}</h4>
            <ul>{f.get.items.map((t) => <li key={t}><Check size={13} weight="bold" aria-hidden="true" />{t}</li>)}</ul>
          </div>
          <div>
            <h4>{f.give.title}</h4>
            <ul>{f.give.items.map((t) => <li key={t}><Check size={13} weight="bold" aria-hidden="true" />{t}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Versão B do teste A/B (?fundador=b): o fundador como um bloco DENTRO do
// card Personalizado, para ficar claro que é uma condição desse plano.
// "Quero uma vaga" abre o modal de fundador (que tem o formulário da lista).
export function FounderInline() {
  const f = content.founder
  const i = f.inline
  return (
    <details id="fundador" className={`plan-fdr ${f.open ? '' : 'is-closed'}`}>
      <summary>
        <Seal size={15} weight="fill" aria-hidden="true" />
        <span className="plan-fdr-sum"><b>{i.label}</b> {f.badge} {i.price}</span>
        <CaretDown size={14} weight="bold" className="plan-fdr-caret" aria-hidden="true" />
      </summary>
      <div className="plan-fdr-body">
        <p>{i.text} <em>{f.open ? i.seats : f.statusClosed}.</em></p>
        <div className="plan-fdr-act">
          {f.open && (
            <button type="button" className="plan-fdr-cta" onClick={() => { play('click'); window.dispatchEvent(new Event('promo:open')) }}>
              {f.waitlist.submit}
            </button>
          )}
          <a href={f.link.href} className="plan-fdr-link">{f.link.label} <ArrowRight size={13} weight="bold" aria-hidden="true" /></a>
        </div>
      </div>
    </details>
  )
}
