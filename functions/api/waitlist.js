// POST /api/waitlist  (Cloudflare Pages Function)
// Grava o pedido da lista de espera no D1 e manda um e-mail de confirmação
// pelo Resend. Configuração no painel do Cloudflare Pages (Settings):
//   - Bindings > D1: nome DB  -> banco atelierin-landing (db/schema.sql)
//   - Variáveis (secret): RESEND_API_KEY
//   - Variáveis: MAIL_FROM  (ex.: Atelierin <contato@atelierin.com.br>)
//                NOTIFY_TO  (opcional: recebe um aviso a cada pedido novo)
// Sem RESEND_API_KEY o pedido é gravado e nenhum e-mail sai.

const KINDS = new Set(['linha'])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })

async function sendMail(env, to, subject, html) {
  if (!env.RESEND_API_KEY) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM || 'Atelierin <contato@atelierin.com.br>', to, subject, html }),
  })
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

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

  const res = await env.DB
    .prepare('INSERT INTO leads (kind, email, area, page) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(kind, email) DO UPDATE SET area = excluded.area')
    .bind(kind, email, area, page)
    .run()

  const isNew = res.meta?.changes > 0
  try {
    await sendMail(env, email, 'Você está na lista do Atelierin',
      `<p>Oi! Anotei o seu e-mail na lista de espera da linha <b>${esc(area)}</b>.</p>
       <p>Quando ela abrir, você fica sabendo primeiro, com a condição especial de quem abre a linha.</p>
       <p>Se quiser conversar antes, é só responder este e-mail.</p>
       <p>Samara · Atelierin</p>
       <p style="color:#888;font-size:12px">Não quer mais receber? Responda com "sair" que eu tiro o seu e-mail da lista.</p>`)
    if (env.NOTIFY_TO && isNew) await sendMail(env, env.NOTIFY_TO, `Lista de espera: ${area}`, `<p>${esc(email)} entrou na lista (${esc(area)}).</p>`)
  } catch { /* o pedido já foi gravado; e-mail é bônus */ }

  return json({ ok: true })
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405)
