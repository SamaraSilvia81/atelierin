import { useEffect, useState } from 'react'
import Proposal from '@/pages/Proposal'
import { useReveal } from '@/lib/useReveal'

// Proposta de um cliente: /proposta/<cliente>, só rodando local (yarn dev).
// Os dados ficam em public/proposta/<cliente>/dados.json, que está no
// .gitignore: não vão para o GitHub nem para o site.
export default function ClientProposal({ slug }) {
  const [state, setState] = useState({ status: 'loading' })
  // os dados chegam depois da página montar: revela de novo quando chegam
  useReveal(state.status)

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

  if (state.status === 'ok') return <Proposal client={state.data} slug={slug} />
  return (
    <section data-theme="dark" className="section client-gate">
      <div className="wrap">
        <p className="label"><b aria-hidden="true">&gt;</b> proposta</p>
        <h1 className="display">{state.status === 'loading' ? 'Abrindo…' : 'Proposta não encontrada'}</h1>
        {state.status === 'denied' && <p className="lede">Confira se existe public/proposta/{slug}/dados.json.</p>}
      </div>
    </section>
  )
}
