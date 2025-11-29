import React from 'react'
import './styles.css'

export const metadata = {
  title: 'WaveNation CMS',
  description: 'Content Management System for WaveNation Media',
  icons: {
    icon: '/site-icon.svg',
    shortcut: '/site-icon.svg',
    apple: '/site-icon.svg',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
