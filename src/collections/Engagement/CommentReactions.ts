// src/collections/Engagement/CommentReactions.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   OWNERSHIP HELPER (PAYLOAD TYPING SAFE)
============================================================ */

const isReactionOwner = (req: any, doc: any): boolean => {
  if (!req?.user || !doc) return false

  const uid = String(req.user.id)
  const reactionUserId = typeof doc.user === 'object' ? String(doc.user?.id) : String(doc.user)

  return uid === reactionUserId
}

/* ============================================================
   COLLECTION
============================================================ */

export const CommentReactions: CollectionConfig = {
  slug: 'comment-reactions',

  admin: {
    useAsTitle: 'id',
    group: 'Engagement',
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (ABUSE-SAFE)
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Public frontend (API key + fetch code)
     * - Logged-in users
     */
    read: AccessControl.isPublic,

    /**
     * CREATE
     * - Logged-in users only
     * - Ownership enforced via hook
     */
    create: AccessControl.isLoggedIn,

    /**
     * UPDATE
     * - Never (immutable reaction)
     */
    update: () => false,

    /**
     * DELETE
     * - Reaction owner
     * - Admin override
     */
    delete: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      return isReactionOwner(req, doc)
    },
  },

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'reaction',
      type: 'relationship',
      relationTo: 'reactions',
      required: true,
    },
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: { readOnly: true },
    },
  ],

  /* -----------------------------------------------------------
     INDEXES
  ----------------------------------------------------------- */
  indexes: [
    {
      fields: ['reaction', 'comment', 'user'],
      unique: true,
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === 'create' && req?.user) {
          // Force ownership (prevents spoofing)
          data.user = req.user.id
        }
        return data
      },
    ],
  },
}

export default CommentReactions
