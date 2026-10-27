import { useTranslations } from 'next-intl'

export default function Community() {
  const t = useTranslations('landing')

  const tuningTiers = [
    { stage: 'Stage 1', description: 'Basic upgrades', color: 'bg-blue-500' },
    { stage: 'Stage 2', description: 'Performance mods', color: 'bg-purple-500' },
    { stage: 'Stage 3', description: 'Advanced tuning', color: 'bg-orange' },
  ]

  const samplePosts = [
    {
      title: 'Best oil for Dacia Logan?',
      author: 'Ahmed K.',
      likes: 24,
      answers: 8,
      verified: true,
    },
    {
      title: 'My garage: Clio RS Stage 2 build',
      author: 'Youssef M.',
      likes: 45,
      answers: 12,
      verified: false,
    },
    {
      title: 'Battery died after 2 years - normal?',
      author: 'Sara L.',
      likes: 18,
      answers: 15,
      verified: true,
    },
  ]

  return (
    <section className="py-20 bg-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('community.title')}</h2>
          <p className="section-subtitle">{t('community.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Community Feed Preview */}
          <div>
            <h3 className="text-2xl font-bold text-navy-900 mb-6">
              {t('community.feed_title')}
            </h3>
            <div className="space-y-4">
              {samplePosts.map((post, index) => (
                <div key={index} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-navy-900 flex-1">
                      {post.title}
                    </h4>
                    {post.verified && (
                      <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-navy-600">
                    <span>{post.author}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.answers}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary mt-6 w-full">
              {t('community.join_cta')}
            </button>
          </div>

          {/* Tuning Hub */}
          <div>
            <h3 className="text-2xl font-bold text-navy-900 mb-6">
              {t('community.tuning_title')}
            </h3>
            <div className="space-y-4 mb-6">
              {tuningTiers.map((tier, index) => (
                <div key={index} className="card flex items-center gap-4">
                  <div className={`w-16 h-16 ${tier.color} rounded-card flex items-center justify-center text-white font-bold text-lg`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900">{tier.stage}</h4>
                    <p className="text-sm text-navy-600">{tier.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sample mechanic creator */}
            <div className="card bg-gradient-to-br from-navy-900 to-navy-800 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                  🔧
                </div>
                <div>
                  <h4 className="font-bold text-lg">Ahmed Benali</h4>
                  <p className="text-navy-200 text-sm">Toyota Specialist • 8 years</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>⭐ 4.8</span>
                <span>📸 24 before/after</span>
                <span>🎥 5 videos</span>
              </div>
              <button className="btn-primary mt-4 w-full bg-white text-navy-900 hover:bg-navy-100">
                {t('community.view_profile')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
