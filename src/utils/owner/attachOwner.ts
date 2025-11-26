import type { CollectionBeforeChangeHook } from 'payload'

export const attachOwner: CollectionBeforeChangeHook = ({ req, data }) => {
  if (!req?.user) return data
  if (!data.owner) data.owner = req.user.id
  return data
}
