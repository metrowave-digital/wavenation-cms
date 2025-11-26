import type { CollectionBeforeChangeHook } from 'payload'

export const autoTimestamps: CollectionBeforeChangeHook = ({ data, operation }) => {
  const now = new Date().toISOString()

  if (operation === 'create') {
    data.createdAt = now
  }

  data.updatedAt = now
  return data
}
