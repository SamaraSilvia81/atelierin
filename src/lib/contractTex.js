// Preenche os modelos LaTeX (src/content/contrato.tex e fatura.tex) com as
// escolhas da reunião e os dados das partes. Blocos condicionais nos modelos:
//   %<IF:chave> ... %</IF:chave>     entra quando a chave é verdadeira
//   %<IFNOT:chave> ... %</IFNOT:chave> entra quando é falsa
// Campos: <<CHAVE>>. Tudo que vem digitado passa por esc() antes de entrar.

const TEX = { '\\': '\\textbackslash{}', '&': '\\&', '%': '\\%', $: '\\$', '#': '\\#', _: '\\_', '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' }
export const esc = (s) => String(s ?? '').replace(/[\\&%$#_{}~^]/g, (c) => TEX[c])
const money = (v) => 'R\\$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const filled = (v) => v && v.trim()

// Valor por extenso em reais (até 999.999,99)
const UN = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
const DZ = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
const CT = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']
function ate999(n) {
  if (n === 100) return 'cem'
  const c = Math.floor(n / 100), r = n % 100, parts = []
  if (c) parts.push(CT[c])
  if (r) parts.push(r < 20 ? UN[r] : DZ[Math.floor(r / 10)] + (r % 10 ? ' e ' + UN[r % 10] : ''))
  return parts.join(' e ')
}
function extenso(v) {
  const cents = Math.round(v * 100) % 100
  const reais = Math.floor(Math.round(v * 100) / 100)
  const mil = Math.floor(reais / 1000), resto = reais % 1000
  const parts = []
  if (mil) parts.push(mil === 1 ? 'mil' : `${ate999(mil)} mil`)
  if (resto) parts.push(ate999(resto))
  let txt = parts.length === 2 && (resto < 100 || resto % 100 === 0) ? parts.join(' e ') : parts.join(' ')
  txt = reais ? `${txt} ${reais === 1 ? 'real' : 'reais'}` : ''
  if (cents) txt += `${reais ? ' e ' : ''}${ate999(cents)} ${cents === 1 ? 'centavo' : 'centavos'}`
  return txt
}
const NUM = ['', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez']

function applyFlags(tpl, flags) {
  let out = tpl
  for (const [k, on] of Object.entries(flags)) {
    out = out.replace(new RegExp(`%<IF:${k}>\\n([\\s\\S]*?)%</IF:${k}>\\n`, 'g'), on ? '$1' : '')
    out = out.replace(new RegExp(`%<IFNOT:${k}>\\n([\\s\\S]*?)%</IFNOT:${k}>\\n`, 'g'), on ? '' : '$1')
  }
  return out
}
const fill = (tpl, map) => tpl.replace(/<<([A-Z_]+)>>/g, (m, k) => (k in map ? map[k] : m))

function common({ client, slug, picks, deal: d, fields }, file) {
  const C = client.contract
  const now = new Date()
  const f = (k) => (filled(fields[k]) ? esc(fields[k].trim()) : null)
  const cNome = f('cNome') ?? esc(client.name)
  const itens = d.items.map((it) => {
    const ref = it.was != null ? ` {\\footnotesize\\color{cinza}(${it.note ? 'valor de referência' : 'avulsa'}: ${money(it.was)})}` : ''
    return `    ${esc(it.label)}${ref} & ${it.note ? esc(it.note) : money(it.value)} \\\\`
  }).join('\n')
  return {
    GERADO_EM: now.toLocaleString('pt-BR'),
    SLUG: slug,
    ARQUIVO: file,
    NUMERO: esc(C.number),
    FATURA_NUM: esc(C.invoiceNumber),
    HOST: esc(C.host),
    CLIENTE: cNome,
    DATA: now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    DATA_CURTA: now.toLocaleDateString('pt-BR'),
    P_NOME: esc(C.provider.name),
    P_EMAIL: esc(C.provider.email),
    C_NOME: f('cNome') ?? `${esc(client.name)} \\linha{4cm}`,
    ITENS: itens,
    TOTAL: money(d.total),
    MENSAL: d.monthly != null ? money(d.monthly) : 'valor a combinar',
    FAIXA: d.tier ? esc(d.tier.label) : 'acima de 50 alunos',
    VENC: String(picks.dueDay),
    _f: f,
  }
}

export function buildContractTex(tpl, ctx) {
  const { client, picks, deal: d } = ctx
  const basica = picks.identity === 'basica'
  const base = common(ctx, `contrato-${ctx.slug}.tex`)
  const f = base._f
  const first = String(client.name).split(' ')[0].toUpperCase()
  const map = {
    ...base,
    P_NOME_UP: base.P_NOME.toUpperCase(),
    C_NOME_UP: f('cNome') ? f('cNome').toUpperCase() : '\\linha{6cm}',
    P_DOC: f('pDoc') ?? '\\linha{4cm}',
    P_END: f('pEnd') ?? '\\linha{5cm}',
    C_DOC: f('cDoc') ?? '\\linha{4cm}',
    C_END: f('cEnd') ?? '\\linha{5cm}',
    C_EMAIL: f('cEmail') ?? '\\linha{5cm}',
    CLIENTE_CAPA: esc(first),
    C_NOME_CAPA: f('cNome') ?? esc(client.name),
    C_NOME_ASSINA: f('cNome') ?? '',
    P_DOC_ASSINA: f('pDoc') ? `CPF/CNPJ ${f('pDoc')}` : 'CPF/CNPJ:',
    C_DOC_ASSINA: f('cDoc') ? `CPF/CNPJ ${f('cDoc')}` : 'CPF/CNPJ:',
    OPCAO: d.lp ? 'Completo: ambiente Personalizado e landing page' : 'Para começar: ambiente Personalizado',
    IDENTIDADE: basica ? `Identidade básica (${money(client.pricing.identityBasic)})` : 'Monograma, como cortesia',
    TOTAL_EXT: extenso(d.total),
    FORMA: d.n === 1 ? 'à vista, por Pix, na assinatura' : `${d.n} parcelas mensais de ${money(d.installment)}, sem juros, por Pix`,
    FORMA_CURTA: d.n === 1 ? 'à vista, no Pix' : `${d.n}x de ${money(d.installment)}, sem juros`,
    VIDEO_CURTO: picks.video === 'bunny' ? `Bunny Stream, ~${money(client.pricing.bunny)}/mês à parte` : 'YouTube ou Google Drive',
    MENSAL_EXT: d.monthly != null ? extenso(d.monthly) : 'a combinar',
    MENSAL_TABELA: d.monthlyTable != null ? money(d.monthlyTable) : 'valor a combinar',
    DESCONTO: String(Math.round((d.discount || 0) * 100)),
    DESCONTO_EXT: ate999(Math.round((d.discount || 0) * 100)),
    REAJUSTE: picks.lockPrice ? 'travado por 12 meses; depois, anual pelo IPCA' : 'anual, pelo IPCA',
    VIDEO: picks.video === 'bunny' ? `Bunny Stream, custo repassado (estimado em ${money(client.pricing.bunny)} por mês)` : 'YouTube ou Google Drive, sem custo',
    MONOGRAMA: money(client.pricing.monogram),
    BUNNY: money(client.pricing.bunny),
    IDENT_NOME_MIN: basica ? 'identidade básica' : 'monograma',
    IDENT_PRAZO: esc(client.contract.identityDeadline),
    LP_PRAZO: d.lp ? '; landing page, 3 (três) dias úteis, podendo chegar a 5 (cinco)' : '',
    PAGAMENTO: d.n === 1
      ? `O valor total será pago à vista, por Pix, na data de assinatura deste contrato.`
      : `O valor total será pago em ${d.n} (${NUM[d.n] ?? d.n}) parcelas mensais e sucessivas de ${money(d.installment)} (${extenso(d.installment)}), sem juros, por Pix, vencendo a primeira na data de assinatura deste contrato e as demais no mesmo dia dos meses subsequentes.`,
  }
  delete map._f
  return fill(applyFlags(tpl, { basica, lp: d.lp, lock: !!picks.lockPrice, bunny: picks.video === 'bunny', fundador: !!d.founder }), map)
}

export function buildInvoiceTex(tpl, ctx) {
  const { deal: d } = ctx
  const base = common(ctx, `fatura-${ctx.slug}.tex`)
  const f = base._f
  const start = new Date()
  const parcelas = Array.from({ length: d.n }, (_, i) => {
    const dt = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const last = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate()
    dt.setDate(Math.min(start.getDate(), last))
    return `  ${i + 1}/${d.n} & ${dt.toLocaleDateString('pt-BR')}${i === 0 ? ' {\\footnotesize\\color{cinza}(na assinatura)}' : ''} & ${money(d.installment)} \\\\`
  }).join('\n')
  const map = {
    ...base,
    P_DOC_LINHA: f('pDoc') ? `CPF/CNPJ ${f('pDoc')}` : 'CPF/CNPJ \\linha{3.5cm}',
    C_DOC_LINHA: f('cDoc') ? `CPF/CNPJ ${f('cDoc')}` : 'CPF/CNPJ \\linha{3.5cm}',
    C_END_LINHA: f('cEnd') ?? 'Endereço \\linha{5cm}',
    C_EMAIL_LINHA: f('cEmail') ?? 'E-mail \\linha{5cm}',
    P_PIX: f('pPix') ?? '\\linha{5cm}',
    FORMA_FRASE: d.n === 1 ? 'Pagamento à vista, por Pix, na assinatura do contrato.' : `Pagamento em ${d.n} parcelas mensais de ${money(d.installment)}, sem juros, por Pix.`,
    PARCELAS: parcelas,
  }
  delete map._f
  return fill(tpl, map)
}
