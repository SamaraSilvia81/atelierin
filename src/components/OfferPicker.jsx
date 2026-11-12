import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Check, FileText, X, DownloadSimple, FilePdf } from '@phosphor-icons/react'
import { play } from '@/lib/sounds'
import { brl0, compute, useDeal } from '@/lib/clientDeal'
import { buildContractTex } from '@/lib/contractTex'
import tpl from '@/content/contrato.tex?raw'

// Contexto da proposta de cliente (só existe em /proposta/<cliente>, rodando local)
export const ClientCtx = createContext(null)

function Seg({ label, value, onChange, options, wrap }) {
  return (
    <fieldset className="calc-field">
      <legend>{label}</legend>
      <div className={`seg ${wrap ? 'seg-wrap' : ''}`}>
        {options.map((o) => (
          <button key={String(o.value)} type="button" aria-pressed={value === o.value}
            onClick={() => { play('click'); onChange(o.value) }}>{o.label}</button>
        ))}
      </div>
    </fieldset>
  )
}

const FIELDS = [
  ['cNome', 'Nome completo da contratante'],
  ['cDoc', 'CPF ou CNPJ da contratante'],
  ['cEnd', 'Endereço da contratante'],
  ['cEmail', 'E-mail da contratante'],
  ['pDoc', 'Seu CPF ou CNPJ'],
  ['pEnd', 'Seu endereço'],
]

