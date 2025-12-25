import type { CollectionBeforeChangeHook } from 'payload'

export const autoLastUpdated: CollectionBeforeChangeHook = ({ data, originalDoc, operation }) => {
  if (!data) return data

  // Always set on create
  if (operation === 'create') {
    data.lastUpdated = new Date().toISOString()
    return data
  }

  // On update, only set if something actually changed
  if (operation === 'update' && originalDoc) {
    const changed = JSON.stringify(data) !== JSON.stringify(originalDoc)

    if (changed) {
      data.lastUpdated = new Date().toISOString()
    }
  }

  return data
}
