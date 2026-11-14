import { content, isEnabled } from '@/lib/content'
import { useReveal } from '@/lib/useReveal'
import { usePath, useLinkInterceptor, useInitialHash } from '@/lib/router'
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
import { PromoBar, PromoModal } from '@/components/Promo'
import About from '@/pages/About'
import Proposal from '@/pages/Proposal'
import Cases from '@/pages/Cases'
import ClientProposal from '@/pages/ClientProposal'
import FounderPage from '@/pages/Founder'

function Home() {
  return (
    <>
      {isEnabled('hero') && <Hero />}
      {isEnabled('problem') && <Problem />}
      {/* Seções que mudam de cor saem de cena como cartão (ExitStage).
          "to" é a cor que aparece por trás: a da seção seguinte.
          De Planos em diante a página fica sem esse efeito. */}
      {isEnabled('how') && <ExitStage to="light" className="how-stage"><How /></ExitStage>}
      {isEnabled('how') && <Steps />}
      {isEnabled('lines') && <ExitStage to="dark"><Lines /></ExitStage>}
      {isEnabled('custom') && <ExitStage to="light"><Custom /></ExitStage>}
      {isEnabled('plans') && <Plans />}
      {isEnabled('faq') && <Faq />}
      {isEnabled('finalCta') && <FinalCta />}
    </>
  )
}

const PAGES = { '/': Home, '/quem-faz': About, '/proposta': Proposal, '/casos': Cases, '/fundador': FounderPage }

export default function App() {
  const path = usePath()
  useLinkInterceptor()
  useInitialHash()
  useReveal(path)
  // Proposta de cliente só existe rodando local (yarn dev); no site não abre
  const m = import.meta.env.DEV ? path.match(/^\/proposta\/([a-z0-9-]+)$/) : null
  const client = m?.[1]
  const Page = PAGES[path] ?? Home
  return (
    <>
      <a className="skip" href="#conteudo">{content.a11y.skipLink}</a>
      <PromoBar hidden={!!client} />
      <Header />
      <main id="conteudo" key={path}>
        {client ? <ClientProposal slug={client} /> : <Page />}
      </main>
      <Footer />
      <BackToTop />
      <PromoModal hidden={!!client || path === '/fundador'} />
    </>
  )
}
