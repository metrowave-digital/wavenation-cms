import type { CollectionBeforeValidateHook } from 'payload'

export const validateStartEndTimes: CollectionBeforeValidateHook = ({ data }) => {
  const start = data?.startTime
  const end = data?.endTime

  if (!start || !end) {
    throw new Error('Start and End time required.')
  }

  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)

  const startNum = sh * 60 + sm
  const endNum = eh * 60 + em

  if (endNum <= startNum) {
    throw new Error('End time must be after start time.')
  }

  return data
}
