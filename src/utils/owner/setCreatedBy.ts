import type { CollectionBeforeChangeHook } from 'payload'

export const setCreatedBy: CollectionBeforeChangeHook = ({ req, data, operation }) => {
  if (operation !== 'create') return data
  if (!req?.user) return data

  data.createdBy = req.user.id
  return data
}
