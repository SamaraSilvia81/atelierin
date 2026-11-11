// Cabeçalho padrão das páginas internas (Quem faz, Proposta, Casos)
export default function PageHead({ label, title, lede, children }) {
  return (
    <header className="page-head" data-reveal>
      <p className="label"><b aria-hidden="true">&gt;</b> {label}</p>
      <h1 className="display">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </header>
  )
}
