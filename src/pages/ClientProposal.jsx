import { useEffect, useState } from 'react'
import Proposal from '@/pages/Proposal'

// Proposta de um cliente: /proposta/<cliente>.
// Os dados ficam em /proposta/<cliente>/dados.json, fora do código do site.
// O caminho /proposta/<cliente> é protegido pelo Cloudflare Access (só quem
// está liberado abre). Sem acesso, o fetch falha e a página avisa.
export default function ClientProposal({ slug }) {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    let alive = true
    fetch(`/proposta/${slug}/dados.json`, { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => (r.ok && r.headers.get('content-type')?.includes('json') ? r.json() : Promise.reject()))
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'denied' }))
    return () => { alive = false }
  }, [slug])

  if (state.status === 'ok') return <Proposal client={state.data} />
  return (
    <section data-theme="dark" className="section client-gate">
      <div className="wrap">
        <p className="label"><b aria-hidden="true">&gt;</b> proposta</p>
        <h1 className="display">{state.status === 'loading' ? 'Abrindo…' : 'Esta proposta é privada'}</h1>
        {state.status === 'denied' && <p className="lede">Se ela foi enviada para você, abra pelo link que recebeu e entre com o seu e-mail.</p>}
      </div>
    </section>
  )
}
