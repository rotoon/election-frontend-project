import Providers from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { Kanit } from 'next/font/google'

import './globals.css'

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

// SEO Metadata for Lighthouse 100
export const metadata: Metadata = {
  title: 'Election Results Center | ระบบรายงานผลการเลือกตั้ง',
  description:
    'ติดตามผลการเลือกตั้งแบบเรียลไทม์ ดูจำนวนที่นั่ง ผลคะแนน และแผนที่ผลการเลือกตั้งทั่วประเทศ',
  keywords: ['election', 'เลือกตั้ง', 'ผลการเลือกตั้ง', 'การเมือง', 'Thailand'],
  authors: [{ name: 'Election Commission' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Election Results Center',
    description: 'Live election results and real-time vote tracking',
    type: 'website',
    locale: 'th_TH',
    siteName: 'Election Results Center',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Election Results Center',
    description: 'Live election results and real-time vote tracking',
  },
}

// Viewport configuration for Lighthouse
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f242e' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='th'
      className={`${kanit.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${kanit.className} antialiased`}
      >
        <Providers>
          {children}
          <Toaster position='top-center' visibleToasts={1} />
        </Providers>
      </body>
    </html>
  )
}
