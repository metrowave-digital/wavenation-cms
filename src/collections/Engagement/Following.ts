// src/collections/Social/Following.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   OWNERSHIP HELPER (PAYLOAD SAFE)
============================================================ */

const isFollowingOwner = (req: any, doc: any): boolean => {
  if (!req?.user || !doc) return false

  const uid = String(req.user.id)
  const userId = typeof doc.user === 'object' ? String(doc.user?.id) : String(doc.user)

  return uid === userId
}

/* ============================================================
   BOOLEAN-ONLY PUBLIC READ (FIELD SAFE)
============================================================ */

const publicRead = (req: any): boolean => {
  if (req?.user) return true

  const apiKey = req?.headers?.get('x-api-key')
  const fetchCode = req?.headers?.get('x-fetch-code')

  if (!apiKey || !fetchCode) return false

  return apiKey === process.env.CMS_PUBLIC_API_KEY && fetchCode === process.env.PUBLIC_FETCH_CODE
}

/* ============================================================
   COLLECTION
============================================================ */

export const Following: CollectionConfig = {
  slug: 'following',

  admin: {
    useAsTitle: 'id',
    group: 'Social',
    defaultColumns: ['user', 'following', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (SOCIAL-SAFE)
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Public (API locked)
     * - Logged-in users
     */
    read: ({ req }: any) => publicRead(req),

    /**
     * CREATE
     * - Logged-in users only
     * - Ownership enforced via hook
     */
    create: AccessControl.isLoggedIn,

    /**
     * UPDATE
     * - Never (immutable relationship)
     */
    update: () => false,

    /**
     * DELETE
     * - Owner (self-unfollow)
     * - Admin override
     */
    delete: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      return isFollowingOwner(req, doc)
    },
  },

  timestamps: true,

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'following',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'syncWithFollowers',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        readOnly: true,
        description: 'Managed automatically by Followers sync.',
      },
    },

    /**
     * Audit
     */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  /* -----------------------------------------------------------
     INDEXES (CRITICAL)
  ----------------------------------------------------------- */
  indexes: [
    {
      fields: ['user', 'following'],
      unique: true,
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req?.user) {
          // Enforce ownership
          data.user = req.user.id
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default Following
