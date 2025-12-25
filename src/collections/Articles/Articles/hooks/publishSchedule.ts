import type { CollectionAfterChangeHook } from 'payload'

export const autoSchedulePublishing: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Only act on updates (not create, not delete)
  if (operation !== 'update') return

  // Only scheduled items qualify
  if (doc.status !== 'scheduled' || !doc.scheduledPublishDate) return

  const now = new Date()
  const publishTime = new Date(doc.scheduledPublishDate)

  // Not time yet
  if (publishTime > now) return

  // 🔒 Prevent infinite loop:
  // If already published by another hook, do nothing
  if (doc.publishedDate) return

  // Perform controlled update
  await req.payload.update({
    collection: 'articles',
    id: doc.id,
    data: {
      status: 'published',
      publishedDate: now.toISOString(),
    },
    // IMPORTANT: bypass afterChange hooks to avoid recursion
    overrideAccess: true,
  })
}
