import { useState } from 'react'
import { content } from '@/lib/content'
import { setAb, useAb } from '@/lib/ab'

// Painel flutuante para trocar as versões do teste A/B. Só no `yarn dev`.
const TESTS = [
  { key: 'faixa', label: 'Faixa do topo', def: () => content.founder?.announce?.style || 'fixa', options: [['fixa', 'Fixa'], ['fixa-mono', 'Fixa mono'], ['letreiro', 'Letreiro'], ['letreiro-mono', 'Letreiro mono']] },
  { key: 'fundador', label: 'Fundador em Planos', def: () => content.founder?.planStyle || 'card', options: [['card', 'A · card'], ['dentro', 'B · dentro']] },
  { key: 'selo', label: 'Selo do −20% no modal', def: () => content.founder?.modal?.badgeStyle || 'retro', options: [['retro', 'Retrô'], ['branco', 'Branco'], ['vidro', 'Vidro carmim']] },
  { key: 'modal', label: 'Imagem do modal', def: () => content.founder?.modal?.imageStyle || 'foto', options: [['foto', 'Foto'], ['noir', 'Topo noir'], ['carmim', 'Topo carmim'], ['areia', 'Topo areia']] },
]

function Row({ t }) {
  const v = useAb(t.key, t.def())
  return (
    <fieldset className="ab-row">
      <legend>{t.label}</legend>
      <div>
        {t.options.map(([val, label]) => (
          <button key={val} type="button" aria-pressed={v === val} onClick={() => setAb(t.key, val)}>{label}</button>
        ))}
      </div>
    </fieldset>
  )
}

export default function AbPanel() {
  const [open, setOpen] = useState(false)
  if (!import.meta.env.DEV) return null
  return (
    <div className={`ab-panel ${open ? 'is-open' : ''}`}>
      {open && (
        <div className="ab-box" role="dialog" aria-label="Teste A/B">
          {TESTS.map((t) => <Row key={t.key} t={t} />)}
          <button type="button" className="ab-reset" onClick={() => TESTS.forEach((t) => setAb(t.key, null))}>Voltar ao padrão</button>
        </div>
      )}
      <button type="button" className="ab-fab" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Teste A/B</button>
    </div>
  )
}
