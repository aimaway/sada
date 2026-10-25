import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import WhoItsFor from '@/components/WhoItsFor'
import FairPrice from '@/components/FairPrice'
import Community from '@/components/Community'
import Partners from '@/components/Partners'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  const t = useTranslations('landing')

  return (
    <>
      <Head>
        <title>{t('title')} - {t('tagline')}</title>
        <meta name="description" content={t('description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_MA" />
        <meta property="og:locale:alternate" content="ar_MA" />
        <meta property="og:locale:alternate" content="en_US" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "MécaCasablanca",
              "description": t('description'),
              "areaServed": {
                "@type": "City",
                "name": "Casablanca"
              },
              "priceRange": "$$"
            })
          }}
        />
      </Head>

      <main className="min-h-screen">
        <Hero />
        <HowItWorks />
        <WhoItsFor />
        <FairPrice />
        <Community />
        <Partners />
        <FAQ />
        <Footer />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: {
        landing: {
          title: 'MécaCasablanca',
          tagline: 'Fair price, zero scams',
          description: 'On-demand car repair at your location. Propose your price, choose your verified mechanic.',
        }
      },
      locale,
    },
  }
}
