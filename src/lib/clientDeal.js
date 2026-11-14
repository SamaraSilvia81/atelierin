import { useEffect, useState } from 'react'
import { content } from '@/lib/content'

// Escolhas da reunião (proposta do cliente) e a conta que sai delas.
// Ficam no sessionStorage só para a página do contrato ler; nada vai para servidor.

export const brl = (v) => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const brl0 = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR')

export function defaults(client) {
  const d = client?.deal ?? {}
  return {
    offer: d.offer ?? 'comecar',
    students: d.students ?? 30,
    identity: 'monograma',
    installments: 10,
    dueDay: 10,
    video: 'youtube',
    lockPrice: false,
    founder: d.founder ?? false,
  }
}

export function compute(client, picks) {
  const P = client.pricing
  const tiers = content.plans.pricing.tiers
  const tier = tiers.find((t) => picks.students <= t.max) ?? null
  const lp = picks.offer === 'completo'
  const identityPrice = picks.identity === 'basica' ? P.identityBasic : 0
  const items = [
    { label: 'Implantação do ambiente Personalizado', value: P.setup },
    picks.identity === 'basica'
      ? { label: 'Identidade básica (logo, paleta, tipografia e dois mockups)', value: P.identityBasic }
      : { label: 'Monograma (nome, paleta e ícone com a inicial)', value: 0, was: P.monogram, note: 'cortesia' },
    { label: 'Página simples no endereço do ambiente', value: 0, note: 'inclusa' },
  ]
  if (lp) items.push({ label: 'Landing page completa (combo)', value: P.lpCombo, was: P.lpAlone })
  const total = P.setup + identityPrice + (lp ? P.lpCombo : 0)
  const n = Math.max(1, Math.min(P.maxInstallments, picks.installments))
  // Cliente fundador (PRD-008): desconto sobre a tabela vigente, regra em content.founder
  const founder = !!picks.founder
  const discount = founder ? (content.founder?.discount ?? 0) : 0
  const monthlyTable = tier ? tier.price : null
  const monthly = tier ? Math.round(tier.price * (1 - discount) * 100) / 100 : null
  return {
    tier, lp, items, total, n,
    installment: total / n,
    founder, discount, monthlyTable,
    monthly,
    bunny: picks.video === 'bunny' ? P.bunny : 0,
    year1: monthly != null ? total + 12 * monthly : null,
  }
}

export function useDeal(slug, client) {
  const key = `deal:${slug}`
  const [picks, setPicks] = useState(() => {
    try { return { ...defaults(client), ...JSON.parse(sessionStorage.getItem(key) || '{}') } } catch { return defaults(client) }
  })
  useEffect(() => { try { sessionStorage.setItem(key, JSON.stringify(picks)) } catch { /* sem storage, segue em memória */ } }, [key, picks])
  const set = (k) => (v) => setPicks((p) => ({ ...p, [k]: v }))
  return [picks, set]
}
