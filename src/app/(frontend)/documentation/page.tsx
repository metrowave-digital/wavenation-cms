'use client'

import { DocsTOC } from './components/DocsTOC'
import { Shield, Key, Users, BarChart3, FileText, GitBranch, Bot, Clock } from 'lucide-react'
import styles from './Documentation.module.css'

export default function DocumentationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.hero}>
          <h1 className={styles.title}>WaveNation CMS Architecture</h1>
          <p className={styles.subtitle}>Enterprise Permissions • Publishing • Ads • Moderation</p>
        </header>

        <section id="core-systems" className={styles.grid}>
          <DocCard icon={<Shield />} title="API Lockdown" text="API key + fetch code enforced." />
          <DocCard icon={<Users />} title="RBAC" text="Deterministic role hierarchy." />
          <DocCard icon={<FileText />} title="Ownership" text="Creators own content." />
          <DocCard icon={<GitBranch />} title="Versioning" text="Rollback with audit." />
          <DocCard icon={<Clock />} title="Scheduling" text="Timezone-aware publishing." />
          <DocCard icon={<Bot />} title="Moderation" text="AI-assisted review flow." />
          <DocCard icon={<BarChart3 />} title="Ads" text="Strict ads governance." />
          <DocCard icon={<Key />} title="Fetch Code" text="Contract enforced." />
        </section>

        <section id="workflow" className={styles.docsSection}>
          <h2>Article Publishing Workflow</h2>
          <ul>
            <li>Draft → Review → Scheduled → Published</li>
            <li>Staff+ publish</li>
            <li>Rollback logged</li>
          </ul>
        </section>

        <section id="lifecycle" className={styles.docsSection}>
          <h2>Article Lifecycle</h2>
          <p>Editorially controlled state transitions.</p>
        </section>

        <section id="roles" className={styles.docsSection}>
          <h2>Role Matrix</h2>
          {/* table unchanged */}
        </section>

        <section id="moderation" className={styles.docsSection}>
          <h2>Moderation Flow</h2>
          {/* diagram unchanged */}
        </section>

        <section id="api" className={styles.docsSection}>
          <h2>Frontend Fetch Contract</h2>
          <pre className={styles.preBlock}>{`fetch('/api/articles', { headers })`}</pre>
        </section>
      </div>

      <DocsTOC />
    </div>
  )
}

function DocCard({ icon, title, text }: any) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}
