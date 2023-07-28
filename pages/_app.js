import {UserProvider} from '@auth0/nextjs-auth0/client';
import {
  Montserrat_Alternates,
  Source_Sans_3
} from '@next/font/google';
import '../styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import {config} from '@fortawesome/fontawesome-svg-core';
import {PostsProvider} from '../context/postsContext'

config.autoAddCss = false;

const montserratAlternates = Montserrat_Alternates({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: "--font-montserrat-alt"
})

const sourceSans = Source_Sans_3({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: "--font-source-sans"
})

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
  <UserProvider>
    <PostsProvider>
      <main className={`${montserratAlternates.variable} ${sourceSans.variable} font-body`}>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </main>
    </PostsProvider>
  </UserProvider>
  )
}

export default MyApp
