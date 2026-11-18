import { useMemo, useState } from 'react'
import { Check, FileText, Printer, X } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import { play } from '@/lib/sounds'

// Montar contrato: modal que só existe rodando local (botão ao lado do WhatsApp na /proposta).
// O cliente escolhe família, plano, cobrança, adicionais e serviços opcionais;
// a conta sai na hora, ele diz se está de acordo e o resumo vira um termo para imprimir/salvar em PDF.
// Os valores vêm dos próprios slides (pages.json), então mudar lá muda aqui.
const brl = (v) => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 })
const num = (s) => { const m = /R\$\s*([\d.]+(?:,\d+)?)/.exec(s || ''); return m ? Number(m[1].replace(/\./g, '').replace(',', '.')) : null }

function Seg({ label, value, onChange, options }) {
  return (
    <fieldset className="db-field">
      <legend>{label}</legend>
      <div className="db-seg">
        {options.map((o) => (
          <button key={String(o.value)} type="button" aria-pressed={value === o.value} disabled={o.disabled}
            onClick={() => { play('click'); onChange(o.value) }}>
            <span>{o.label}</span>{o.sub && <small>{o.sub}</small>}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function useCatalog() {
  return useMemo(() => {
    const slides = content.pages.proposal.slides
    const by = (k) => slides.find((s) => s.kicker === k)
    const fam = (k, id, label) => {
      const s = by(k)
      return {
        id, label,
        plans: s.plans.rows.map((r) => ({ name: r[0], price: num(r[1]), raw: r[1], cap: r[2], team: r[3] })).filter((p) => p.price != null),
        billing: s.billing,
        extra: s.addons ? num(s.addons.rows[0][1]) : null,
      }
    }
    const as = by('implantação assistida')
    const sd = by('sob medida · o que entra')
    const sm = by('sob medida')
    return {
      fams: [fam('planos · estrutura', 'estrutura', 'Estrutura'), fam('planos · relacionamento', 'relacionamento', 'Relacionamento')],
      onboarding: as.options.rows.map((r) => ({ name: r[0], price: num(r[1]) ?? 0, raw: r[1], text: r[2] })),
      sob: { price: num(sm.price.value), sub: sm.price.sub },
      extras: sd.extras.items.map((x) => ({ name: x.name, price: num(x.price) })),
    }
  }, [])
}

export default function DealBuilder({ onClose }) {
  const [clientName, setClientName] = useState('')
  const client = { name: clientName || 'cliente', contract: { number: `AT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`, provider: { name: 'Samara Silvia Sabino', email: 'contato@atelierin.com.br' } } }
  const C = useCatalog()
  const [famId, setFam] = useState('relacionamento')
  const F = C.fams.find((f) => f.id === famId)
  const [planName, setPlan] = useState(F.plans[0].name)
  const plan = F.plans.find((p) => p.name === planName) ?? F.plans[0]
  const [bid, setBid] = useState('mensal')
  const b = F.billing.find((x) => x.id === bid) ?? F.billing[0]
  const [extra, setExtra] = useState(0)
  const [onb, setOnb] = useState(-1)
  const [sob, setSob] = useState(false)
  const [logo, setLogo] = useState(false)
  const [lp, setLp] = useState(false)
  const [agree, setAgree] = useState(null)
  const [open, setOpen] = useState(false)

  const pickFam = (id) => { setFam(id); const nf = C.fams.find((f) => f.id === id); setPlan(nf.plans[0].name); setExtra(0) }

  const disc = b.discount || 0
  const extraUnit = F.extra ?? 0
  const monthly = plan.price * (1 - disc) + extra * extraUnit
  const period = monthly * b.months
  const once = [
    onb >= 0 && { label: `Implantação assistida · ${C.onboarding[onb].name}`, value: C.onboarding[onb].price },
    sob && { label: 'Sob medida', value: C.sob.price },
    sob && logo && { label: `Sob medida · ${C.extras[0].name}`, value: C.extras[0].price },
    sob && lp && { label: `Sob medida · ${C.extras[1].name}`, value: C.extras[1].price },
  ].filter(Boolean)
  const onceTotal = once.reduce((a, x) => a + x.value, 0)
  const year1 = monthly * 12 + onceTotal
  const lines = [
    { label: `Plano ${plan.name} (${F.label})${disc ? ` · ${b.label}` : ''}`, value: plan.price * (1 - disc), was: disc ? plan.price : null, per: 'por mês' },
    extra > 0 && { label: `${extra} conta${extra > 1 ? 's' : ''} externa${extra > 1 ? 's' : ''} adicional${extra > 1 ? 'is' : ''} × ${brl(extraUnit)}`, value: extra * extraUnit, per: 'por mês' },
  ].filter(Boolean)

  const summary = { client, F, plan, b, lines, monthly, period, once, onceTotal, year1, agree }

  return (
    <div className="db-modal" role="dialog" aria-modal="true" aria-label="Montar contrato" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="db-modal-box db-big-box" data-theme="light">
        <header>
          <div><p className="pn-kick">› só no localhost</p><h3 className="display">Montar contrato</h3></div>
          <button type="button" onClick={onClose} aria-label="Fechar"><X size={22} /></button>
        </header>
        <label className="db-client"><span>Cliente</span><input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nome do cliente" /></label>
        <div className="db-grid">
          <div className="db-form" data-reveal>
            <Seg label="Família" value={famId} onChange={pickFam} options={C.fams.map((f) => ({ value: f.id, label: f.label, sub: f.id === 'estrutura' ? 'sem portal' : 'com portal' }))} />
            <Seg label="Plano" value={plan.name} onChange={setPlan} options={F.plans.map((p) => ({ value: p.name, label: p.name, sub: `${brl(p.price)}/mês · ${p.cap}` }))} />
            <Seg label="Cobrança" value={bid} onChange={setBid} options={F.billing.map((x) => ({ value: x.id, label: x.label }))} />
            {F.extra != null && (
              <div className="db-field">
                <label htmlFor="db-extra">Contas externas adicionais <b>{extra}</b> <small>{brl(F.extra)} cada, até 10</small></label>
                <input id="db-extra" type="range" min="0" max="10" value={extra} onChange={(e) => setExtra(+e.target.value)} />
              </div>
            )}
            <Seg label="Implantação assistida (opcional)" value={onb} onChange={setOnb}
              options={[{ value: -1, label: 'Não quero', sub: 'faço meus cadastros' }, ...C.onboarding.map((o, i) => ({ value: i, label: o.name, sub: o.raw }))]} />
            <Seg label="Sob medida (opcional)" value={sob} onChange={(v) => { setSob(v); if (!v) { setLogo(false); setLp(false) } }}
              options={[{ value: false, label: 'Não quero' }, { value: true, label: 'Sob medida', sub: `${brl(C.sob.price)} · ${C.sob.sub}` }]} />
            <div className="db-row2">
              <Seg label={`+ ${C.extras[0].name}`} value={logo} onChange={setLogo}
                options={[{ value: false, label: 'Não' }, { value: true, label: `+ ${brl(C.extras[0].price)}`, disabled: !sob }]} />
              <Seg label={`+ ${C.extras[1].name}`} value={lp} onChange={setLp}
                options={[{ value: false, label: 'Não' }, { value: true, label: `+ ${brl(C.extras[1].price)}`, disabled: !sob }]} />
            </div>
          </div>

          <aside className="db-sum" data-reveal aria-live="polite">
            <p className="db-sum-k">resumo</p>
            <div className="db-sum-plan"><span>{F.label}</span><strong>{plan.name}</strong></div>
            <ul>
              {lines.map((l) => <li key={l.label}><span>{l.label}</span><b>{l.was != null && <s>{brl(l.was)}</s>}{brl(l.value)}</b></li>)}
            </ul>
            <div className="db-big"><span>por mês</span><strong>{brl(monthly)}</strong></div>
            {b.months > 1 && <p className="db-note">cobrado {brl(period)} {b.months === 3 ? 'a cada 3 meses' : 'por ano'}</p>}
            {once.length > 0 && (
              <>
                <p className="db-sum-k">pagamento único</p>
                <ul>{once.map((l) => <li key={l.label}><span>{l.label}</span><b>{brl(l.value)}</b></li>)}</ul>
                <div className="db-mid"><span>total único</span><strong>{brl(onceTotal)}</strong></div>
              </>
            )}
            <div className="db-mid"><span>1º ano, tudo somado</span><strong>{brl(year1)}</strong></div>

            <div className="db-agree">
              <button type="button" className={agree === true ? 'is-on' : ''} onClick={() => { play('click'); setAgree(true) }}><Check size={16} weight="bold" aria-hidden="true" /> Estou de acordo</button>
              <button type="button" className={agree === false ? 'is-off' : ''} onClick={() => { play('click'); setAgree(false) }}><X size={16} aria-hidden="true" /> Ainda não</button>
            </div>
            {agree === false && <p className="db-note">Sem problema. Me diz o que você mudaria e a gente ajusta.</p>}
            <button type="button" className="db-contract" onClick={() => { play('click'); setOpen(true) }}><FileText size={20} aria-hidden="true" /> Ver contrato</button>
          </aside>
        </div>
      </div>
      {open && <Term s={summary} onClose={() => setOpen(false)} />}
    </div>
  )
}

const FIELDS = [['cNome', 'Nome completo da contratante'], ['cDoc', 'CPF ou CNPJ da contratante'], ['cEnd', 'Endereço da contratante'], ['cEmail', 'E-mail da contratante']]

function Term({ s, onClose }) {
  const [f, setF] = useState(() => (s.client.name && s.client.name !== 'cliente' ? { cNome: s.client.name } : {}))
  const C = s.client.contract ?? {}
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const blank = (v, w = 260) => (v && v.trim() ? esc(v.trim()) : `<span style="display:inline-block;width:${w}px;border-bottom:1px solid #1A0F0F"></span>`)
  const row = (l) => `<tr><td>${esc(l.label)}</td><td style="text-align:right;white-space:nowrap">${brl(l.value)}</td></tr>`

  const print = () => {
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Contrato ${esc(C.number || '')} · ${esc(s.client.name)}</title>
<style>body{font:15px/1.6 Georgia,serif;color:#1A0F0F;max-width:760px;margin:40px auto;padding:0 24px}h1{font:600 26px/1.2 Georgia,serif;margin:0 0 4px}h2{font:600 15px/1.3 Georgia;text-transform:uppercase;letter-spacing:.08em;margin:28px 0 8px;color:#8B1410}
.k{font:12px/1 monospace;letter-spacing:.14em;text-transform:uppercase;color:#7A5A5A}table{width:100%;border-collapse:collapse}td{padding:7px 0;border-bottom:1px dashed #C8B8B0}tfoot td{font-weight:700;border-bottom:0;border-top:1.5px solid #1A0F0F}
.sig{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:64px}.sig div{border-top:1px solid #1A0F0F;padding-top:6px;font-size:13px}.ok{padding:10px 14px;border:1.5px solid #8B1410;color:#8B1410;margin-top:18px}</style></head><body>
<p class="k">contrato ${esc(C.number || '')} · atelierin</p><h1>Contrato de licença de uso e serviços · Atelierin</h1><p>${today}</p>
<h2>Partes</h2><p><b>Contratada:</b> ${esc(C.provider?.name || 'Samara Silvia Sabino')}, ${esc(C.provider?.email || '')}.<br><b>Contratante:</b> ${blank(f.cNome)}, CPF/CNPJ ${blank(f.cDoc, 180)}, endereço ${blank(f.cEnd)}, e-mail ${blank(f.cEmail, 220)}.</p>
<h2>Plano e cobrança</h2><p>Família ${esc(s.F.label)}, plano ${esc(s.plan.name)}, cobrança ${esc(s.b.label.toLowerCase())}.</p>
<table>${s.lines.map(row).join('')}<tfoot><tr><td>Por mês</td><td style="text-align:right">${brl(s.monthly)}</td></tr></tfoot></table>
${s.b.months > 1 ? `<p>Cobrado ${brl(s.period)} ${s.b.months === 3 ? 'a cada 3 meses' : 'por ano'}.</p>` : ''}
${s.once.length ? `<h2>Serviços de pagamento único</h2><table>${s.once.map(row).join('')}<tfoot><tr><td>Total</td><td style="text-align:right">${brl(s.onceTotal)}</td></tr></tfoot></table>` : ''}
<h2>Condições</h2><p>O Atelierin é utilizado por licença de uso enquanto a assinatura estiver ativa; o código-fonte e a plataforma continuam pertencendo ao Atelierin. Os dados da operação são da contratante e podem ser exportados antes do encerramento. Os pagamentos dos clientes da contratante são feitos diretamente a ela. O cancelamento deve ser comunicado com 30 dias de antecedência; nos três primeiros meses após a ativação, aplica-se uma taxa equivalente a uma mensalidade do plano vigente. Contratações online por pessoa física mantêm o direito de arrependimento de 7 dias (CDC).</p>
<p><b>Total estimado no 1º ano:</b> ${brl(s.year1)}.</p>
${s.agree ? `<p class="ok">A contratante declarou estar de acordo com os valores acima em ${today}.</p>` : ''}
<div class="sig"><div>${esc(C.provider?.name || 'Samara Silvia Sabino')}<br>contratada</div><div>${f.cNome ? esc(f.cNome) : '&nbsp;'}<br>contratante</div></div>
<script>window.onload=()=>window.print()</script></body></html>`
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(html); w.document.close()
  }

  return (
    <div className="db-modal" role="dialog" aria-modal="true" aria-label="Contrato">
      <div className="db-modal-box" data-theme="light">
        <header><div><p className="pn-kick">contrato {C.number}</p><h3 className="display">Dados para o contrato</h3></div><button type="button" onClick={onClose} aria-label="Fechar"><X size={20} /></button></header>
        <div className="db-modal-grid">
          {FIELDS.map(([k, label]) => (
            <label key={k}><span>{label}</span><input value={f[k] ?? ''} onChange={(e) => setF((o) => ({ ...o, [k]: e.target.value }))} placeholder="em branco vira linha para preencher à mão" /></label>
          ))}
        </div>
        <div className="db-modal-sum">
          <span>{s.F.label} · {s.plan.name} · {s.b.label}</span>
          <span>por mês <b>{brl(s.monthly)}</b></span>
          {s.onceTotal > 0 && <span>único <b>{brl(s.onceTotal)}</b></span>}
          <span>1º ano <b>{brl(s.year1)}</b></span>
          <span>{s.agree === true ? 'de acordo ✓' : s.agree === false ? 'ainda não de acordo' : 'sem resposta ainda'}</span>
        </div>
        <footer><button type="button" className="db-contract" onClick={print}><Printer size={18} aria-hidden="true" /> Gerar contrato (imprimir ou salvar PDF)</button></footer>
      </div>
    </div>
  )
}
