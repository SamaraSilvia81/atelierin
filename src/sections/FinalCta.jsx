import { useEffect, useState } from 'react'
import { WhatsappLogo, EnvelopeSimple, Check } from '@phosphor-icons/react'
import { content, whatsappWith, mailHref } from '@/lib/content'
import { play } from '@/lib/sounds'

// "Vamos tirar as suas medidas": uma ficha curta que vira mensagem no
// WhatsApp (ou e-mail, se houver endereço em site.contactEmail).
export default function FinalCta() {
  const c = content.finalCta
  const f = c.form
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [pick, setPick] = useState({})

  // o "Quero o meu" do topo manda o endereço escolhido para cá
  useEffect(() => {
    const onPrefill = (e) => setNote((n) => (n.includes(e.detail) ? n : [e.detail, n].filter(Boolean).join('\n')))
    window.addEventListener('ficha:prefill', onPrefill)
    return () => window.removeEventListener('ficha:prefill', onPrefill)
  }, [])

  const toggle = (g, opt) => {
    play('tick')
    setPick((s) => {
      const cur = s[g.id] ?? []
      if (g.multi) return { ...s, [g.id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] }
      return { ...s, [g.id]: cur[0] === opt ? [] : [opt] }
    })
  }

  const message = () => {
    const lines = [f.intro, '']
    if (name.trim()) lines.push(`• Nome: ${name.trim()}`)
    f.groups.forEach((g) => { const v = pick[g.id]; if (v?.length) lines.push(`• ${g.label} ${v.join(', ')}`) })
    if (note.trim()) lines.push('', note.trim())
    return lines.join('\n')
  }

  const send = (e) => {
    e.preventDefault()
    play('click')
    window.open(whatsappWith(message()), '_blank', 'noopener')
  }
  const mail = mailHref(message())

  return (
    <section id="contato" data-theme="light" className="section final" aria-labelledby="contato-t">
      <div className="wrap final-grid">
        <div className="final-copy" data-reveal>
          <p className="label"><b aria-hidden="true">&gt;</b> {c.piece}</p>
          <h2 id="contato-t" className="display">{c.title} <em>{c.titleAccent}</em></h2>
          <p className="lede">{c.lede}</p>
          <ul className="final-aside">{c.aside.map((a) => <li key={a}><Check size={14} weight="bold" aria-hidden="true" />{a}</li>)}</ul>
          <p className="final-direct">
            ou direto: <a href={whatsappWith(content.site.whatsappMessage)} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={16} weight="fill" /> {content.site.whatsappDisplay}</a>
          </p>
        </div>

        <form className="ficha" onSubmit={send} data-reveal>
          <div className="ficha-head">
            <strong>{f.title}</strong>
            <span className="ficha-tape" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</span>
          </div>
          <label className="ficha-field">
            <span>{f.name.label}</span>
            <input value={name} onChange={(e) => { play('key'); setName(e.target.value) }} placeholder={f.name.placeholder} autoComplete="name" />
          </label>
          {f.groups.map((g) => (
            <fieldset key={g.id} className="ficha-group">
              <legend>{g.label}{g.multi && <small> pode marcar mais de um</small>}</legend>
              <div>
                {g.options.map((opt) => {
                  const on = (pick[g.id] ?? []).includes(opt)
                  return (
                    <button type="button" key={opt} className={`ficha-chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggle(g, opt)}>
                      {on && <Check size={12} weight="bold" aria-hidden="true" />}{opt}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
          <label className="ficha-field">
            <span>{f.note.label}</span>
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={f.note.placeholder} />
          </label>
          <div className="ficha-actions">
            <button type="submit" className="ficha-send"><WhatsappLogo size={18} weight="fill" aria-hidden="true" /> {f.submit}</button>
            {mail && <a href={mail} className="ficha-mail"><EnvelopeSimple size={16} aria-hidden="true" /> {f.email}</a>}
          </div>
        </form>
      </div>
    </section>
  )
}
