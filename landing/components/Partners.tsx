import { useTranslations } from 'next-intl'

export default function Partners() {
  const t = useTranslations('landing')

  const partnerTypes = [
    { icon: '🛡️', title: t('partners.insurance'), benefits: ['Fast claims processing', 'Verified network', 'Cost transparency'] },
    { icon: '🚗', title: t('partners.rental'), benefits: ['Fleet maintenance', 'Priority service', 'Monthly invoicing'] },
    { icon: '📦', title: t('partners.delivery'), benefits: ['Minimize downtime', 'Recurring plans', 'Bulk discounts'] },
    { icon: '🔧', title: t('partners.mechanics'), benefits: ['More customers', 'Fair commission', 'Growth tools'] },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('partners.title')}</h2>
          <p className="section-subtitle">{t('partners.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partnerTypes.map((partner, index) => (
            <div key={index} className="card text-center">
              <div className="text-5xl mb-4">{partner.icon}</div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                {partner.title}
              </h3>
              <ul className="space-y-2 text-sm text-navy-600">
                {partner.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Waitlist form */}
        <div className="max-w-2xl mx-auto">
          <div className="card bg-gradient-to-br from-navy-900 to-navy-800 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">
              {t('partners.waitlist_title')}
            </h3>
            <p className="text-navy-200 text-center mb-6">
              {t('partners.waitlist_description')}
            </p>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t('partners.form.name')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-card text-white placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-orange"
                />
                <input
                  type="email"
                  placeholder={t('partners.form.email')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-card text-white placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-card text-white focus:outline-none focus:ring-2 focus:ring-orange">
                <option value="" className="text-navy-900">{t('partners.form.type')}</option>
                <option value="insurance" className="text-navy-900">{t('partners.insurance')}</option>
                <option value="rental" className="text-navy-900">{t('partners.rental')}</option>
                <option value="delivery" className="text-navy-900">{t('partners.delivery')}</option>
                <option value="mechanic" className="text-navy-900">{t('partners.mechanics')}</option>
              </select>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="consent" className="mt-1 w-4 h-4" required />
                <label htmlFor="consent" className="text-sm text-navy-200">
                  {t('partners.form.consent')}
                </label>
              </div>
              <button type="submit" className="btn-primary w-full">
                {t('partners.form.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
