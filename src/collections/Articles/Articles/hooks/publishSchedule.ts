import type { CollectionAfterChangeHook } from 'payload'

export const autoSchedulePublishing: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (doc.status !== 'scheduled' || !doc.scheduledPublishDate) return

  const now = new Date()
  const publishTime = new Date(doc.scheduledPublishDate)

  if (publishTime <= now) {
    await req.payload.update({
      collection: 'articles',
      id: doc.id,
      data: {
        status: 'published',
        publishedDate: now.toISOString(),
      },
    })
  }
}
