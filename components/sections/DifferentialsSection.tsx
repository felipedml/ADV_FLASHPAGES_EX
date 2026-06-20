import { RevealOnScroll } from '@/components/effects/RevealOnScroll'
import { SpotlightCard } from '@/components/effects/SpotlightCard'
import { Shield, Users, Clock, Award, BookOpen, Headphones } from 'lucide-react'

const items = [
  {
    icon: Shield,
    title: 'Ética e Transparência',
    description: 'Atuação 100% pautada no Estatuto da OAB e nas normas deontológicas. Você sabe exatamente o que esperamos e o que oferecemos.',
  },
  {
    icon: Users,
    title: 'Atendimento Humanizado',
    description: 'Cada cliente tem um advogado dedicado ao seu caso. Nenhum atendimento padronizado — cada situação recebe a atenção que merece.',
  },
  {
    icon: Clock,
    title: 'Agilidade e Disponibilidade',
    description: 'Resposta em até 24 horas e canal de comunicação direta com sua equipe jurídica. Questões urgentes têm prioridade imediata.',
  },
  {
    icon: Award,
    title: 'Experiência Consolidada',
    description: 'Mais de 16 anos de atuação e 1.200+ clientes atendidos. Um histórico sólido que reflete nossa capacidade e comprometimento.',
  },
  {
    icon: BookOpen,
    title: 'Estratégia Preventiva',
    description: 'Preferimos prevenir conflitos a litigá-los. Nossa assessoria preventiva evita problemas antes que se tornem processos.',
  },
  {
    icon: Headphones,
    title: 'Suporte Pós-Atendimento',
    description: 'O relacionamento não termina com o encerramento do caso. Continuamos disponíveis para dúvidas e novos desafios jurídicos.',
  },
]

export function DifferentialsSection() {
  return (
    <section className="py-24 relative" aria-labelledby="diff-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)]/20 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <RevealOnScroll>
              <p className="text-[var(--accent)] font-medium text-sm tracking-widest uppercase mb-3">
                Por que nos escolher
              </p>
              <h2 id="diff-heading" className="font-display text-4xl md:text-5xl font-bold text-[var(--text)] mb-6 leading-tight">
                Advocacia que vai além do processo.
              </h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8">
                Nosso diferencial não está apenas na técnica jurídica — está na forma como tratamos cada cliente:
                como uma pessoa real, com uma história real, que merece orientação jurídica de verdade.
              </p>
              <div className="gold-line mb-8" />
              <blockquote className="glass rounded-xl p-6">
                <p className="font-display text-lg italic text-[var(--text)] mb-3 leading-relaxed">
                  &ldquo;Acreditamos que direito bem exercido é aquele que devolve à pessoa a tranquilidade
                  para viver e trabalhar sem medo do imprevisível jurídico.&rdquo;
                </p>
                <footer className="text-[var(--text-muted)] text-sm">
                  <cite>— Dr. Ricardo Bastos, Sócio-Fundador</cite>
                </footer>
              </blockquote>
            </RevealOnScroll>
          </div>

          {/* Right — grid of differentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ icon: Icon, title, description }, i) => (
              <RevealOnScroll key={title} delay={i * 0.07}>
                <SpotlightCard className="glass rounded-xl p-5 card-hover group h-full">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--accent)]/20 transition-colors">
                    <Icon className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-[var(--text)] text-sm mb-2">{title}</h3>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed">{description}</p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
