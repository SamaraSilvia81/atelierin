// POST /api/waitlist  (Cloudflare Pages Function)
// Grava o pedido da lista de espera no D1 e manda dois e-mails pelo Resend:
// a confirmação para quem se inscreveu e um aviso interno para NOTIFY_TO.
// Configuração no painel do Cloudflare Pages (Settings):
//   - Bindings > D1: nome DB  -> banco atelierin-landing (db/schema.sql)
//   - Variáveis (secret): RESEND_API_KEY
//   - Variáveis: MAIL_FROM  (ex.: Atelierin <contato@atelierin.com.br>)
//                NOTIFY_TO  (opcional: recebe um aviso a cada pedido novo)
// Sem RESEND_API_KEY o pedido é gravado e nenhum e-mail sai.
// As imagens dos e-mails ficam em public/email/ (servidas pelo próprio site).

const KINDS = new Set(['linha'])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const SITE = 'https://atelierin.com.br'
const IMG = `${SITE}/email`
const WHATSAPP = { href: 'https://wa.me/5581994668775', label: '(81) 99466-8775' }

// paleta do site (tema claro)
const C = {
  areia: '#F2EDE6', linho: '#FDFAF7', tinta: '#1A0F0F', tinta2: '#3D2828',
  poeira: '#7A5A5A', borda: '#C8B8B0', crimson: '#C0211C',
}
const FONT = 'Helvetica,Arial,sans-serif'
const MONO = "'Courier New',monospace"

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

async function sendMail(env, { to, subject, html, text, replyTo }) {
  if (!env.RESEND_API_KEY) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'Atelierin <contato@atelierin.com.br>',
      to, subject, html, text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })
}

// ---------- peças comuns ----------

const label = (t, color = C.crimson) =>
  `<div style="font-family:${MONO};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${color}">${t}</div>`

// cartão no formato da ficha de medidas: borda fina e sombra deslocada
// (a sombra é feita com células, porque o Gmail ignora box-shadow)
const card = (inner, pad = '22px') => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:${C.linho};border:1px solid ${C.tinta};border-radius:4px;padding:${pad}">${inner}</td>
<td width="8" style="background:${C.tinta};border-top:8px solid ${C.areia};font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td height="8" style="background:${C.tinta};border-left:8px solid ${C.areia};font-size:0;line-height:0">&nbsp;</td>
<td width="8" height="8" style="background:${C.tinta};font-size:0;line-height:0">&nbsp;</td></tr>
</table>`

const shell = (inner, preheader) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${C.areia}">
<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.areia};font-family:${FONT}">
<tr><td align="center" style="padding:28px 12px">${inner}</td></tr></table></body></html>`

// ---------- e-mail 1: confirmação para quem se inscreveu ----------

