import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { whatsappWith } from '@/lib/content'
import { play } from '@/lib/sounds'

// Formulário da lista de espera. Envia para /api/waitlist (Pages Function
// em functions/api/waitlist.js, que grava no D1 e manda o e-mail de
// confirmação). Se a API não responder, oferece o WhatsApp no lugar.
// O campo "site" é uma armadilha para robôs: fica escondido e deve vir vazio.
// extra: elemento opcional ao lado do botão de enviar (ex.: "Ver as regras").
export default function Waitlist({ cfg, extra }) {
  const [email, setEmail] = useState('')
  const [area, setArea] = useState('')
  const [state, setState] = useState('idle') // idle | sending | ok | fail

  async function submit(e) {
    e.preventDefault()
    if (state === 'sending') return
    play('click')
    setState('sending')
    const form = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, area, interest: cfg.interest, site: form.get('site') || '', page: location.pathname }),
      })
      setState(res.ok ? 'ok' : 'fail')
    } catch {
      setState('fail')
    }
  }

  if (state === 'ok') return <p className="wl-msg is-ok" role="status">{cfg.ok}</p>

  return (
    <form className="wl" onSubmit={submit}>
      <label className="sr-only" htmlFor={`wl-email-${cfg.interest}`}>E-mail</label>
      <input id={`wl-email-${cfg.interest}`} type="email" required autoComplete="email" placeholder={cfg.emailPlaceholder}
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <label className="sr-only" htmlFor={`wl-area-${cfg.interest}`}>{cfg.areaPlaceholder}</label>
      <select id={`wl-area-${cfg.interest}`} required value={area} onChange={(e) => setArea(e.target.value)}>
        <option value="" disabled>{cfg.areaPlaceholder}</option>
        {cfg.areas.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <input className="wl-trap" type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {(() => {
        const btn = (
          <button type="submit" className="plan-cta" disabled={state === 'sending'}>
            {state === 'sending' ? '...' : cfg.submit} <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </button>
        )
        return extra ? <div className="wl-actions">{btn}{extra}</div> : btn
      })()}
      <p className="wl-consent">{cfg.consent}</p>
      {state === 'fail' && (
        <p className="wl-msg is-fail" role="alert">
          {cfg.fail} <a href={whatsappWith(`Oi, Samara! ${cfg.interest === 'fundador' ? `Quero ser cliente fundador da linha ${area || 'da minha área'}` : `Quero entrar na lista de espera da linha ${area || 'da minha área'}`}. Meu e-mail é ${email}.`)} target="_blank" rel="noreferrer">WhatsApp</a>
        </p>
      )}
    </form>
  )
}
