import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Seal, WhatsappLogo, X } from '@phosphor-icons/react'
import { content, whatsappWith } from '@/lib/content'
import { play } from '@/lib/sounds'
import Waitlist from '@/components/Waitlist'
import { useAb } from '@/lib/ab'
import { FounderLink } from '@/sections/Founder'

// Promoção de cliente fundador (PRD-008): faixa fixa acima do topo e modal ao
// abrir o site. As duas leem content.founder: com "open": false (vagas
// encerradas) ou "enabled": false no bloco, nenhuma aparece.
const live = (f) => f && f.enabled !== false && f.open

// Faixa fixa acima da barra do topo. Avisa o CSS da altura (--promo-h)
// para a barra descer e não ficar por cima.
export function PromoBar({ hidden }) {
  const f = content.founder
  const a = f?.announce
  const show = live(f) && a?.enabled !== false && !hidden
  // Duas versões para comparar (A/B): "fixa" (frase parada, centralizada) e
  // "letreiro" (mono, andando em loop). Padrão em announce.style; o painel
  // "Teste A/B" (yarn dev) ou ?faixa=letreiro na URL troca na hora.
  const style = useAb('faixa', a?.style || 'fixa')
  useEffect(() => {
    const root = document.documentElement
    if (show) root.classList.add('has-promo')
    else root.classList.remove('has-promo')
    return () => root.classList.remove('has-promo')
  }, [show])
  if (!show) return null

  if (style === 'fixa') {
    return (
      <div className="promo-bar is-static" role="region" aria-label={f.piece}>
        <a href={f.link.href} onClick={() => play('click')}>
          <Seal size={15} weight="fill" aria-hidden="true" />
          <b>{a.text}</b>
          <span className="promo-sub">{a.sub}</span>
          <span className="promo-go">{a.link} <ArrowRight size={13} weight="bold" aria-hidden="true" /></span>
        </a>
      </div>
    )
  }

  // letreiro: a mesma frase repetida, em duas metades iguais, para o loop
  // não ter emenda (a animação anda exatamente meia faixa)
  const item = (k) => (
    <span className="promo-item" key={k}>
      <Seal size={13} weight="fill" aria-hidden="true" />
      <b>{a.text}</b><span className="promo-sub">{a.sub}</span>
      <span className="promo-go">{a.link} <ArrowRight size={12} weight="bold" aria-hidden="true" /></span>
    </span>
  )
  const half = (h) => <span className="promo-half" aria-hidden={h ? 'true' : undefined}>{[0, 1, 2, 3].map((i) => item(`${h}-${i}`))}</span>
  return (
    <div className="promo-bar is-marquee" role="region" aria-label={f.piece}>
      <a href={f.link.href} onClick={() => play('click')} aria-label={`${a.text}, ${a.sub}. ${a.link}`}>
        <span className="promo-track">{half(0)}{half(1)}</span>
      </a>
    </div>
  )
}

// Modal que abre toda vez que a página carrega (de propósito, é promoção).
// Fecha no X, no Esc ou clicando fora. Não abre nas propostas de cliente.
export function PromoModal({ hidden }) {
  const f = content.founder
  const m = f?.modal
  const show = live(f) && m?.enabled !== false && !hidden
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => setOpen(true), 700)
    return () => clearTimeout(t)
  }, [show])

  // botões da página podem abrir o modal de novo (ex.: "Quero uma vaga" da versão B)
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('promo:open', onOpen)
    return () => window.removeEventListener('promo:open', onOpen)
  }, [])

  useEffect(() => {
    const dlg = ref.current
    if (open && dlg && !dlg.open) dlg.showModal()
  }, [open])

  if (!live(f) || m?.enabled === false || !open) return null
  const close = () => { ref.current?.close(); setOpen(false) }

  return (
    <dialog ref={ref} className="promo-modal" data-theme="light" aria-labelledby="promo-t"
      onClose={() => setOpen(false)} onCancel={() => setOpen(false)}
      onClick={(e) => { if (e.target === ref.current || e.target.closest('a[href^="/"]')) close() }}>
      <div className="promo-card">
        <button type="button" className="promo-x" onClick={() => { play('click'); close() }} aria-label={m.close}><X size={18} /></button>
        <figure className="promo-img">
          <img src={m.image} alt={m.imageAlt} />
          <div className="promo-img-badge"><strong>{f.badge}</strong><span>{f.badgeSub}</span></div>
        </figure>
        <div className="promo-body">
          <p className="founder-status"><i aria-hidden="true" />{m.label}</p>
          <h2 id="promo-t" className="display">{m.title} <em>{m.titleAccent}</em></h2>
          <p className="promo-text">{m.text}</p>
          <Waitlist cfg={f.waitlist} extra={<FounderLink f={f} />} />
          <a className="founder-wa" href={whatsappWith(f.cta.message)} target="_blank" rel="noopener noreferrer">
            <WhatsappLogo size={15} weight="fill" aria-hidden="true" /> {f.whatsappLabel}
          </a>
        </div>
      </div>
    </dialog>
  )
}
