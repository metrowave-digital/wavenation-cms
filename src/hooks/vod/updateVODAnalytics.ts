// src/hooks/vod/updateVODAnalytics.ts
import type { CollectionAfterChangeHook } from 'payload'

export const updateVODAnalytics: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  // Example: if you have a separate "views" collection and want to sync a summary
  // This is a placeholder aggregation – adjust to your schema.

  // If you don't have a separate analytics source yet, you can omit/disable this.

  if (!doc.analytics) return doc

  // Ensure defaults
  const analytics = {
    views: doc.analytics.views ?? 0,
    watchTime: doc.analytics.watchTime ?? 0,
    completions: doc.analytics.completions ?? 0,
    lastViewedAt: doc.analytics.lastViewedAt ?? null,
  }

  // Example: if you stored incremental fields in doc.analyticsDelta and want to fold them in:
  // if (doc.analyticsDelta?.viewsDelta) {
  //   analytics.views += doc.analyticsDelta.viewsDelta
  // }

  // For now, just normalize/fix negative values etc.
  if (analytics.views < 0) analytics.views = 0
  if (analytics.watchTime < 0) analytics.watchTime = 0
  if (analytics.completions < 0) analytics.completions = 0

  await req.payload.update({
    collection: 'vod',
    id: doc.id,
    data: {
      analytics,
      // analyticsDelta: null,
    },
  })

  return doc
}
