import { useEffect, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { content } from '@/lib/content'
import PageHead from '@/pages/PageHead'
import PriceCalc from '@/components/PriceCalc'
import { Seg } from '@/sections/Plans'

// Simulador: a calculadora de planos com espaço próprio. Escolhe a família,
// diz quantos clientes e o tamanho da equipe, e vê o plano indicado.
export default function Simulate() {
  const p = content.plans
  const s = p.simPage
  const [fam, setFam] = useState('relacionamento')
  const t = p.tabs.find((x) => x.id === fam)
  // a calculadora é recriada ao trocar de família; como ela usa data-reveal e o
  // useReveal só observa o que existia quando a página abriu, ela já entra visível
  useEffect(() => {
    document.querySelectorAll('.page-sim [data-reveal]').forEach((el) => el.classList.add('is-in'))
  }, [fam])
  return (
    <div className="page page-sim">
      <section data-theme="light" className="section sim-sec">
        <div className="wrap">
          <PageHead label={s.label} title={s.title} titleAccent={s.titleAccent} lede={s.lede} />
          <div className="sim-fam" data-reveal>
            <Seg label="Família de planos" value={fam} onChange={setFam} options={p.tabs.map((x) => ({ label: x.label, value: x.id }))} />
            <p>{t.lede}</p>
          </div>
          <PriceCalc key={fam} fam={fam} />
          <a href={s.back.href} className="sim-back"><ArrowLeft size={14} weight="bold" aria-hidden="true" /> {s.back.label}</a>
        </div>
      </section>
    </div>
  )
}
