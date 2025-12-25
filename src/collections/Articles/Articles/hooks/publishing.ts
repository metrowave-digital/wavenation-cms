// src/collections/Articles/Articles/hooks/publishing.ts

import type { CollectionBeforeChangeHook } from 'payload'

export const publishingHook: CollectionBeforeChangeHook = async ({ data, operation }) => {
  if (operation !== 'update' && operation !== 'create') return data

  const now = new Date()

  if (
    data.status === 'scheduled' &&
    data.scheduledPublishDate &&
    new Date(data.scheduledPublishDate) <= now
  ) {
    data.status = 'published'
    data.publishedDate = now.toISOString()
  }

  return data
}
