import type { CollectionBeforeChangeHook } from 'payload'

export const autoSetPublishDate: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data

  const isPublishing = data.status === 'published'
  const wasPublished = originalDoc?.status === 'published'

  // First publish OR republish
  if (isPublishing && !wasPublished) {
    data.publishedDate = new Date().toISOString()
  }

  return data
}
