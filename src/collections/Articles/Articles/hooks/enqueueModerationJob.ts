import type { CollectionAfterChangeHook } from 'payload'
import { enqueueModerationJob } from '../jobs/ModerationJob'

export const enqueueModerationJobHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (!req?.payload) return
  if (operation !== 'create' && operation !== 'update') return

  // Skip if already handled
  if (doc.moderationStatus && doc.moderationStatus !== 'unscanned') return

  const triggeredBy = req.user && typeof req.user === 'object' ? req.user.id : null

  await enqueueModerationJob(req.payload, {
    articleId: doc.id,
    triggeredBy,
  })
}
