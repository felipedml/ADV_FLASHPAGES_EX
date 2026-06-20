import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { PracticeAreasSection } from '@/components/sections/PracticeAreasSection'
import { DifferentialsSection } from '@/components/sections/DifferentialsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { SITE } from '@/lib/utils'
import { faqItems } from '@/lib/faq-data'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export const metadata: Metadata = {
  title: `${SITE.name} — Advocacia Premium em Fortaleza`,
  description: 'Escritório de advocacia premium em Fortaleza. Direito Civil, Empresarial, Trabalhista, Tributário, Imobiliário e Sucessório. Mais de 16 anos de experiência. Agende sua consulta.',
  alternates: { canonical: SITE.url },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <PracticeAreasSection />
        <DifferentialsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
