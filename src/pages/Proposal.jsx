import { Check, X, ArrowUpRight, WhatsappLogo, Info, Clock, FileText, UsersThree, CheckCircle } from '@phosphor-icons/react'
import { content, whatsappHref } from '@/lib/content'
import PageHead from '@/pages/PageHead'
import FlowMap from '@/components/FlowMap'

// Proposta comercial em "slides" que se lê rolando. Cada slide tem um
// desenho próprio (layout) e um detalhe gráfico (deco), sempre com as peças
// da identidade: faixa carmesim, o símbolo, a fita métrica e o alinhavo.

// título com a palavra de destaque numa tarja
function Title({ text, accent }) {
  if (!accent || !text.includes(accent)) return <h2 className="display">{text}</h2>
  const [a, b] = text.split(accent)
  return <h2 className="display">{a}<mark className="hl">{accent}</mark>{b}</h2>
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
            <span className="s-split-k">{c.label}</span>
            <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
      <Points list={s.points} />
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
          <div key={o.name} className="s-option">
            <span className="s-option-for">{o.for}</span>
            <strong>{o.name}</strong>
            <span className="s-option-price">{o.price}</span>
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
      <PublicPage ex={s.example} />
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

// Exemplo da página simples que todo ambiente ganha (mesma moldura de navegador dos módulos)
function PublicPage({ ex }) {
  return (
    <figure className="s-public" aria-label={ex.label}>
      <div className="mods-bar"><span className="dots"><i /><i /><i /></span><code>{ex.host}</code><span className="mods-count">{ex.label}</span></div>
      <div className="s-public-body">
        <div className="s-public-hero">
          <span className="s-public-photo" aria-hidden="true">{ex.name.split(' ').map((w) => w[0]).join('')}</span>
          <div>
            <strong>{ex.name}</strong>
            <small>{ex.role}</small>
            <p>{ex.bio}</p>
          </div>
          <div className="s-public-actions"><span className="is-wa"><WhatsappLogo size={14} weight="fill" /> WhatsApp</span><span>Entrar</span></div>
        </div>
        <ul className="s-public-offers">{ex.offers.map(([a, b, c]) => <li key={a}><strong>{a}</strong><span>{b}</span><small>{c}</small></li>)}</ul>
        <small className="s-public-foot">feito com Atelierin</small>
      </div>
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


export default function Proposal() {
  const p = content.pages.proposal
  const total = String(p.slides.length).padStart(2, '0')
  return (
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
              {p.slides.map((s, i) => <li key={s.kicker}><a href={`#slide-${i + 1}`}><b>{String(i + 1).padStart(2, '0')}</b> {s.kicker}</a></li>)}
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
          <div data-reveal><FlowMap data={p.flow} /></div>
        </div>
      </section>
      {p.slides.map((s, i) => {
        const n = String(i + 1).padStart(2, '0')
        const theme = i % 2 === 0 ? 'light' : 'dark'
        return (
          <section key={s.kicker} id={`slide-${i + 1}`} data-theme={theme} className={`section slide slide-${s.layout || 'default'} has-${s.deco || 'none'}`}>
            <Deco kind={s.deco} n={n} />
            <div className="wrap slide-grid" data-reveal>
              <div className="slide-side">
                <span className="slide-n">{n}<small>/{total}</small></span>
                <p className="label"><b aria-hidden="true">&gt;</b> {s.kicker}</p>
              </div>
              <div className={`slide-main ${s.chat ? 'has-chat' : ''}`}>
                <div className="slide-copy">
                  <Title text={s.title} accent={s.accent} />
                  <p className="slide-text">{s.text}</p>
                  <Body s={s} />
                </div>
                {s.chat && <Chat list={s.chat} />}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
