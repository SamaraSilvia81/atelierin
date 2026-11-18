import { Check, X, ArrowUpRight, WhatsappLogo, Info, Clock, FileText, UsersThree, CheckCircle, Warning, CaretDoubleDown, UserCircle, Key, LockSimple } from '@phosphor-icons/react'
import { useState } from 'react'
import { content, whatsappHref } from '@/lib/content'
import PageHead from '@/pages/PageHead'
import FlowMap from '@/components/FlowMap'
import OfferPicker, { ClientCtx } from '@/components/OfferPicker'

// Proposta comercial em "slides" que se lê rolando. Cada slide tem um
// desenho próprio (layout) e um detalhe gráfico (deco), sempre com as peças
// da identidade: faixa carmesim, o símbolo, a fita métrica e o alinhavo.

// título com a palavra de destaque numa tarja (ou só na cor, com accentMode "text")
// e, se houver, uma etiqueta logo depois do destaque (tag)
function Title({ text, accent, accentMode, accentBreak, tag }) {
  const t = tag && <span className="s-title-tag">{tag}</span>
  if (!accent || !text.includes(accent)) return <h2 className="display">{text}{t}</h2>
  const [a, b] = text.split(accent)
  const m = <mark className={accentMode === 'text' ? 'hl hl-text' : 'hl'}>{accent}</mark>
  return <h2 className="display">{a}{accentBreak && <br />}{t ? <span className="s-title-pair">{m}{t}</span> : m}{b}</h2>
}

// tela de abertura de capítulo: frase grande no centro e um bilhete pendurado embaixo
function Interlude({ s, n, total }) {
  const [a, b] = s.accent && s.title.includes(s.accent) ? s.title.split(s.accent) : [s.title, '']
  return (
    <section id={`slide-${Number(n)}`} data-theme={s.theme || 'dark'} className={`section slide slide-interlude ${[].concat(s.deco || []).map((k) => `has-${k}`).join(' ')}`} aria-label={s.kicker}>
      {[].concat(s.deco || []).map((k) => <Deco key={k} kind={k} n="" />)}
      <div className="wrap interlude" data-reveal>
        <span className="interlude-k"><b>{n}</b>/{total} · {s.kicker}</span>
        <h2 className="interlude-t">{a}{s.accent && <em>{s.accent}</em>}{b}</h2>
        <CaretDoubleDown className="interlude-down" size={22} aria-hidden="true" />
        {s.text && <aside className="bilhete is-hanging interlude-note"><i className="bilhete-linha" aria-hidden="true" /><p>{s.text}</p></aside>}
      </div>
    </section>
  )
}

