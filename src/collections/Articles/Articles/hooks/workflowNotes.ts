import type { CollectionBeforeChangeHook } from 'payload'

export const requireEditorialNotes: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  operation,
}) => {
  if (!data) return data

  // Don't enforce on create
  if (operation === 'create') return data

  const wasPublished = originalDoc?.status === 'published'
  const nowNeedsCorrection = data.status === 'needs-correction'

  const notes = typeof data.editorialNotes === 'string' ? data.editorialNotes.trim() : ''

  if ((wasPublished || nowNeedsCorrection) && !notes) {
    throw new Error(
      'Editorial Notes are required when editing published content or marking Needs Correction.',
    )
  }

  return data
}
