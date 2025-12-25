import type { CollectionBeforeChangeHook } from 'payload'
import { isAdminRole } from '@/access/control'

const TOXICITY_THRESHOLD = 0.7

export const moderationHook: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
  operation,
}) => {
  if (!data) return data

  // Only run on create/update (not delete)
  if (operation !== 'create' && operation !== 'update') return data

  // Admin bypass (enterprise rule)
  if (req?.user && isAdminRole(req)) {
    data.moderationStatus = data.moderationStatus ?? 'unscanned'
    data.moderationLog = [
      ...(originalDoc?.moderationLog || []),
      {
        at: new Date().toISOString(),
        by: req.user.id,
        action: 'bypassed',
        score: typeof data.toxicityScore === 'number' ? data.toxicityScore : 0,
        isToxic: typeof data.isToxic === 'boolean' ? data.isToxic : false,
        message: 'Admin bypassed moderation enforcement.',
      },
    ]
    return data
  }

  // If no score yet, leave it alone (queue handles scoring)
  if (typeof data.toxicityScore !== 'number') {
    data.toxicityScore = 0
  }
  if (typeof data.isToxic !== 'boolean') {
    data.isToxic = false
  }

  // Auto-flag rule: score triggers Needs Correction (editorial workflow)
  const isToxic = data.toxicityScore >= TOXICITY_THRESHOLD
  data.isToxic = isToxic

  // Only auto-move status if attempting to publish/schedule OR currently published/review,
  // and the content is toxic.
  if (isToxic) {
    const nextStatus = data.status ?? originalDoc?.status ?? 'draft'
    const sensitive =
      nextStatus === 'published' || nextStatus === 'scheduled' || nextStatus === 'review'

    if (sensitive) {
      data.status = 'needs-correction'
      data.editorialNotes =
        (typeof data.editorialNotes === 'string' && data.editorialNotes.trim().length > 0
          ? data.editorialNotes.trim() + '\n\n'
          : '') +
        `AUTO-FLAG: Moderation score ${data.toxicityScore.toFixed(2)} exceeded threshold. Please review.`
    }

    data.moderationStatus = 'flagged'
  } else {
    data.moderationStatus = data.moderationStatus === 'error' ? 'error' : 'scanned'
  }

  data.moderationLastScanAt = new Date().toISOString()
  data.moderationLastError = undefined

  data.moderationLog = [
    ...(originalDoc?.moderationLog || []),
    {
      at: new Date().toISOString(),
      by: req?.user?.id ?? undefined,
      action: isToxic ? 'flagged' : 'scanned',
      score: data.toxicityScore,
      isToxic: data.isToxic,
      message: isToxic ? 'Auto-flagged by moderation rule.' : 'Moderation scan recorded.',
    },
  ]

  return data
}
