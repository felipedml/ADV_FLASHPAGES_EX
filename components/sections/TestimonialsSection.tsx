import { RevealOnScroll } from '@/components/effects/RevealOnScroll'
import { SpotlightCard } from '@/components/effects/SpotlightCard'
import { Quote } from 'lucide-react'

const items = [
  {
    text: 'Recebi orientação clara e objetiva sobre minha situação contratual. A equipe foi extremamente profissional e me deixou tranquilo em um momento de muita incerteza.',
    author: 'Marcos A.',
    role: 'Empresário — Fortaleza, CE',
    area: 'Direito Empresarial',
    initial: 'M',
  },
  {
    text: 'Quando precisei reorganizar o patrimônio da minha família, a orientação que recebi foi precisa e cuidadosa. Senti que meus interesses foram tratados como prioridade.',
    author: 'Patrícia L.',
    role: 'Médica — Fortaleza, CE',
    area: 'Planejamento Patrimonial',
    initial: 'P',
  },
  {
    text: 'Atendimento rápido, humano e muito competente. Minha questão trabalhista foi tratada com seriedade e atenção. Recomendo a todos que buscam advocacia de qualidade.',
    author: 'João F.',
    role: 'Servidor Público — Caucaia, CE',
    area: 'Direito Trabalhista',
    initial: 'J',
  },
  {
    text: 'Nossa empresa precisava de uma revisão completa dos contratos com fornecedores. O trabalho foi minucioso e nos deu muito mais segurança nas negociações.',
    author: 'Carla M.',
    role: 'Empresária — Maracanaú, CE',
    area: 'Direito Contratual',
    initial: 'C',
  },
  {
    text: 'A consultoria tributária que recebi nos ajudou a identificar oportunidades legais de economia fiscal. Profissionalismo e expertise que fazem diferença.',
    author: 'Roberto S.',
    role: 'Contador — Fortaleza, CE',
    area: 'Direito Tributário',
    initial: 'R',
  },
  {
    text: 'Precisei de apoio jurídico numa questão imobiliária complexa e recebi um atendimento que superou minhas expectativas. Clareza, agilidade e comprometimento.',
    author: 'Fernanda C.',
    role: 'Arquiteta — Fortaleza, CE',
    area: 'Direito Imobiliário',
    initial: 'F',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll className="text-center mb-16">
          <p className="text-[var(--accent)] font-medium text-sm tracking-widest uppercase mb-3">
            O que nossos clientes dizem
          </p>
          <h2 id="testimonials-heading" className="font-display text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Relatos de quem confiou em nós
          </h2>
          <p className="text-[var(--text-muted)] text-base max-w-xl mx-auto">
            Depoimentos reais de clientes. Preservamos os sobrenomes completos por sigilo —
            disponíveis mediante solicitação.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ text, author, role, area, initial }, i) => (
            <RevealOnScroll key={author} delay={i * 0.06}>
              <SpotlightCard className="glass rounded-2xl p-7 card-hover h-full flex flex-col">
                <Quote className="w-8 h-8 text-[var(--accent)]/40 mb-4 shrink-0" aria-hidden="true" />
                <blockquote className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 flex-1">
                  <p>&ldquo;{text}&rdquo;</p>
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--line)]">
                  <div className="w-9 h-9 rounded-full bg-[var(--brand-500)]/20 flex items-center justify-center shrink-0">
                    <span className="font-display text-[var(--accent)] font-bold text-sm" aria-hidden="true">
                      {initial}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text)] text-sm">{author}</p>
                    <p className="text-[var(--text-muted)] text-xs">{role}</p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium shrink-0">
                    {area}
                  </span>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-8 text-center">
          <p className="text-[var(--text-muted)] text-xs">
            Os depoimentos acima são relatos espontâneos e não representam promessa de resultado.
            Cada caso é único e depende de suas circunstâncias específicas. {' '}
            <span className="text-[var(--accent)]/70">Provimento n.º 205/2021 do CFOAB.</span>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
