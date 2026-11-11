import { useRef } from 'react'
import { useExitProgress } from '@/lib/useExitProgress'

// Envolve uma seção para ela "sair de cena como um cartão" (efeito Miro):
// ao rolar, ela encolhe e arredonda os cantos, revelando por trás a cor da
// próxima seção (to="light" ou to="dark").
export default function ExitStage({ to, className = '', children }) {
  const ref = useRef(null)
  useExitProgress(ref)
  return <div ref={ref} className={`exit-stage to-${to} ${className}`}>{children}</div>
}
