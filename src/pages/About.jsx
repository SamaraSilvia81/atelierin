import { ArrowUpRight } from '@phosphor-icons/react'
import { content } from '@/lib/content'

// Quem faz: a página de currículo da Samara
export default function About() {
  const a = content.pages.about
  const initials = a.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <div className="page page-about">
      <section data-theme="dark" className="section about-hero">
        <div className="wrap about-grid">
          <div className="about-copy" data-reveal>
            <p className="label"><b aria-hidden="true">&gt;</b> {a.label}</p>
            <h1 className="display">{a.name}</h1>
            <p className="about-role">{a.role} · {a.place}</p>
            <p className="lede">{a.intro}</p>
            <ul className="about-links">
              {a.links.map((l) => <li key={l.label}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <ArrowUpRight size={13} /></a></li>)}
            </ul>
          </div>
          <figure className="about-photo" data-reveal>
            {a.photo ? <img src={a.photo} alt={a.name} /> : <span aria-hidden="true">{initials}</span>}
            <figcaption>
              {a.facts.map(([k, v]) => <p key={k}><b>{k}</b>{v}</p>)}
            </figcaption>
          </figure>
        </div>
      </section>

      <section data-theme="light" className="section about-cv">
        <div className="wrap">
          {a.blocks.map((b) => (
            <div key={b.title} className="cv-block" data-reveal>
              <h2 className="display">{b.title}</h2>
              <ol>
                {b.items.map((it) => <li key={it.h}><strong>{it.h}</strong><p>{it.p}</p></li>)}
              </ol>
            </div>
          ))}
          <div className="cv-block" data-reveal>
            <h2 className="display">{a.skillsTitle}</h2>
            <ul className="cv-skills">{a.skills.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="cv-block" data-reveal>
            <h2 className="display">{a.projectsTitle}</h2>
            <ul className="cv-projects">
              {a.projects.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong><p>{p.text}</p>
                  {p.href && <a href={p.href}>ver o caso →</a>}
                </li>
              ))}
            </ul>
          </div>
          <div className="page-cta" data-reveal>
            <p>{a.cta.text}</p>
            <a href={a.cta.href} className="bridge-link">{a.cta.label}</a>
          </div>
        </div>
      </section>
    </div>
  )
}
