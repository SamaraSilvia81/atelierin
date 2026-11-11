import { useEffect, useSyncExternalStore } from 'react'

// Roteador mínimo (sem dependência): lê o caminho da URL e troca de página
// com history.pushState. As âncoras (#secao) continuam funcionando.
// No deploy (Cloudflare Pages) o public/_redirects manda tudo para o index.html.
const listeners = new Set()
const notify = () => listeners.forEach((l) => l())
if (typeof window !== 'undefined') window.addEventListener('popstate', notify)

export function usePath() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    () => window.location.pathname.replace(/\/+$/, '') || '/',
    () => '/'
  )
}

export function navigate(to) {
  const [path, hash] = to.split('#')
  const samePage = (path || '/') === (window.location.pathname.replace(/\/+$/, '') || '/')
  if (!samePage) {
    window.history.pushState(null, '', to)
    notify()
    window.scrollTo(0, 0)
  } else if (!hash) window.scrollTo({ top: 0, behavior: 'smooth' })
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: samePage ? 'smooth' : 'auto' }))
}

// Intercepta cliques em links internos (href começando com "/") em qualquer lugar
export function useLinkInterceptor() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href^="/"]')
      if (!a || a.target === '_blank') return
      e.preventDefault()
      navigate(a.getAttribute('href'))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

// Ao abrir uma página com #ancora direto na URL, rola até ela
export function useInitialHash() {
  useEffect(() => {
    const h = window.location.hash.slice(1)
    if (h) setTimeout(() => document.getElementById(h)?.scrollIntoView(), 300)
  }, [])
}
