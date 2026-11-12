// Preenche o modelo LaTeX do contrato (src/content/contrato.tex) com as
// escolhas da reunião e os dados das partes. Blocos condicionais no modelo:
//   %<IF:chave> ... %</IF:chave>     entra quando a chave é verdadeira
//   %<IFNOT:chave> ... %</IFNOT:chave> entra quando é falsa
// Campos: <<CHAVE>>. Tudo que vem digitado passa por esc() antes de entrar.

const TEX = { '\\': '\\textbackslash{}', '&': '\\&', '%': '\\%', $: '\\$', '#': '\\#', _: '\\_', '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' }
export const esc = (s) => String(s ?? '').replace(/[\\&%$#_{}~^]/g, (c) => TEX[c])
const money = (v) => 'R\\$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const EXT = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez']
const blank = (v) => (v && v.trim() ? esc(v.trim()) : '\\linha{6cm}')

export function buildContractTex(tpl, { client, slug, picks, deal: d, fields }) {
  const flags = { basica: picks.identity === 'basica', lp: d.lp, lock: !!picks.lockPrice, bunny: picks.video === 'bunny' }
  let out = tpl
  for (const [k, on] of Object.entries(flags)) {
    out = out.replace(new RegExp(`%<IF:${k}>\\n([\\s\\S]*?)%</IF:${k}>\\n`, 'g'), on ? '$1' : '')
    out = out.replace(new RegExp(`%<IFNOT:${k}>\\n([\\s\\S]*?)%</IFNOT:${k}>\\n`, 'g'), on ? '' : '$1')
  }
  const now = new Date()
  const itens = d.items.map((it) => {
    const ref = it.was != null ? ` {\\small\\textcolor{atelierMuted}{(${it.note ? 'valor de referência' : 'avulsa'}: ${money(it.was)})}}` : ''
    return `  ${esc(it.label)} & ${it.note ? esc(it.note) : money(it.value)}${ref} \\\\`
  }).join('\n')
  const pagamento = d.n === 1
    ? `O valor total de \\textbf{${money(d.total)}} será pago à vista, por Pix, na assinatura deste contrato.`
    : `O valor total de \\textbf{${money(d.total)}} será pago em \\textbf{${d.n} (${EXT[d.n] ?? d.n}) parcelas mensais de ${money(d.installment)}}, sem juros, por Pix. A primeira parcela é paga na assinatura e as demais no mesmo dia dos meses seguintes.`
  const C = client.contract
  const map = {
    GERADO_EM: now.toLocaleString('pt-BR'),
    SLUG: slug,
    ARQUIVO: `contrato-${slug}.tex`,
    ANO: String(now.getFullYear()),
    DATA: now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    HOST: esc(C.host),
    CLIENTE: esc(fields.cNome || client.name),
    P_NOME: esc(C.provider.name),
    P_DOC: blank(fields.pDoc),
    P_END: blank(fields.pEnd),
    P_EMAIL: esc(C.provider.email),
    C_NOME: fields.cNome?.trim() ? esc(fields.cNome.trim()) : `${esc(client.name)} \\linha{4cm}`,
    C_DOC: blank(fields.cDoc),
    C_END: blank(fields.cEnd),
    C_EMAIL: blank(fields.cEmail),
    OBJ_FIM: d.lp ? ';' : '.',
    MONOGRAMA: money(client.pricing.monogram),
    ITENS: itens,
    TOTAL: money(d.total),
    PAGAMENTO: pagamento,
    FAIXA: d.tier ? esc(d.tier.label) : 'acima de 50 alunos',
    MENSAL: d.monthly != null ? money(d.monthly) : 'a combinar entre as partes',
    VENC: String(picks.dueDay),
    BUNNY: money(client.pricing.bunny),
    IDENT_NOME: flags.basica ? 'Identidade básica' : 'Monograma',
    IDENT_PRAZO: esc(C.identityDeadline),
  }
  return out.replace(/<<([A-Z_]+)>>/g, (m, k) => (k in map ? map[k] : m))
}
