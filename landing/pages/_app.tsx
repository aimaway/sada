import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Set direction based on locale
  useEffect(() => {
    document.documentElement.dir = router.locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = router.locale || 'fr'
  }, [router.locale])

  return <Component {...pageProps} />
}
