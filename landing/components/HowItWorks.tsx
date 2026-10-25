import { useTranslations } from 'next-intl'

export default function HowItWorks() {
  const t = useTranslations('landing')

  const steps = [
    {
      icon: '📝',
      title: t('how_it_works.step1.title'),
      description: t('how_it_works.step1.description'),
    },
    {
      icon: '💰',
      title: t('how_it_works.step2.title'),
      description: t('how_it_works.step2.description'),
    },
    {
      icon: '🔍',
      title: t('how_it_works.step3.title'),
      description: t('how_it_works.step3.description'),
    },
    {
      icon: '✅',
      title: t('how_it_works.step4.title'),
      description: t('how_it_works.step4.description'),
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('how_it_works.title')}</h2>
          <p className="section-subtitle">{t('how_it_works.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                {index + 1}
              </div>

              {/* Card */}
              <div className="card pt-8">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-navy-600">
                  {step.description}
                </p>
              </div>

              {/* Connector line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-navy-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
