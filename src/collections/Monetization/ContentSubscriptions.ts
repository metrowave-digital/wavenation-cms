import type { CollectionConfig, Access } from 'payload'

import { isAdminRole, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * READ:
 * - Admin / Staff → read all
 * - User → read only their own subscriptions
 */
const canReadSubscription: Access = ({ req }) => {
  if (!req?.user) return false

  // 🔑 Global overrides
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true

  // User-scoped read
  return {
    subscriber: {
      equals: req.user.id,
    },
  }
}

/**
 * UPDATE / DELETE:
 * - Admin / Staff only
 */
const canManageSubscription: Access = ({ req }) =>
  Boolean(req?.user && (isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF)))

/**
 * CREATE:
 * - Public allowed (checkout, Stripe webhooks, etc.)
 */
const canCreateSubscription: Access = () => true

/* ============================================================
   COLLECTION
============================================================ */

export const ContentSubscriptions: CollectionConfig = {
  slug: 'content-subscriptions',

  admin: {
    useAsTitle: 'id',
    group: 'Content Monetization',
    defaultColumns: ['subscriber', 'contentType', 'contentItem', 'status'],
  },

  access: {
    read: canReadSubscription,
    create: canCreateSubscription,
    update: canManageSubscription,
    delete: canManageSubscription,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CORE RELATIONSHIP
    -------------------------------------------------------- */
    {
      name: 'subscriber',
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
       STATUS & DATES
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'expired', 'canceled'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },

    /* --------------------------------------------------------
       BILLING (LOCKED)
    -------------------------------------------------------- */
    {
      name: 'pricePaid',
      type: 'number',
      access: {
        update: ({ req }) =>
          Boolean(req?.user && (isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF))),
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      access: {
        update: ({ req }) =>
          Boolean(req?.user && (isAdminRole(req) || hasRoleAtOrAbove(req, Roles.STAFF))),
      },
    },
    {
      name: 'transactionId',
      type: 'text',
      access: {
        update: ({ req }) => Boolean(req?.user && isAdminRole(req)),
      },
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

export default ContentSubscriptions
