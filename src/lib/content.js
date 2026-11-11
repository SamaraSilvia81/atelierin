// Ponto único de leitura do conteúdo. Os textos ficam em src/content/*.json
// para editar sem mexer em componente. Para esconder uma seção, adicione
// "enabled": false no bloco dela em content.json.
import base from '@/content/content.json'
import lines from '@/content/lines.json'
import faq from '@/content/faq.json'

export const content = { ...base, lines: { ...base.lines, items: lines }, faq }

export const isEnabled = (key) => content[key] && content[key].enabled !== false

export function whatsappHref() {
  const { whatsapp, whatsappMessage } = content.site
  const digits = String(whatsapp).replace(/\D/g, '')
  if (!digits) return '#contato'
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessage)}`
}

export function mailHref() {
  const { contactEmail } = content.site
  return contactEmail.includes('@') ? `mailto:${contactEmail}` : '#contato'
}
