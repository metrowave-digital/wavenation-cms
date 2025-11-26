import type { CollectionBeforeChangeHook } from 'payload'

export const assignOwnerOnCreateOnly: CollectionBeforeChangeHook = ({ req, data, operation }) => {
  if (operation !== 'create') return data
  if (!req?.user) return data

  data.owner = req.user.id
  return data
}
