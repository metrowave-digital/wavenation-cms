import type { CollectionConfig, Access } from 'payload'

import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * READ:
 * - Admin / Staff → read all access logs
 * - User → read only their own access records
 */
const canReadContentAccess: Access = ({ req }) => {
  if (!req?.user) return false

  // 🔑 Global overrides
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true

  // User-scoped read
  return {
    user: {
      equals: req.user.id,
    },
  }
}

/**
 * UPDATE / DELETE:
 * - Admin / Staff only
 * (Users should never mutate access logs)
 */
const canManageContentAccess: Access = ({ req }) =>
  Boolean(req?.user && (isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF)))

/**
 * CREATE:
 * - Public allowed (frontend tracking, API logging, TV apps, webhooks)
 */
const canCreateContentAccess: Access = () => true

/* ============================================================
   COLLECTION
============================================================ */

export const ContentAccess: CollectionConfig = {
  slug: 'content-access',

  admin: {
    useAsTitle: 'id',
    group: 'Content Monetization',
    defaultColumns: ['user', 'contentType', 'contentItem', 'accessedAt'],
  },

  access: {
    read: canReadContentAccess,
    create: canCreateContentAccess,
    update: canManageContentAccess,
    delete: canManageContentAccess,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       USER
    -------------------------------------------------------- */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: {
        update: ({ req }) => Boolean(req?.user && isAdminRole(req)),
      },
    },

    /* --------------------------------------------------------
       CONTENT TARGET
    -------------------------------------------------------- */
    {
      name: 'contentType',
      type: 'select',
      required: true,
      options: [
        'shows',
        'episodes',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'articles',
        'tracks',
        'albums',
      ].map((v) => ({ label: v, value: v })),
    },

    {
      name: 'contentItem',
      type: 'relationship',
      relationTo: [
        'shows',
        'episodes',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'articles',
        'tracks',
        'albums',
      ],
      required: true,
    },

    /* --------------------------------------------------------
       ACCESS EVENT
    -------------------------------------------------------- */
    {
      name: 'accessedAt',
      type: 'date',
      required: true,
    },

    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'App, Web, TV, etc.',
      },
    },

    {
      name: 'sessionId',
      type: 'text',
    },

    {
      name: 'metadata',
      type: 'json',
      access: {
        update: ({ req }) => Boolean(req?.user && isAdminRole(req)),
      },
    },
  ],
}

export default ContentAccess
