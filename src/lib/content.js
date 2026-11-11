// Ponto único de leitura do conteúdo. Os textos ficam em src/content/*.json
// para editar sem mexer em componente. Para esconder uma seção, adicione
// "enabled": false no bloco dela em content.json.
import base from '@/content/content.json'
import lines from '@/content/lines.json'
import faq from '@/content/faq.json'
import pages from '@/content/pages.json'

export const content = { ...base, lines: { ...base.lines, items: lines }, faq, pages }

export const isEnabled = (key) => content[key] && content[key].enabled !== false

export function whatsappHref() {
  const { whatsapp, whatsappMessage } = content.site
  const digits = String(whatsapp).replace(/\D/g, '')
  if (!digits) return '#contato'
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessage)}`
}

export function mailHref(body = '') {
  const { contactEmail } = content.site
  if (!contactEmail || !contactEmail.includes('@')) return null
  const q = body ? `?subject=${encodeURIComponent('Atelierin · minha ficha')}&body=${encodeURIComponent(body)}` : ''
  return `mailto:${contactEmail}${q}`
}

export function whatsappWith(text) {
  const digits = String(content.site.whatsapp).replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
