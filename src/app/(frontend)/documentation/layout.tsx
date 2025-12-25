'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './DocumentationLayout.module.css'

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
      {label}
    </Link>
  )
}

export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return (
    <section className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>WaveNation Docs</div>

        <nav className={styles.nav}>
          <NavLink href="/documentation" label="Overview" />

          <div className={styles.navSection}>Content</div>
          <NavLink href="/documentation/articles" label="Articles" />
          <NavLink href="/documentation/shows" label="Shows" />

          <div className={styles.navSection}>Advertising</div>
          <NavLink href="/documentation/ads" label="Ads System" />

          <div className={styles.navSection}>Security</div>
          <NavLink href="/documentation/rbac" label="Roles & Permissions" />
        </nav>
      </aside>

      <main className={styles.main}>{children}</main>
    </section>
  )
}
