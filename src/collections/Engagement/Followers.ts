// src/collections/Social/Followers.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   OWNERSHIP HELPER (PAYLOAD SAFE)
============================================================ */

const isFollowerOwner = (req: any, doc: any): boolean => {
  if (!req?.user || !doc) return false

  const uid = String(req.user.id)
  const followerId =
    typeof doc.follower === 'object' ? String(doc.follower?.id) : String(doc.follower)

  return uid === followerId
}

/* ============================================================
   BOOLEAN-ONLY PUBLIC FIELD READ (FIELD SAFE)
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

export const Followers: CollectionConfig = {
  slug: 'followers',

  admin: {
    useAsTitle: 'id',
    group: 'Social',
    defaultColumns: ['follower', 'following', 'createdAt'],
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
     * CREATE (follow)
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
     * DELETE (unfollow)
     * - Follower (self)
     * - Admin override
     */
    delete: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      return isFollowerOwner(req, doc)
    },
  },

  timestamps: true,

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'follower',
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
      name: 'notifyOnFollow',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Followed user is notified.',
      },
    },

    {
      name: 'inboxEntry',
      type: 'relationship',
      relationTo: 'inbox',
      admin: {
        description: 'Automatically created inbox entry.',
        readOnly: true,
      },
    },

    {
      name: 'notification',
      type: 'relationship',
      relationTo: 'notifications',
      admin: {
        description: 'Optional notification record.',
        readOnly: true,
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
      fields: ['follower', 'following'],
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
          data.follower = req.user.id
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default Followers
