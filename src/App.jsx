import { content, isEnabled } from '@/lib/content'
import { useReveal } from '@/lib/useReveal'
import Header from '@/components/Header'
import Hero from '@/sections/Hero'
import Problem from '@/sections/Problem'
import How from '@/sections/How'
import Steps from '@/sections/Steps'
import Lines from '@/sections/Lines'
import Custom from '@/sections/Custom'
import Plans from '@/sections/Plans'
import Faq from '@/sections/Faq'
import FinalCta from '@/sections/FinalCta'
import Footer from '@/sections/Footer'
import BackToTop from '@/components/BackToTop'

export default function App() {
  useReveal()
  return (
    <>
      <a className="skip" href="#conteudo">{content.a11y.skipLink}</a>
      <Header />
      <main id="conteudo">
        {isEnabled('hero') && <Hero />}
        {isEnabled('problem') && <Problem />}
        {isEnabled('how') && (
          // fundo claro por trás: aparece nos cantos quando "Como funciona" encolhe ao sair
          <div className="exit-stage">
            <How />
            <Steps />
          </div>
        )}
        {isEnabled('lines') && <Lines />}
        {isEnabled('custom') && <Custom />}
        {isEnabled('plans') && <Plans />}
        {isEnabled('faq') && <Faq />}
        {isEnabled('finalCta') && <FinalCta />}
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
