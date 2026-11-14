import { useSyncExternalStore } from 'react'

// Teste A/B das peças de promoção. A escolha fica na URL (?faixa=b&fundador=b),
// então dá para mandar o link de uma versão para alguém. Sem nada na URL,
// vale o padrão do content.json. O painel "Teste A/B" (components/AbPanel.jsx)
// só aparece no `yarn dev`.
const listeners = new Set()
const notify = () => listeners.forEach((l) => l())
if (typeof window !== 'undefined') window.addEventListener('popstate', notify)

export function setAb(key, value) {
  const url = new URL(window.location.href)
  if (value == null) url.searchParams.delete(key)
  else url.searchParams.set(key, value)
  window.history.replaceState(null, '', url)
  notify()
}

export function useAb(key, fallback) {
  const v = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    () => new URLSearchParams(window.location.search).get(key),
    () => null
  )
  return v ?? fallback
}
