import type { CollectionBeforeChangeHook } from 'payload'

export const protectOwnerField: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
  const isAdmin = req?.user?.role === 'admin'

  if (!isAdmin && data?.owner && data.owner !== originalDoc?.owner) {
    throw new Error('You cannot change the owner of this document.')
  }

  return data
}
