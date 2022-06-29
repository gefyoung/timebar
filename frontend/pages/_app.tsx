import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta name='application-name' content='Timebar' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='PWA App' />
      <meta name='description' content='Track your habits, change your life' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      {/* <meta name='msapplication-config' content='/icons/browserconfig.xml' /> */}
      <meta name='msapplication-TileColor' content='#2B5797' />
      <meta name='msapplication-tap-highlight' content='no' />
      <meta name='theme-color' content='#000000' />

      {/* <link rel='apple-touch-icon' href='/icons/touch-icon-iphone.png' /> */}
      {/* <link rel='apple-touch-icon' sizes='152x152' href='/icons/touch-icon-ipad.png' />
      <link rel='apple-touch-icon' sizes='180x180' href='/icons/touch-icon-iphone-retina.png' />
      <link rel='apple-touch-icon' sizes='167x167' href='/icons/touch-icon-ipad-retina.png' /> */}

      <link rel='icon' type='image/png' sizes='32x32' href='/files.svg' />
      <link rel='icon' type='image/png' sizes='16x16' href='/files.svg' />
      <link rel='manifest' href='/manifest.json' />
      {/* <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#5bbad5' /> */}
      <link rel='shortcut icon' href='/files.svg' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />

      <meta name='twitter:card' content='Track your habits, change your life' />
      <meta name='twitter:url' content='https://timebar.me' />
      <meta name='twitter:title' content='Timebar' />
      <meta name='twitter:description' content='Track your habits, change your life' />
      <meta name='twitter:image' content='https://yourdomain.com/files.svg' />
      <meta name='twitter:creator' content='@_gty__' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content='Timebar' />
      <meta property='og:description' content='Track your habits, change your life' />
      <meta property='og:site_name' content='Timebar' />
      <meta property='og:url' content='https://timebar.me' />
      {/* <meta property='og:image' content='https://yourdomain.com/icons/apple-touch-icon.png' /> */}
    </Head>
    <Component {...pageProps} /></>
}

export default MyApp
