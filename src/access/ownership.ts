import type { Access, CollectionSlug } from 'payload'
import { isAdmin } from './control'

export const ownerOrAdmin =
  (collectionSlug: CollectionSlug): Access =>
  async ({ req, id }) => {
    if (!req.user) return false
    if (req.user.role === 'admin') return true
    if (!id) return false

    const doc: any = await req.payload.findByID({
      collection: collectionSlug,
      id,
    })

    const owner = typeof doc?.owner === 'object' ? doc.owner?.id : doc?.owner
    return owner === req.user.id
  }
