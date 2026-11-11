// Seção com tema próprio (dark/light alternados) e o "número da peça"
// no estilo lookbook: Nº 0X · Nome.
export default function Section({ id, theme = 'dark', piece, title, accent, lede, className = '', children }) {
  return (
    <section id={id} data-theme={theme} className={`section ${className}`} aria-labelledby={id ? `${id}-t` : undefined}>
      <div className="wrap">
        {(piece || title) && (
          <header className="section-head" data-reveal>
            {piece && <p className="piece"><span className="piece-dot" aria-hidden="true" />{piece}</p>}
            {title && (
              <h2 id={id ? `${id}-t` : undefined} className="display">
                {title}{accent && <> <em>{accent}</em></>}
              </h2>
            )}
            {lede && <p className="lede">{lede}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
