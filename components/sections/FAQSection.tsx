'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { RevealOnScroll } from '@/components/effects/RevealOnScroll'
import { cn } from '@/lib/utils'
import { faqItems } from '@/lib/faq-data'

export { faqItems } from '@/lib/faq-data'

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 border-t border-[var(--line)]" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-6">
        <RevealOnScroll className="text-center mb-14">
          <p className="text-[var(--accent)] font-medium text-sm tracking-widest uppercase mb-3">Tire suas dúvidas</p>
          <h2 id="faq-heading" className="font-display text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-[var(--text-muted)] text-lg">
            As respostas para as dúvidas mais comuns de quem nos contata pela primeira vez.
          </p>
        </RevealOnScroll>

        <div className="space-y-2" role="list">
          {faqItems.map(({ question, answer }, i) => {
            const isOpen = open === i
            return (
              <RevealOnScroll key={question} delay={i * 0.04}>
                <div
                  className={cn(
                    'glass rounded-xl overflow-hidden transition-all duration-300',
                    isOpen ? 'border-[var(--accent)]/30 border' : 'border border-transparent'
                  )}
                  role="listitem"
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span
                      className={cn(
                        'font-semibold text-base transition-colors',
                        isOpen ? 'text-[var(--accent)]' : 'text-[var(--text)] group-hover:text-[var(--accent)]'
                      )}
                    >
                      {question}
                    </span>
                    <span className={cn(
                      'shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                      isOpen ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-white/5 text-[var(--text-muted)]'
                    )}>
                      {isOpen
                        ? <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        : <Plus className="w-3.5 h-3.5" aria-hidden="true" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <div className="px-6 pb-6">
                          <div className="gold-line mb-4" />
                          <p className="text-[var(--text-muted)] leading-relaxed">{answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
