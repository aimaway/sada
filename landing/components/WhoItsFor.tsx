import { useTranslations } from 'next-intl'

export default function WhoItsFor() {
  const t = useTranslations('landing')

  const segments = [
    { icon: '🚗', title: t('who.segment1.title'), description: t('who.segment1.description') },
    { icon: '🏍️', title: t('who.segment2.title'), description: t('who.segment2.description') },
    { icon: '🚕', title: t('who.segment3.title'), description: t('who.segment3.description') },
    { icon: '🔍', title: t('who.segment4.title'), description: t('who.segment4.description') },
    { icon: '👨‍👩‍👧', title: t('who.segment5.title'), description: t('who.segment5.description') },
    { icon: '✈️', title: t('who.segment6.title'), description: t('who.segment6.description') },
  ]

  return (
    <section className="py-20 bg-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('who.title')}</h2>
          <p className="section-subtitle">{t('who.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {segments.map((segment, index) => (
            <div key={index} className="card group hover:scale-105 transition-transform duration-200">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {segment.icon}
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                {segment.title}
              </h3>
              <p className="text-navy-600">
                {segment.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
