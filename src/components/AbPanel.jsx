import { useState } from 'react'
import { content } from '@/lib/content'
import { setAb, useAb } from '@/lib/ab'

// Painel flutuante para trocar as versões do teste A/B. Só no `yarn dev`.
// Os testes antigos (faixa, fundador, selo e modal) eram do cliente fundador, que saiu.
const TESTS = [
  { key: 'oquee', label: 'Nº 01 · o que é', def: () => content.what?.variant || 'a', options: [['a', 'A · atual'], ['b', 'B · arco'], ['c', 'C · editorial']] },
]

function Row({ t }) {
  const v = useAb(t.key, t.def())
  return (
    <fieldset className="ab-row">
      <legend>{t.label}</legend>
      <div className={t.options.length === 3 ? 'is-3' : undefined}>
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
