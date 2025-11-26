import type { CollectionBeforeChangeHook } from 'payload'

export const setUpdatedBy: CollectionBeforeChangeHook = ({ req, data }) => {
  if (!req?.user) return data
  data.updatedBy = req.user.id
  return data
}
