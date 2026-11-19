import { content } from '@/lib/content'

// Nº 01 · o que é: a definição do Atelierin, exatamente como está no
// documento consolidado. Sem efeito nem enfeite, de propósito.
export default function What() {
  const w = content.what
  return (
    <section id="o-que-e" data-theme="dark" className="section what" aria-labelledby="what-t">
      <div className="wrap what-top">
        <p className="label" data-reveal><b aria-hidden="true">&gt;</b> {w.label}</p>
        <h2 id="what-t" className="what-text" data-reveal>{w.text}</h2>
      </div>
    </section>
  )
}
