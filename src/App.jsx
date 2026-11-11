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
import ExitStage from '@/components/ExitStage'

export default function App() {
  useReveal()
  return (
    <>
      <a className="skip" href="#conteudo">{content.a11y.skipLink}</a>
      <Header />
      <main id="conteudo">
        {isEnabled('hero') && <Hero />}
        {isEnabled('problem') && <Problem />}
        {/* Seções que mudam de cor saem de cena como cartão (ExitStage).
            "to" é a cor que aparece por trás: a da seção seguinte. */}
        {isEnabled('how') && <ExitStage to="light" className="how-stage"><How /></ExitStage>}
        {isEnabled('how') && <Steps />}
        {isEnabled('lines') && <ExitStage to="dark"><Lines /></ExitStage>}
        {isEnabled('custom') && <ExitStage to="light"><Custom /></ExitStage>}
        {isEnabled('plans') && <ExitStage to="dark"><Plans /></ExitStage>}
        {isEnabled('faq') && <ExitStage to="light"><Faq /></ExitStage>}
        {isEnabled('finalCta') && <ExitStage to="dark"><FinalCta /></ExitStage>}
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
