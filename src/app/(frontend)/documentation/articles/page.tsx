'use client'

import styles from './ArticlesPage.module.css'

export default function ArticlesDocsPage() {
  return (
    <div className={styles.container}>
      <h1>Articles System</h1>
      <p>
        Articles are the primary editorial unit. They support ownership, versioning, moderation, and
        scheduling.
      </p>

      <section>
        <h2>Supported Types</h2>
        <ul>
          <li>Standard</li>
          <li>Breaking News</li>
          <li>Reviews</li>
          <li>Interviews</li>
          <li>Sponsored</li>
        </ul>
      </section>

      <section>
        <h2>Permissions</h2>
        <p>Creators can edit their own articles. Editors and above can edit all.</p>
      </section>
    </div>
  )
}
