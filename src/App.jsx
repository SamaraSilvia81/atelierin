import { content, isEnabled } from '@/lib/content'
import { useReveal } from '@/lib/useReveal'
import Header from '@/components/Header'
import Hero from '@/sections/Hero'
import Problem from '@/sections/Problem'
import How from '@/sections/How'
import Lines from '@/sections/Lines'
import Custom from '@/sections/Custom'
import Plans from '@/sections/Plans'
import Faq from '@/sections/Faq'
import FinalCta from '@/sections/FinalCta'
import Footer from '@/sections/Footer'

export default function App() {
  useReveal()
  return (
    <>
      <a className="skip" href="#conteudo">{content.a11y.skipLink}</a>
      <Header />
      <main id="conteudo">
        {isEnabled('hero') && <Hero />}
        {isEnabled('problem') && <Problem />}
        {isEnabled('how') && <How />}
        {isEnabled('lines') && <Lines />}
        {isEnabled('custom') && <Custom />}
        {isEnabled('plans') && <Plans />}
        {isEnabled('faq') && <Faq />}
        {isEnabled('finalCta') && <FinalCta />}
      </main>
      <Footer />
    </>
  )
}
