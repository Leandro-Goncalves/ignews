import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { Provider as NextAuthProvider } from 'next-auth/client'
import NextNProgress from 'nextjs-progressbar'
import { AnimatePresence } from 'framer-motion'

import "../styles/global.scss"
function MyApp({ Component, pageProps, router }:AppProps) {
  return (
    <AnimatePresence exitBeforeEnter>
      <NextAuthProvider session={pageProps.session}>
        <NextNProgress
          color="#eba417"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
        />
        <Header/>
        <Component {...pageProps} key={router.route} />
      </NextAuthProvider>
    </AnimatePresence>
  )
}

export default MyApp
