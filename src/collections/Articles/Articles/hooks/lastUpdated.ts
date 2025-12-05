import type { CollectionBeforeChangeHook } from 'payload'

export const autoLastUpdated: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data

  data.lastUpdated = new Date().toISOString()

  return data
}
