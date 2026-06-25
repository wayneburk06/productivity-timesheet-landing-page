import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Productivity Timesheet — Plan every 15 minutes',
    template: '%s · Productivity Timesheet',
  },
  description:
    'A powerful Windows productivity app that helps you compare your planned work with what you actually accomplished. Plan in 15-minute blocks, sync with Outlook, and keep your data private on your PC.',
  keywords: [
    'time tracking',
    'time blocking',
    'productivity app',
    'Windows timesheet',
    'planned vs actual',
    'Outlook calendar sync',
    'focus tracking',
  ],
  authors: [{ name: 'Productivity Timesheet' }],
  openGraph: {
    title: 'Productivity Timesheet — Plan every 15 minutes',
    description:
      'Compare your planned work with what you actually accomplished. A privacy-first Windows productivity app.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Productivity Timesheet — Plan every 15 minutes',
    description:
      'Compare your planned work with what you actually accomplished. A privacy-first Windows productivity app.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light ${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
