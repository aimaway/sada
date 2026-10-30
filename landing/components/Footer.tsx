import { useTranslations } from 'next-intl'
import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'Twitter', url: process.env.NEXT_PUBLIC_SOCIAL_TWITTER },
  { label: 'Facebook', url: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK },
  { label: 'Instagram', url: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM },
] as const

export default function Footer() {
  const t = useTranslations('landing')

  return (
    <footer className="bg-navy-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald rounded-card flex items-center justify-center">
                <span className="text-xl">🔧</span>
              </div>
              <span className="text-xl font-bold">TomoBily</span>
            </div>
            <p className="text-navy-300 text-sm mb-4">
              {t('footer.tagline')}
            </p>
            {/* Country selector */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-navy-400">{t('footer.country')}:</span>
              <select className="bg-navy-800 border border-navy-700 rounded px-2 py-1 text-sm">
                <option value="ma">🇲🇦 Morocco - Live</option>
                <option value="fr">🇫🇷 France - Coming soon</option>
                <option value="tn">🇹🇳 Tunisia - Coming soon</option>
              </select>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">{t('footer.how_it_works')}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{t('footer.pricing')}</Link></li>
              <li><Link href="/for-mechanics" className="hover:text-white transition-colors">{t('footer.for_mechanics')}</Link></li>
              <li><Link href="/for-partners" className="hover:text-white transition-colors">{t('footer.for_partners')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{t('footer.blog')}</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">{t('footer.careers')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">{t('footer.cookies')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-navy-400">
            © 2024 TomoBily. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS[0].url ? (
            <a href={SOCIAL_LINKS[0].url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LINKS[0].label} className="text-navy-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            ) : null}
            {SOCIAL_LINKS[1].url ? (
            <a href={SOCIAL_LINKS[1].url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LINKS[1].label} className="text-navy-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
            </a>
            ) : null}
            {SOCIAL_LINKS[2].url ? (
            <a href={SOCIAL_LINKS[2].url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LINKS[2].label} className="text-navy-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
