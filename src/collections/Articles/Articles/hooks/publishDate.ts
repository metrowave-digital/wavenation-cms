import type { CollectionBeforeChangeHook } from 'payload'

export const autoSetPublishDate: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data

  const publishing = data.status === 'published' && originalDoc?.status !== 'published'

  if (publishing && !data.publishedDate) {
    data.publishedDate = new Date().toISOString()
  }

  return data
}
