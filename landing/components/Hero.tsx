import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('landing')

  return (
    <section className="relative bg-navy-900 text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-navy-200">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary text-lg px-8 py-4">
                {t('hero.cta_primary')}
              </button>
              <button className="btn-secondary text-lg px-8 py-4 bg-transparent text-white border-white hover:bg-white/10">
                {t('hero.cta_secondary')}
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6 pt-8 border-t border-navy-700">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{t('hero.trust.verified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{t('hero.trust.protection')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{t('hero.trust.warranty')}</span>
              </div>
            </div>
          </div>

          {/* Slider A - Illustrated scenes */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-card p-8 space-y-6">
              {/* Scene 1 */}
              <div className="flex items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center text-3xl">
                  🚗
                </div>
                <div>
                  <p className="font-semibold text-lg">{t('hero.slider.scene1.title')}</p>
                  <p className="text-navy-200 text-sm">{t('hero.slider.scene1.caption')}</p>
                </div>
              </div>

              {/* Scene 2 */}
              <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center text-3xl">
                  🏍️
                </div>
                <div>
                  <p className="font-semibold text-lg">{t('hero.slider.scene2.title')}</p>
                  <p className="text-navy-200 text-sm">{t('hero.slider.scene2.caption')}</p>
                </div>
              </div>

              {/* Scene 3 */}
              <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-3xl">
                  👨‍👩‍👧
                </div>
                <div>
                  <p className="font-semibold text-lg">{t('hero.slider.scene3.title')}</p>
                  <p className="text-navy-200 text-sm">{t('hero.slider.scene3.caption')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
