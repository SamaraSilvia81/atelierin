import { content, whatsappHref, mailHref } from '@/lib/content'
import Button from '@/components/Button'

export default function FinalCta() {
  const c = content.finalCta
  return (
    <section id="contato" data-theme="light" className="section final" aria-labelledby="contato-t">
      <div className="wrap final-in" data-reveal>
        <p className="piece"><span className="piece-dot" aria-hidden="true" />{c.piece}</p>
        <h2 id="contato-t" className="display">{c.title} <em>{c.titleAccent}</em></h2>
        <p className="lede">{c.lede}</p>
        <div className="actions">
          <Button href={whatsappHref()}>{c.primary}</Button>
          <Button href={mailHref()} variant="ghost">{c.secondary}</Button>
        </div>
      </div>
    </section>
  )
}
