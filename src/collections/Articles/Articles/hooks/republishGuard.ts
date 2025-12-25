import type { CollectionBeforeChangeHook } from 'payload'

export const republishGuard: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data || !originalDoc) return data

  const wasPublished = originalDoc.status === 'published'
  const isPublishing = data.status === 'published'

  if (wasPublished && isPublishing) {
    // Treat as republish
    data.publishedDate = new Date().toISOString()
  }

  return data
}
