// src/collections/Events/EventPromotions.ts

import type { CollectionConfig, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Metrics can only be updated by Admin+
 */
const metricsUpdateAccess: FieldAccess = ({ req }) =>
  Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN))

/**
 * Audit fields are admin-only
 */
const auditFieldAccess: FieldAccess = ({ req }) =>
  Boolean(req?.user && AccessControl.isAdminRole(req))

export const EventPromotions: CollectionConfig = {
  slug: 'event-promotions',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'event', 'status', 'startsAt', 'endsAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION)
  ----------------------------------------------------------- */
  access: {
    read: ({ req }) => Boolean(req?.user),

    create: ({ req }) => AccessControl.hasRoleAtOrAbove(req, Roles.EDITOR),

    update: ({ req }) => AccessControl.hasRoleAtOrAbove(req, Roles.EDITOR),

    delete: ({ req }) => AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN),
  },

  timestamps: true,

  fields: [
    /* =============================
       CORE INFO
    ============================== */
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal campaign name (e.g. “Spring Festival Push – Week 1”).',
      },
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated if empty.',
      },
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      admin: {
        description: 'Event this promotion is attached to.',
      },
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },

    /* =============================
       PROMOTION WINDOW
    ============================== */
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          admin: { width: '50%' },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    /* =============================
       CHANNELS & PLACEMENTS
    ============================== */
    {
      name: 'channels',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Homepage Feature', value: 'homepage' },
        { label: 'Events Listing', value: 'events-list' },
        { label: 'Push Notification', value: 'push' },
        { label: 'Email Newsletter', value: 'email' },
        { label: 'Social Media', value: 'social' },
        { label: 'On-Air Promo', value: 'on-air' },
        { label: 'Paid Ads', value: 'paid-ads' },
      ],
    },

    {
      name: 'placements',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'Featured Rail', value: 'featured' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Inline Card', value: 'inline' },
        { label: 'Footer Promo', value: 'footer' },
      ],
    },

    /* =============================
       CREATIVE
    ============================== */
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'subheadline',
      type: 'text',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Get Tickets',
    },
    {
      name: 'creativeImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'creativeVideo',
      type: 'upload',
      relationTo: 'media',
    },

    /* =============================
       BUDGETING
    ============================== */
    {
      type: 'row',
      fields: [
        {
          name: 'budget',
          type: 'number',
          admin: { width: '33%' },
        },
        {
          name: 'spendToDate',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true, width: '33%' },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          admin: { width: '33%' },
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
          ],
        },
      ],
    },

    /* =============================
       PERFORMANCE METRICS
    ============================== */
    {
      name: 'metrics',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'impressions',
              type: 'number',
              defaultValue: 0,
              access: { update: metricsUpdateAccess },
              admin: { readOnly: true, width: '25%' },
            },
            {
              name: 'clicks',
              type: 'number',
              defaultValue: 0,
              access: { update: metricsUpdateAccess },
              admin: { readOnly: true, width: '25%' },
            },
            {
              name: 'conversions',
              type: 'number',
              defaultValue: 0,
              access: { update: metricsUpdateAccess },
              admin: { readOnly: true, width: '25%' },
            },
            {
              name: 'conversionRate',
              type: 'number',
              access: { update: metricsUpdateAccess },
              admin: {
                readOnly: true,
                width: '25%',
                description: '0–1 fraction',
              },
            },
          ],
        },
      ],
    },

    /* =============================
       NOTES & AUDIT
    ============================== */
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: auditFieldAccess },
      admin: { readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: auditFieldAccess },
      admin: { readOnly: true },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        // Auto-complete promotion after window ends
        if (data.endsAt && new Date(data.endsAt) < new Date()) {
          if (data.status === 'active') {
            data.status = 'completed'
          }
        }

        return data
      },
    ],
  },
}

export default EventPromotions
