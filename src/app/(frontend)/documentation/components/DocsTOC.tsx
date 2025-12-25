'use client'

import styles from './DocsTOC.module.css'

export function DocsTOC() {
  const items = [
    { id: 'core-systems', label: 'Core Systems' },
    { id: 'workflow', label: 'Publishing Workflow' },
    { id: 'lifecycle', label: 'Lifecycle' },
    { id: 'roles', label: 'Role Matrix' },
    { id: 'moderation', label: 'Moderation' },
    { id: 'api', label: 'API Contract' },
  ]

  return (
    <aside className={styles.toc}>
      <div className={styles.tocTitle}>On this page</div>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className={styles.tocItem}>
          {item.label}
        </a>
      ))}
    </aside>
  )
}
