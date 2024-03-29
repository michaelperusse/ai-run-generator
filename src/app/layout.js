import Head from 'next/head'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Run Generator',
  description: 'Create fake runs for Strava',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className=''>
      <Head>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-SCKM47W00K"></script>
          <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-SCKM47W00K');
          `}} />
      </Head>
      <body className={`${inter.className}`}>{children}</body>
    </html>
  )
}