// Esquema das duas famílias: o ambiente do profissional (ele e a equipe) e,
// no Relacionamento, o portal ligado por um alinhavo, com os clientes entrando.
function Person({ label, dim }) {
  return <span className={`fx-person ${dim ? 'is-dim' : ''}`}><UserCircle size={22} weight="duotone" aria-hidden="true" />{label}</span>
}
function EnvDiagram({ e }) {
  const portal = Boolean(e.portal)
  return (
    <article className={`fx is-${e.id}`}>
      <header className="fx-head"><h3>{e.name}</h3><span className="s-fam-badge">{e.tag}</span></header>
      <p className="fx-cap">{e.caption}</p>
      <div className={`fx-map ${portal ? 'has-portal' : ''}`} aria-hidden="true">
        <div className="fx-box fx-admin">
          <span className="fx-k">{e.admin}</span>
          <div className="fx-people">{e.people.map((p) => <Person key={p} label={p} />)}</div>
          <div className="fx-records"><span>{e.records}</span><i /><i /><i /><i /><i /></div>
        </div>
        {portal && <span className="fx-link"><i /></span>}
        {portal && (
          <div className="fx-box fx-portal">
            <span className="fx-k">{e.portal}</span>
            <ul>{e.portalItems.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        )}
        <div className={`fx-out ${portal ? 'is-in' : 'is-blocked'}`}>
          <div className="fx-clients">
            {[0, 1, 2].map((k) => (
              <span key={k} className="fx-client" style={{ '--d': `${k * 0.6}s` }}>
                {portal && <i className="fx-thread" />}
                {portal ? <Key size={12} weight="bold" className="fx-key" /> : <LockSimple size={12} weight="bold" className="fx-lock" />}
                <UserCircle size={26} weight="duotone" />
              </span>
            ))}
          </div>
          <span className="fx-k">{e.outside}</span>
        </div>
      </div>
    </article>
  )
}

// Cartaz entre slides: palavra gigante cortada pela borda e a frase em tarjas
function Poster({ s, n, total }) {
  return (
    <section id={`slide-${Number(n)}`} data-theme={s.theme || 'light'} className="section slide slide-poster" aria-label={s.kicker}>
      <div className="poster-giant" aria-hidden="true">
        {s.giant.map((g) => <span key={g}>{g.endsWith('?') ? <>{g.slice(0, -1)}<em>?</em></> : g}</span>)}
      </div>
      <div className="wrap poster" data-reveal>
        <span className="interlude-k"><b>{n}</b>/{total} · {s.kicker}</span>
        <div className="poster-body">
          <h2 className="poster-lines">{s.lines.map((l, i) => <span key={l} className={i === s.lines.length - 1 ? 'is-acc' : undefined}>{l}</span>)}</h2>
          {s.text && <p className="poster-text">{s.text}</p>}
        </div>
      </div>
    </section>
  )
}

// Slide de planos de uma família: texto ocupando um lado, uma faixa carmesim
// vertical afastada da borda e o card da tabela por cima dela. mirror inverte os lados.
function PlansSlide({ s, n, total, theme }) {
  return (
    <section id={`slide-${Number(n)}`} data-theme={theme} className={`section slide slide-plans2 ${s.mirror ? 'is-mirror' : ''}`}>
      <span className="pl-band" aria-hidden="true" />
      <div className="wrap pl-grid" data-reveal>
        <div className="pl-text">
          <div className="pl-num"><span className="slide-n">{n}<small>/{total}</small></span><p className="label"><b aria-hidden="true">&gt;</b> {s.kicker}</p></div>
          <div className="pl-title"><h2 className="display">{s.title}</h2>{s.tag && <span className="s-title-tag">{s.tag}</span>}</div>
          {s.subtitle && <p className="pl-sub">{s.subtitle}</p>}
          {[].concat(s.text ?? []).map((t) => <p key={t} className="pl-p">{t}</p>)}
          {s.addons && (
            <div className="pl-addons">
              <h3>{s.addons.title}</h3>
              <p>{s.addons.text}</p>
              <ul>{s.addons.rows.map(([a, b]) => <li key={a}><span>{a}</span><strong>{b}</strong></li>)}</ul>
            </div>
          )}
        </div>
        <div className="pl-side">
          <div className="pl-card" data-theme="light">
            <div className="pl-card-head"><span>planos · {s.title}</span><span>mensal</span></div>
            <table className="s-plans">
              <thead><tr>{s.plans.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>{s.plans.rows.map((r) => (
                <tr key={r[0]} className={/consulta/i.test(r[1]) ? 'is-quote' : undefined}>
                  {r.map((v, i) => i === 0 ? <th key={i} scope="row">{v}</th> : <td key={i} className={i === 1 ? 's-plans-price' : undefined}>{v}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
          {s.sample && (
            <aside className="bilhete pl-sample">
              <i className="bilhete-fita" aria-hidden="true" />
              <span className="s-ask-k"><b aria-hidden="true">»</b> {s.sample.label}</span>
              {s.sample.text.map((t) => <p key={t}>{t}</p>)}
            </aside>
          )}
          {s.note && <p className="pl-note">{s.note}</p>}
        </div>
      </div>
    </section>
  )
}

function Deco({ kind, n }) {
  if (kind === 'band') return <div className="sdeco sdeco-band" aria-hidden="true"><span>nº {n}</span></div>
  if (kind === 'tape') return <div className="sdeco sdeco-tape" aria-hidden="true">{Array.from({ length: 61 }, (_, i) => <i key={i} />)}</div>
  if (kind === 'stitch') return (
    <svg className="sdeco sdeco-stitch" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 150 C 120 60, 200 190, 320 110 S 520 30, 600 70" />
    </svg>
  )
  if (kind === 'mark') return (
    <svg className="sdeco sdeco-mark" viewBox="0 0 100 100" aria-hidden="true">
      <rect x="6" y="6" width="38" height="38" rx="10" /><rect x="6" y="56" width="38" height="38" rx="10" />
      <rect x="56" y="56" width="38" height="38" rx="10" /><rect x="54" y="4" width="42" height="42" rx="12" className="f" />
    </svg>
  )
  return null
}

function Points({ list }) {
  if (!list?.length) return null
  return <ul className="slide-points">{list.map((pt) => <li key={pt}><Check size={16} weight="bold" aria-hidden="true" />{pt}</li>)}</ul>
}

function Body({ s }) {
  if (s.layout === 'split') return (
    <>
      <div className="s-split">
        {s.split.map((c) => (
          <div key={c.label} className={`s-split-col is-${c.label}`}>
            <span className="s-split-k">{c.label}{c.note && <small>{c.note}</small>}</span>
            <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
      <Points list={s.points} />
    </>
  )
  if (s.layout === 'plans') return (
    <>
      <div className="s-plans-wrap">
        <table className="s-plans">
          <thead><tr>{s.plans.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>{s.plans.rows.map((r) => (
            <tr key={r[0]} className={/consulta/i.test(r[1]) ? 'is-quote' : undefined}>
              {r.map((v, i) => i === 0 ? <th key={i} scope="row">{v}</th> : <td key={i} className={i === 1 ? 's-plans-price' : undefined}>{v}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className={`s-plans-more ${s.sample ? 'has-sample' : ''}`}>
        {s.addons && (
          <div className="s-addons">
            <h3>{s.addons.title}</h3>
            <p>{s.addons.text}</p>
            <ul>{s.addons.rows.map(([a, b]) => <li key={a}><span>{a}</span><strong>{b}</strong></li>)}</ul>
          </div>
        )}
        {s.sample && (
          <div className="s-sample">
            <span className="s-sample-k">{s.sample.label}</span>
            {s.sample.text.map((t) => <p key={t}>{t}</p>)}
          </div>
        )}
      </div>
      {s.note && <p className="s-plans-note">{s.note}</p>}
    </>
  )
  if (s.layout === 'families') return (
    <>
      {s.envs && <div className="fx-grid">{s.envs.map((e) => <EnvDiagram key={e.id} e={e} />)}</div>}
      {s.highlight && <p className="s-highlight s-fam-hl">{s.highlight}</p>}
    </>
  )
  if (s.layout === 'layer') return (
    <div className="s-layer">
      <div className="s-layer-head"><span>{s.fichaTitle}</span><i className="s-layer-tape" aria-hidden="true">{Array.from({ length: 41 }, (_, i) => <b key={i} />)}</i></div>
      <ol>{s.points.map((pt, i) => <li key={pt}><b>{String(i + 1).padStart(2, '0')}</b>{pt}</li>)}</ol>
    </div>
  )
  if (s.layout === 'ficha') return (
    <div className="s-ficha">
      <div className="s-ficha-head"><strong>{s.fichaTitle}</strong><span className="ficha-tape" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</span></div>
      <ol>{s.points.map((pt, i) => <li key={pt}><b>{String(i + 1).padStart(2, '0')}</b>{pt}</li>)}</ol>
    </div>
  )
  if (s.layout === 'table') return (
    <>
      <div className="s-table-wrap">
        <table className="s-table">
          <thead><tr>{s.table.cols.map((c, i) => <th key={i} className={i === s.table.highlight ? 'is-hl' : undefined}>{c}</th>)}</tr></thead>
          <tbody>{s.table.rows.map((r) => (
            <tr key={r[0]}>{r.map((v, i) => i === 0 ? <th key={i} scope="row">{v}</th> : <td key={i} className={i === s.table.highlight ? 'is-hl' : undefined}>{v}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
      <Points list={s.points} />
    </>
  )
  if (s.layout === 'strike') return (
    <ul className="s-strike">{s.points.map((pt) => <li key={pt}><X size={16} weight="bold" aria-hidden="true" /><span>{pt}</span></li>)}</ul>
  )
  if (s.layout === 'options') return (
    <>
      <div className="s-options">
        {s.options.map((o) => (
          <div key={o.name} className={`s-option ${o.tag ? 'has-tag' : ''}`}>
            {o.tag && <span className="s-option-tag">{o.tag}</span>}
            <span className="s-option-for">{o.for}</span>
            <strong>{o.name}</strong>
            <span className="s-option-price">{o.was && <s>{o.was}</s>}{o.price}</span>
            <ul>{o.items.map((it) => <li key={it}><Check size={14} weight="bold" aria-hidden="true" />{it}</li>)}</ul>
            <p>{o.note}</p>
          </div>
        ))}
      </div>
      <div className="s-out"><span>não entra</span>{s.excluded.map((x) => <i key={x}>{x}</i>)}</div>
      <p className="s-complete">{s.complete}</p>
      <aside className="s-notice">
        <Info size={20} aria-hidden="true" />
        <div>
          <strong>{s.inpi.title}</strong>
          <p>{s.inpi.text}</p>
          <a href={s.inpi.link.href} target="_blank" rel="noopener noreferrer">{s.inpi.link.label} <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </aside>
    </>
  )
  if (s.layout === 'lp') return (
    <>
      <div className="s-options s-lp">
        {s.cards.map((o) => (
          <div key={o.name} className={`s-option ${o.hl ? 'is-hl' : ''}`}>
            <span className="s-option-for">{o.for}</span>
            <strong>{o.name}</strong>
            <span className="s-option-price">{o.price}</span>
            <ul>{o.items.map((it) => <li key={it}><Check size={14} weight="bold" aria-hidden="true" />{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </>
  )
  if (s.layout === 'offer') return (
    <>
      <OfferPicker s={s} />
      <Points list={s.points} />
    </>
  )
  if (s.layout === 'terms') return (
    <>
      <div className="s-terms">
        <div className="s-terms-col">
          <span className="s-terms-k"><Clock size={16} aria-hidden="true" /> prazos</span>
          <table className="s-terms-table"><tbody>{s.terms.map(([a, b, c]) => <tr key={a}><th scope="row">{a}</th><td><strong>{b}</strong><small>{c}</small></td></tr>)}</tbody></table>
          <span className="s-terms-k"><UsersThree size={16} aria-hidden="true" /> reuniões</span>
          <ol className="s-meet">{s.meetings.map((m, i) => <li key={m}><b>{i + 1}</b>{m}</li>)}</ol>
        </div>
        <div className="s-contract" aria-label="Exemplo do que o contrato garante">
          <span className="s-contract-k"><FileText size={16} aria-hidden="true" /> contrato · o que ele garante</span>
          <ul>{s.contract.map((c, i) => <li key={c} style={{ animationDelay: `${.15 * i}s` }}><CheckCircle size={16} weight="fill" aria-hidden="true" />{c}</li>)}</ul>
          <div className="s-sign"><span><i />contratante</span><span><i />Atelierin</span></div>
        </div>
      </div>
      <p className="s-warn">{s.notice}</p>
    </>
  )
  if (s.layout === 'cta') return (
    <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="s-cta"><WhatsappLogo size={26} weight="fill" aria-hidden="true" /> {s.cta.label}</a>
  )
  return <Points list={s.points} />
}

// Exemplo da página simples que todo ambiente ganha. Se existir a imagem do
// mockup (public/proposta/exemplo-tablet.png), mostra a imagem; senão, a página
// desenhada em HTML, como um banner de verdade (com foto de fundo, se houver).
function PublicPage({ ex }) {
  const [useImg, setUseImg] = useState(Boolean(ex.mockup))
  if (useImg) return <img className="s-public-img" src={ex.mockup} alt={`${ex.label}: ${ex.name}, ${ex.role}`} onError={() => setUseImg(false)} />
  return (
    <figure className="s-public" aria-label={ex.label}>
      <div className="mods-bar"><span className="dots"><i /><i /><i /></span><code>{ex.host}</code><span className="mods-count">{ex.label}</span></div>
      <div className="ar">
        <nav className="ar-nav">
          <span className="ar-logo"><b>{ex.initials}</b>{ex.name}</span>
          <span className="ar-enter">Área da cliente</span>
        </nav>
        <div className="ar-hero">
          <div className="ar-copy">
            <small>{ex.eyebrow}</small>
            <h4>{ex.headline} <em>{ex.headlineAccent}</em></h4>
            <p>{ex.bio}</p>
            <div className="ar-cta"><span className="is-main"><WhatsappLogo size={15} weight="fill" /> Agendar conversa</span><span>Ver valores</span></div>
            <span className="ar-proof"><i /><i /><i />{ex.proof}</span>
          </div>
          <div className="ar-photo" style={{ '--bg': `url(${ex.image})` }}>
            <span className="ar-badge"><i />{ex.badge}</span>
            <span className="ar-sign">{ex.name}</span>
          </div>
        </div>
        <ul className="ar-offers">
          {ex.offers.map(([n, a, b, c]) => (
            <li key={a}><span className="ar-n">{n}</span><strong>{a}</strong><p>{c}</p><span className="ar-price">{b}<i>→</i></span></li>
          ))}
        </ul>
        <blockquote className="ar-quote">“{ex.quote}”<cite>{ex.quoteBy}</cite></blockquote>
      </div>
      <small className="s-public-foot">feito com Atelierin{ex.credit && <span> · {ex.credit}</span>}</small>
    </figure>
  )
}

function Chat({ list }) {
  return (
    <div className="s-chat" aria-hidden="true">
      <div className="s-chat-head"><span>S</span><div><strong>Samara · Atelierin</strong><small>online</small></div></div>
      <div className="s-chat-body">{list.map(([who, txt], i) => <p key={i} className={`is-${who}`} style={{ animationDelay: `${.5 + i * .6}s` }}>{txt}</p>)}</div>
    </div>
  )
}


// Cliente fundador: a tabela do mensal ganha a coluna com o desconto aplicado.
function withFounder(s) {
  const f = content.founder
  if (s.kicker !== 'licença e manutenção' || !s.table || !f?.discount) return s
  const pct = Math.round(f.discount * 100)
  const tiers = content.plans.pricing.tiers
  const brl = (n) => 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
  const rows = s.table.rows.map((r) => {
    const m = /^R\$\s*([\d.]+)$/.exec(r[1])
    return [...r, m ? brl(Math.round(Number(m[1].replace(/\./g, '')) * (1 - f.discount) * 100) / 100) : r[1]]
  })
  return {
    ...s,
    text: `${s.text} Como cliente fundador, o seu mensal tem ${pct}% a menos, para sempre. No plano Social, você fica até ${tiers.find((t) => t.founderMax)?.founderMax ?? 30} alunos pelo valor do Social.`,
    table: { ...s.table, cols: [...s.table.cols, `Fundador · −${pct}%`], rows, highlight: s.table.cols.length },
  }
}

// Monta os slides: os gerais e, se houver cliente, os dele no lugar marcado (insertAfter = kicker).
// hide: kickers que somem; patch: { kicker: campos que trocam }, com
// "cards": { nome: campos } para ajustar um card (options ou cards) pelo nome.
function withClient(slides, client) {
  if (!client) return slides
  const hide = new Set(client.hide ?? [])
  let out = slides.filter((s) => !hide.has(s.kicker)).map((s) => {
    const pt = client.patch?.[s.kicker]
    if (!pt) return s
    const { cards, ...rest } = pt
    const next = { ...s, ...rest }
    if (cards) for (const key of ['options', 'cards']) {
      if (next[key]) next[key] = next[key].map((o) => (cards[o.name] ? { ...o, ...cards[o.name] } : o))
    }
    return next
  })
  if (client.deal?.founder) out = out.map(withFounder)
  if (client.slides?.length) {
    const i = out.findIndex((s) => s.kicker === client.insertAfter)
    const at = i < 0 ? out.length - 1 : i + 1
    out = [...out.slice(0, at), ...client.slides, ...out.slice(at)]
  }
  return out
}

export default function Proposal({ client, slug }) {
  const base = content.pages.proposal
  const p = client ? { ...base, title: client.title ?? base.title, titleAccent: client.titleAccent ?? base.titleAccent, lede: client.lede ?? base.lede } : base
  const slides = withClient(base.slides, client)
  // as telas de abertura (interlude) também contam na numeração
  const numbered = slides
  const total = String(numbered.length).padStart(2, '0')
  const numOf = new Map(numbered.map((s, i) => [s.kicker, String(i + 1).padStart(2, '0')]))
  return (
    <ClientCtx.Provider value={client ? { client, slug } : null}>
    <div className="page page-proposal">
      <section data-theme="dark" className="section slide slide-cover">
        {/* fundo do hero: faixa carmesim, o símbolo gigante cortado pela borda,
            alinhavos no lugar de marcas de corte e botões nos cruzamentos */}
        <div className="cover-art" aria-hidden="true">
          <span className="cover-grain" />
          <span className="cover-band" />
          <span className="seam seam-h1" /><span className="seam seam-h2" /><span className="seam seam-v1" />
          <span className="button b1"><i /><i /><i /><i /></span><span className="button b2"><i /><i /><i /><i /></span>
          <svg className="cover-mark" viewBox="0 0 100 100">
            <rect x="6" y="6" width="38" height="38" rx="10" className="m-line" />
            <rect x="6" y="56" width="38" height="38" rx="10" className="m-line" />
            <rect x="56" y="56" width="38" height="38" rx="10" className="m-line" />
            <rect x="54" y="4" width="42" height="42" rx="12" className="m-fill" />
            <path d="M67 17 L74 25 L67 33 M78 35 L87 35" className="m-term" />
          </svg>
          <span className="cover-tag">nº 00 · proposta</span>
        </div>
        <div className="wrap">
          <PageHead label={p.label} title={p.title} titleAccent={p.titleAccent} lede={p.lede}>
            <ol className="slide-index">
              {numbered.map((s, i) => <li key={s.kicker}><a href={`#slide-${i + 1}`}><b>{String(i + 1).padStart(2, '0')}</b> {s.kicker}</a></li>)}
            </ol>
          </PageHead>
        </div>
      </section>
      <section id="fluxo-sec" data-theme="dark" className="section flow-sec">
        <div className="wrap">
          <header className="flow-head" data-reveal>
            <p className="label"><b aria-hidden="true">&gt;</b> {p.flow.kicker}</p>
            <h2 className="display">{p.flow.title}</h2>
            <p className="lede">{p.flow.lede}</p>
          </header>
          <div data-reveal><FlowMap data={p.flow} name={client?.name} /></div>
        </div>
      </section>
      {slides.map((s, i) => {
        if (s.interlude) return <Interlude key={s.kicker} s={s} n={numOf.get(s.kicker)} total={total} />
        if (s.poster) return <Poster key={s.kicker} s={s} n={numOf.get(s.kicker)} total={total} />
        if (s.layout === 'plans') return <PlansSlide key={s.kicker} s={s} n={numOf.get(s.kicker)} total={total} theme={s.theme || 'light'} />
        const n = numOf.get(s.kicker)
        const theme = s.theme || (i % 2 === 0 ? 'light' : 'dark')
        return (
          <section key={s.kicker} id={`slide-${Number(n)}`} data-theme={theme} className={`section slide slide-${s.layout || 'default'} ${[].concat(s.deco || 'none').map((k) => `has-${k}`).join(' ')}`}>
            {[].concat(s.deco || []).map((k) => <Deco key={k} kind={k} n={n} />)}
            <div className="wrap slide-grid" data-reveal>
              <div className="slide-side">
                <span className="slide-n">{n}<small>/{total}</small></span>
                <p className="label"><b aria-hidden="true">&gt;</b> {s.kicker}</p>
              </div>
              <div className="slide-main">
                <div className="slide-copy">
                  <Title text={s.title} accent={s.accent} accentMode={s.accentMode} accentBreak={s.accentBreak} tag={s.tag} />
                  {s.question ? (
                    <div className="s-intro-row">
                      <div className="s-intro-text">{[].concat(s.text ?? []).map((t) => <p key={t} className="slide-text">{t}</p>)}</div>
                      <aside className="s-ask bilhete">
                        <i className="bilhete-fita" aria-hidden="true" />
                        <span className="s-ask-k"><b aria-hidden="true">»</b> {s.question.label}</span>
                        <p>{s.question.text} <em>{s.question.accent}</em></p>
                        <i className="s-ask-mark" aria-hidden="true">?</i>
                      </aside>
                    </div>
                  ) : [].concat(s.text ?? []).map((t) => <p key={t} className="slide-text">{t}</p>)}
                  <Body s={s} />
                  {s.footnote && <p className="slide-foot"><Warning className="slide-foot-ic" size={24} aria-hidden="true" /><span>{s.footnote}</span></p>}
                </div>
              </div>
            </div>
            {s.chat && <div className="s-chat-anchor" data-reveal><Chat list={s.chat} /></div>}
            {s.example && <div className="wrap s-public-wrap"><PublicPage ex={s.example} /></div>}
          </section>
        )
      })}
    </div>
    </ClientCtx.Provider>
  )
}
