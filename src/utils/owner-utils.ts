import type { CollectionBeforeChangeHook } from 'payload'

export const attachOwner: CollectionBeforeChangeHook = ({ req, data }) => {
  // Safety check for TypeScript
  if (!req?.user) return data

  if (!data.owner) {
    data.owner = req.user.id
  }

  return data
}
