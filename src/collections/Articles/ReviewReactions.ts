import type { CollectionConfig, Access } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Allow delete only if:
 * - Admin
 * - OR the reaction belongs to the user
 */
const canDeleteReaction: Access = ({ req, id }) => {
  if (!req.user) return false

  // Admin can always delete
  if (AccessControl.isAdmin({ req })) return true

  if (!id) return false

  // Owner-only delete
  return {
    id: { equals: id },
    user: { equals: req.user.id },
  }
}

/* ============================================================
   COLLECTION
============================================================ */

export const ReviewReactions: CollectionConfig = {
  slug: 'review-reactions',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
  ----------------------------------------------------------- */
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    delete: canDeleteReaction,
  },

  fields: [
    {
      name: 'reaction',
      type: 'relationship',
      relationTo: 'reactions',
      required: true,
    },
    {
      name: 'review',
      type: 'relationship',
      relationTo: 'reviews',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
  ],
}

export default ReviewReactions
