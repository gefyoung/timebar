import '../styles/globals.css'
// import '../configureAmplify'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import FathomHook from '../lib/fathomHook'

function MyApp({ Component, pageProps }: AppProps) {

  FathomHook()

  return <>
    <Head>
    <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />
      <meta name='theme-color' content='#EB625A' />
      <meta property='og:type' content='website' />
    {/* <script src="https://cdn.usefathom.com/script.js" data-site="PGUABNQP" defer></script> */}
    <script src="https://apis.google.com/js/platform.js" async defer></script>
      <meta name='application-name' content='Timebar' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Timebar' />
      {/* <meta name='description' content='Track your habits, change your life' /> */}
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      {/* <meta name='msapplication-config' content='/icons/browserconfig.xml' /> */}
      <meta name='msapplication-TileColor' content='#2B5797' />
      <meta name='msapplication-tap-highlight' content='no' />
      <meta name='theme-color' content='#000000' />

      {/* <link rel='apple-touch-icon' href='/icons/touch-icon-iphone.png' />
      <link rel='apple-touch-icon' sizes='152x152' href='/icons/touch-icon-ipad.png' />
      <link rel='apple-touch-icon' sizes='180x180' href='/icons/touch-icon-iphone-retina.png' />
      <link rel='apple-touch-icon' sizes='167x167' href='/icons/touch-icon-ipad-retina.png' /> */}

      <link rel='icon' type='image/png' sizes='32x32' href='/files.svg' />
      <link rel='icon' type='image/png' sizes='16x16' href='/files.svg' />
      <link rel='manifest' href='/manifest.json' />
      {/* <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#5bbad5' /> */}
      <link rel='shortcut icon' href='/files.svg' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content='https://timebar.me' />
      <meta name='twitter:title' content='Timebar' />
      <meta name='twitter:description' content='Journaling decreases stress and increases overall wellbeing -Science' />
      <meta name='twitter:image' content='https://timebar.me/pageScreenshot.png' />
      <meta name='twitter:creator' content='@_gty__' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content='Timebar' />
      {/* <meta property='og:description' content='Track your habits, change your life' /> */}
      <meta property='og:site_name' content='Timebar' />
      <meta property='og:url' content='https://timebar.me' />
      <meta property='og:image' content='https://timebar.me/pageScreenshot.png' />
    </Head>
    <Component {...pageProps} /></>
}

export default MyApp