const save = (blob, name) => {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Modal "Redigir contrato": todas as escolhas que mexem em dinheiro, os dados
// das partes e, no fim, o .tex e o PDF (compilado pelo XeLaTeX do computador).
function ContractModal({ client, slug, picks, set, onClose }) {
  const ref = useRef(null)
  const [fields, setFields] = useState({})
  const [status, setStatus] = useState(null)
  const P = client.pricing
  const d = compute(client, picks)

  // sem fechar no cleanup: no modo de desenvolvimento o React monta duas vezes
  // e o close() dispararia o onClose, fechando o modal logo depois de abrir
  useEffect(() => {
    const dlg = ref.current
    if (!dlg.open) dlg.showModal()
  }, [])

  const tex = () => buildContractTex(tpl, { client, slug, picks, deal: d, fields })
  const name = `contrato-${slug}`

  const downloadTex = () => save(new Blob([tex()], { type: 'application/x-tex;charset=utf-8' }), `${name}.tex`)
  const downloadPdf = async () => {
    const source = tex()
    save(new Blob([source], { type: 'application/x-tex;charset=utf-8' }), `${name}.tex`)
    setStatus({ busy: true, text: 'Compilando o PDF…' })
    try {
      const r = await fetch('/__contrato/pdf', { method: 'POST', body: source })
      if (!r.ok) throw new Error(await r.text())
      save(await r.blob(), `${name}.pdf`)
      setStatus({ text: 'Pronto: .tex e .pdf baixados.' })
    } catch (e) {
      setStatus({ error: true, text: `Não consegui gerar o PDF aqui. O .tex foi baixado; compile com XeLaTeX. ${e.message || ''}` })
    }
  }

  return (
    <dialog ref={ref} className="ct-modal" data-theme="light" onClose={onClose} onCancel={onClose}>
      <header className="ct-modal-head">
        <div>
          <p className="label">contrato · {client.contract.host}</p>
          <h2>Redigir contrato</h2>
        </div>
        <button type="button" className="ct-x" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
      </header>

      <div className="ct-modal-body">
        <section>
          <p className="ct-role">escolhas</p>
          <div className="ct-modal-grid">
            <Seg label="Opção" value={picks.offer} onChange={set('offer')}
              options={[{ value: 'comecar', label: 'Para começar' }, { value: 'completo', label: `Completo · + LP ${brl0(P.lpCombo)}` }]} />
            <div className="calc-field">
              <label htmlFor="deal-students">Alunos hoje <b>{picks.students}</b></label>
              <input id="deal-students" type="range" min="1" max="60" value={picks.students} onChange={(e) => set('students')(+e.target.value)} />
              <small className="s-adjust-hint">{d.tier ? `${d.tier.label}: ${brl0(d.tier.price)} por mês` : 'acima de 50: combinado à parte'}</small>
            </div>
            <Seg label="Identidade" value={picks.identity} onChange={set('identity')}
              options={[{ value: 'monograma', label: 'Monograma · cortesia' }, { value: 'basica', label: `Identidade básica · ${brl0(P.identityBasic)}` }]} />
            <div>
              <Seg label="Entrada em" value={picks.installments} onChange={set('installments')} wrap
                options={Array.from({ length: P.maxInstallments }, (_, i) => ({ value: i + 1, label: i ? `${i + 1}x` : 'à vista' }))} />
              <small className="s-adjust-hint">{d.n === 1 ? `${brl0(d.total)} no Pix, na assinatura` : `${d.n}x de ${brl0(d.installment)}, sem juros, a primeira na assinatura`}</small>
            </div>
            <Seg label="Vencimento do mensal" value={picks.dueDay} onChange={set('dueDay')}
              options={[5, 10, 15, 20].map((n) => ({ value: n, label: `dia ${n}` }))} />
            <Seg label="Vídeos" value={picks.video} onChange={set('video')}
              options={[{ value: 'youtube', label: 'YouTube ou Drive' }, { value: 'bunny', label: `Bunny · ~${brl0(P.bunny)}/mês` }]} />
            <Seg label="Reajuste do mensal" value={picks.lockPrice} onChange={set('lockPrice')}
              options={[{ value: false, label: 'Anual' }, { value: true, label: 'Travado 12 meses' }]} />
          </div>
        </section>

        <section>
          <p className="ct-role">dados das partes</p>
          <div className="ct-modal-grid">
            {FIELDS.map(([k, label]) => (
              <label key={k} className="ct-field">
                <span>{label}</span>
                <input value={fields[k] ?? ''} onChange={(e) => setFields((f) => ({ ...f, [k]: e.target.value }))} placeholder="em branco vira linha para preencher à mão" />
              </label>
            ))}
          </div>
        </section>
      </div>

      <footer className="ct-modal-foot">
        <div className="ct-sum">
          <span>Entrada <b>{brl0(d.total)}{d.n > 1 ? ` · ${d.n}x ${brl0(d.installment)}` : ' à vista'}</b></span>
          <span>Por mês <b>{d.monthly != null ? brl0(d.monthly) : 'a combinar'}</b></span>
          {d.year1 != null && <span>1º ano <b>{brl0(d.year1)}</b></span>}
        </div>
        {status && <p className={`ct-status ${status.error ? 'is-error' : ''}`}>{status.text}</p>}
        <div className="ct-actions">
          <button type="button" className="ct-btn" onClick={downloadTex}><DownloadSimple size={16} aria-hidden="true" /> Só o .tex</button>
          <button type="button" className="ct-btn is-main" onClick={downloadPdf} disabled={status?.busy}><FilePdf size={16} aria-hidden="true" /> Gerar .tex e PDF</button>
        </div>
      </footer>
    </dialog>
  )
}

// Slide "sua proposta": as duas opções (clicáveis) e o botão que abre o modal do contrato.
export default function OfferPicker({ s }) {
  const { client, slug } = useContext(ClientCtx)
  const [picks, set] = useDeal(slug, client)
  const [open, setOpen] = useState(false)

  const card = (o) => {
    const d = compute(client, { ...picks, offer: o.id })
    const on = picks.offer === o.id
    return (
      <button key={o.id} type="button" className={`s-option s-pick ${on ? 'is-hl is-on' : ''}`} aria-pressed={on}
        onClick={() => { play('click'); set('offer')(o.id) }}>
        <span className="s-pick-mark" aria-hidden="true">{on && <Check size={14} weight="bold" />}</span>
        <span className="s-option-for">{o.for}</span>
        <strong>{o.name}</strong>
        <ul className="s-offer-lines">
          {d.items.map((it) => (
            <li key={it.label}><span>{it.label.split(' (')[0]}</span>
              <b>{it.was != null && <s>{brl0(it.was)}</s>}{it.note ?? brl0(it.value)}</b></li>
          ))}
        </ul>
        <div className="s-offer-tot">
          <div><span>Entrada</span><strong>{brl0(d.total)}{d.n > 1 && <small> · {d.n}x {brl0(d.installment)}</small>}</strong></div>
          <div><span>Por mês</span><strong>{d.monthly != null ? brl0(d.monthly) : 'sob consulta'}</strong></div>
          {d.year1 != null && <div><span>1º ano</span><strong>{brl0(d.year1)}</strong></div>}
        </div>
      </button>
    )
  }

  return (
    <>
      <div className="s-options s-offer">{s.offers.map(card)}</div>
      <button type="button" className="s-cta s-contract-cta" onClick={() => { play('click'); setOpen(true) }}>
        <FileText size={22} aria-hidden="true" /> Redigir contrato
      </button>
      {open && <ContractModal client={client} slug={slug} picks={picks} set={set} onClose={() => setOpen(false)} />}
    </>
  )
}
