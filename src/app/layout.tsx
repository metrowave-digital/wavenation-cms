import type { ReactNode } from 'react'

export const metadata = {
  title: 'WaveNation CMS',
  description: 'WaveNation Admin Panel',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
