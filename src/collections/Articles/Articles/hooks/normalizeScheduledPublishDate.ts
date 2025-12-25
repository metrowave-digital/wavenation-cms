import type { CollectionBeforeValidateHook } from 'payload'

export const normalizeScheduledPublishDate: CollectionBeforeValidateHook = ({ data }) => {
  if (!data || data.status !== 'scheduled' || !data.scheduledPublishDate) {
    return data
  }

  const timezone = data.scheduledPublishTimezone || 'UTC'

  try {
    const date = new Date(
      new Date(data.scheduledPublishDate).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    )

    data.scheduledPublishDate = date.toISOString()
  } catch {
    throw new Error('Invalid scheduled publish date or timezone.')
  }

  return data
}
