// src/collections/Events/EventAnalytics.ts

import type { CollectionConfig, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Analytics fields are system / admin write-only
 */
const systemOnly: FieldAccess = ({ req }) =>
  Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN))

/* ============================================================
   COLLECTION
============================================================ */

export const EventAnalytics: CollectionConfig = {
  slug: 'event-analytics',

  admin: {
    useAsTitle: 'id',
    group: 'Events',
    defaultColumns: ['event', 'date', 'channel'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION LEVEL)
     NOTE: No `doc` here (Payload v3 rule)
  ----------------------------------------------------------- */
  access: {
    /**
     * Read-only for logged-in users (dashboards, reports)
     */
    read: ({ req }) => Boolean(req?.user),

    /**
     * Create: system + admin ingestion jobs
     */
    create: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN)),

    /**
     * Immutable analytics
     */
    update: () => false,

    /**
     * Delete: admin only (emergency cleanup)
     */
    delete: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN)),
  },

  timestamps: true,

  fields: [
    /* ---------------- IDENTIFIERS ---------------- */
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },

    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Aggregation date (typically daily).',
      },
    },

    {
      name: 'channel',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'On-site (Box Office)', value: 'onsite' },
        { label: 'Partner / Affiliate', value: 'partner' },
      ],
    },

    /* ---------------- FUNNEL + SALES ---------------- */
    {
      name: 'funnel',
      type: 'group',
      access: { update: systemOnly },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'pageViews', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'detailViews', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'checkoutStarts', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'checkoutAbandons', type: 'number', defaultValue: 0, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'orders', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'ticketsSold', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'grossRevenue', type: 'number', defaultValue: 0, admin: { width: '25%' } },
            { name: 'refunds', type: 'number', defaultValue: 0, admin: { width: '25%' } },
          ],
        },
      ],
    },

    /* ---------------- ATTENDANCE ---------------- */
    {
      name: 'attendance',
      type: 'group',
      access: { update: systemOnly },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'checkins', type: 'number', defaultValue: 0, admin: { width: '33%' } },
            { name: 'uniqueAttendees', type: 'number', defaultValue: 0, admin: { width: '33%' } },
            { name: 'noShows', type: 'number', defaultValue: 0, admin: { width: '33%' } },
          ],
        },
      ],
    },

    {
      name: 'extra',
      type: 'json',
      access: { update: systemOnly },
      admin: {
        description: 'Custom analytic dimensions (e.g., by ticket type, promo code).',
      },
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'ingestedBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: () => false },
      admin: {
        description: 'System or admin that inserted this record.',
        readOnly: true,
      },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (req.user && operation === 'create') {
          data.ingestedBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default EventAnalytics