function confirmation(area) {
  const short = esc(area.split(' · ')[0])
  const linha = esc(area)
  const businessCard = card(`
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
 <td valign="middle"><img src="${IMG}/logo.png" width="118" alt="Atelierin" style="display:block;border:0"></td>
 <td valign="middle" style="text-align:right;color:${C.tinta};font-size:13px;line-height:1.55">
  <div style="font-size:16px;font-weight:bold">Samara Silvia Sabino</div>
  <div style="color:${C.tinta2}">Fundadora · Atelierin</div>
  <div style="margin-top:8px"><b>WhatsApp:</b> <a href="${WHATSAPP.href}" style="color:${C.tinta}">${WHATSAPP.label}</a></div>
  <div><a href="${SITE}" style="color:${C.crimson}">atelierin.com.br</a></div>
 </td></tr></table>`)

  const html = shell(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;border-top:4px solid ${C.crimson}">
<tr><td style="padding:28px 32px 0"><img src="${IMG}/logo.png" width="126" alt="Atelierin" style="display:block;border:0"></td></tr>
<tr><td style="padding:26px 32px 0">${label(`Lista de espera · ${short}`)}</td></tr>
<tr><td style="padding:8px 32px 0;font-size:28px;line-height:1.15;font-weight:bold;color:${C.tinta}">Você está na lista.</td></tr>
<tr><td style="padding:18px 32px 0;color:${C.tinta};font-size:16px;line-height:1.6">
<p style="margin:0 0 14px">Oi! Anotei o seu e-mail na lista de espera da linha <b>${linha}</b>.</p>
<p style="margin:0 0 14px">Quando ela abrir, você fica sabendo primeiro, com a condição especial de quem abre a linha.</p>
<p style="margin:0">Se quiser conversar antes, é só responder este e-mail.</p></td></tr>
<tr><td style="padding:22px 32px 0"><a href="${SITE}" style="display:inline-block;background:${C.crimson};color:#fff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 22px;border-radius:999px">Conhecer o Atelierin</a></td></tr>
<tr><td style="padding:28px 32px 0;color:${C.tinta};font-size:16px">Um abraço,</td></tr>
<tr><td style="padding:6px 32px 4px"><img src="${IMG}/assinatura.png" width="280" alt="Samara Silvia Sabino" style="display:block;border:0"></td></tr>
<tr><td style="padding:22px 24px 8px">${businessCard}</td></tr>
</table>
<img src="${IMG}/rodape.png" width="520" alt="" style="display:block;border:0;max-width:520px;width:100%;margin-top:20px">
<p style="max-width:480px;margin:18px auto 0;color:${C.poeira};font-size:12px;line-height:1.5;text-align:center">Atelierin · Recife, PE · <a href="${SITE}" style="color:${C.poeira}">atelierin.com.br</a><br>Você recebeu porque entrou na lista de espera no site. Não quer mais receber? Responda com "sair".</p>`,
    `Anotei o seu e-mail na lista da linha ${linha}.`)

  const text = `Oi! Anotei o seu e-mail na lista de espera da linha ${area}.

Quando ela abrir, você fica sabendo primeiro, com a condição especial de quem abre a linha.
Se quiser conversar antes, é só responder este e-mail.

Um abraço,
Samara Silvia Sabino
Fundadora · Atelierin
WhatsApp: ${WHATSAPP.label}
${SITE}

Não quer mais receber? Responda com "sair".`

  return { subject: 'Você está na lista do Atelierin', html, text }
}

// ---------- e-mail 2: aviso interno de inscrição nova ----------

function notice({ email, area, page, when, inLine, total }) {
  const pages = { '/': 'Página inicial' }
  const from = pages[page] || page || 'Site'
  const people = (n) => `${n} ${n === 1 ? 'pessoa' : 'pessoas'}`
  const row = (k, v) => `<tr><td width="38%" style="padding:9px 0;border-top:1px dashed ${C.borda};font-family:${MONO};font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${C.poeira}">${k}</td><td style="padding:9px 0;border-top:1px dashed ${C.borda};font-size:14px;color:${C.tinta}">${v}</td></tr>`
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Atelierin · linha ${area.split(' · ')[0]}`)}`

  const html = shell(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
<tr><td style="padding:0 8px 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
 <td><img src="${IMG}/logo.png" width="104" alt="Atelierin" style="display:block;border:0"></td>
 <td align="right">${label('Aviso interno', C.poeira)}</td></tr></table></td></tr>
<tr><td>${card(`
  ${label('Lista de espera · novo inscrito')}
  <div style="font-size:24px;font-weight:bold;color:${C.tinta};margin:10px 0 4px;word-break:break-all">${esc(email)}</div>
  <div style="font-size:14px;color:${C.tinta2};margin-bottom:18px">quer a linha <b>${esc(area)}</b></div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
   ${row('Entrou em', esc(when))}
   ${row('Veio de', esc(from))}
   ${inLine != null ? row('Na fila dessa linha', people(inLine)) : ''}
   ${total != null ? row('Total na lista', people(total)) : ''}
  </table>
  <div style="border-top:1px dashed ${C.borda};padding-top:18px;margin-top:2px">
   <a href="${esc(mailto)}" style="display:inline-block;background:${C.crimson};color:#fff;text-decoration:none;font-size:13px;font-weight:bold;padding:11px 18px;border-radius:999px;margin:0 6px 6px 0">Escrever pra essa pessoa</a>
   <a href="https://dash.cloudflare.com/?to=/:account/workers/d1" style="display:inline-block;border:1px solid ${C.tinta};color:${C.tinta};text-decoration:none;font-size:13px;font-weight:bold;padding:10px 18px;border-radius:999px;margin:0 0 6px">Ver a lista no D1</a>
  </div>`, '24px 24px 20px')}</td></tr>
</table>`, `${email} quer a linha ${area}`)

  const text = `Novo inscrito na lista de espera
${email} quer a linha ${area}
Entrou em: ${when}
Veio de: ${from}${inLine != null ? `\nNa fila dessa linha: ${people(inLine)}` : ''}${total != null ? `\nTotal na lista: ${people(total)}` : ''}`

  return { subject: `Lista de espera: ${area}`, html, text }
}

// ---------- rota ----------

export async function onRequestPost({ request, env }) {
  let data
  try { data = await request.json() } catch { return json({ ok: false, error: 'json' }, 400) }

  // armadilha para robôs: o campo "site" fica escondido na página
  if (data.site) return json({ ok: true })

  const email = String(data.email || '').trim().toLowerCase().slice(0, 200)
  const kind = String(data.interest || '')
  const area = String(data.area || '').slice(0, 80)
  const page = String(data.page || '').slice(0, 80)
  if (!EMAIL.test(email) || !KINDS.has(kind)) return json({ ok: false, error: 'invalid' }, 400)
  if (!env.DB) return json({ ok: false, error: 'db' }, 503)

  // o aviso interno só sai para inscrição nova; e-mail repetido só atualiza a linha
  const before = await env.DB.prepare('SELECT 1 FROM leads WHERE kind = ?1 AND email = ?2').bind(kind, email).first()
  await env.DB
    .prepare('INSERT INTO leads (kind, email, area, page) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(kind, email) DO UPDATE SET area = excluded.area')
    .bind(kind, email, area, page)
    .run()
  const isNew = !before

  try {
    const mail = confirmation(area)
    await sendMail(env, { to: email, ...mail })

    if (env.NOTIFY_TO && isNew) {
      let inLine = null, total = null
      try {
        const r = await env.DB.prepare(
          'SELECT SUM(CASE WHEN area = ?2 THEN 1 ELSE 0 END) AS in_line, COUNT(*) AS total FROM leads WHERE kind = ?1'
        ).bind(kind, area).first()
        inLine = r?.in_line ?? null
        total = r?.total ?? null
      } catch { /* contagem é extra */ }
      const when = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife', dateStyle: 'short', timeStyle: 'short' })
      await sendMail(env, { to: env.NOTIFY_TO, replyTo: email, ...notice({ email, area, page, when, inLine, total }) })
    }
  } catch { /* o pedido já foi gravado; e-mail é bônus */ }

  return json({ ok: true })
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405)
