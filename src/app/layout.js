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
      <body className={`${inter.className}`}>{children}</body>
    </html>
  )
}
