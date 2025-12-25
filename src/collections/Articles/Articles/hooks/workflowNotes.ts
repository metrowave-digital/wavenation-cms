import type { CollectionBeforeChangeHook } from 'payload'

export const requireEditorialNotes: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  operation,
}) => {
  if (!data || !originalDoc) return data

  // Never enforce on create
  if (operation === 'create') return data

  const wasPublished = originalDoc.status === 'published'
  const isNowNeedsCorrection = data.status === 'needs-correction'

  if (!wasPublished && !isNowNeedsCorrection) return data

  const notes = typeof data.editorialNotes === 'string' ? data.editorialNotes.trim() : ''

  if (!notes) {
    throw new Error(
      'Editorial Notes are required when editing published content or marking Needs Correction.',
    )
  }

  return data
}
