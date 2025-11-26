import type { CollectionBeforeChangeHook } from 'payload'

export const enforceOwnerOnUpdate: CollectionBeforeChangeHook = ({
  req,
  data,
  originalDoc,
  operation,
}) => {
  if (operation !== 'update') return data

  const userId = req?.user?.id
  const ownerId = originalDoc?.owner

  if (!userId || userId !== ownerId) {
    throw new Error('You do not have permission to update this document.')
  }

  return data
}
