// src/collections/Engagement/Reactions.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const Reactions: CollectionConfig = {
  slug: 'reactions',

  admin: {
    useAsTitle: 'label',
    group: 'Engagement',
    defaultColumns: ['label', 'emoji'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (SYSTEM-OWNED)
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Public frontend (API locked)
     * - Logged-in users
     */
    read: AccessControl.isPublic,

    /**
     * CREATE
     * - Admin / System only
     */
    create: AccessControl.isAdmin,

    /**
     * UPDATE
     * - Admin / System only
     */
    update: AccessControl.isAdmin,

    /**
     * DELETE
     * - Never (reactions are immutable once defined)
     */
    delete: () => false,
  },

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Internal name (e.g. Like, Love, Laugh).',
      },
    },
    {
      name: 'emoji',
      type: 'text',
      required: true,
      admin: {
        description: 'Emoji to display (🔥, 💯, 😂, ❤️, 👎).',
      },
    },

    /* ---------------------------------------------------------
       AUDIT
    --------------------------------------------------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req?.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id
          }
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default Reactions
