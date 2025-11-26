import React from 'react'
import './styles.css'

import { Inter, Fira_Sans as FiraSans, Oswald, Merriweather } from 'next/font/google'

export const metadata = {
  title: 'WaveNation CMS',
  description: 'WaveNation Admin Panel',
}

// UI / Admin text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// Body text (Fira Sans needs weight specified)
const fira = FiraSans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fira',
})

// Headlines / branding
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
})

// Editorial long-form
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fira.variable} ${oswald.variable} ${merriweather.variable}`}
    >
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
