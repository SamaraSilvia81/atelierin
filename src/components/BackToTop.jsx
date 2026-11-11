import { useEffect, useState } from 'react'
import { ArrowUp } from '@phosphor-icons/react'
import { play } from '@/lib/sounds'

// Botão "voltar ao topo": aparece depois que a pessoa passa do hero.
export default function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      className={`to-top ${show ? 'is-on' : ''}`}
      aria-label="Voltar ao topo"
      tabIndex={show ? 0 : -1}
      onPointerEnter={() => play('tick')}
      onClick={() => { play('click'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
    >
      <ArrowUp size={16} aria-hidden="true" />
      <span>topo</span>
    </button>
  )
}
