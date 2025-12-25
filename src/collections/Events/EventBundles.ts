// src/collections/Events/EventBundles.ts

import type { CollectionConfig, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only fields (pricing, inventory, status)
 */
const adminOnly: FieldAccess = ({ req }) => Boolean(req?.user && AccessControl.isAdminRole(req))

/**
 * Staff+ can manage non-financial fields
 */
const staffOnly: FieldAccess = ({ req }) =>
  Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF))

/* ============================================================
   COLLECTION
============================================================ */

export const EventBundles: CollectionConfig = {
  slug: 'event-bundles',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'status', 'price', 'currency', 'sold'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION LEVEL)
     NOTE: No `doc` here (Payload v3 rule)
  ----------------------------------------------------------- */
  access: {
    /**
     * Public can read bundles (frontend store)
     */
    read: () => true,

    /**
     * Create / Update: staff+
     */
    create: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)),

    update: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)),

    /**
     * Delete: admin only
     */
    delete: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN)),
  },

  timestamps: true,

  fields: [
    /* ---------------- CORE ---------------- */
    {
      name: 'name',
      type: 'text',
      required: true,
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      access: { update: adminOnly },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    {
      name: 'description',
      type: 'textarea',
      access: { update: staffOnly },
    },

    /* ---------------- CONTENTS ---------------- */
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      access: { update: staffOnly },
      admin: {
        description: 'Events included in this bundle.',
      },
    },

    {
      name: 'ticketTypes',
      type: 'relationship',
      relationTo: 'ticket-types',
      hasMany: true,
      access: { update: staffOnly },
      admin: {
        description: 'Specific ticket tiers included, if applicable.',
      },
    },

    {
      name: 'passes',
      type: 'relationship',
      relationTo: 'event-passes',
      hasMany: true,
      access: { update: staffOnly },
      admin: {
        description: 'Passes associated with this bundle.',
      },
    },

    /* ---------------- PRICING ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          access: { update: adminOnly },
          admin: { width: '40%' },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          access: { update: adminOnly },
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          access: { update: adminOnly },
          admin: {
            width: '30%',
            description: "Optional 'full price' for showing discount.",
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'maxQuantity',
          type: 'number',
          access: { update: adminOnly },
          admin: { width: '33%' },
        },
        {
          name: 'maxPerOrder',
          type: 'number',
          access: { update: adminOnly },
          admin: { width: '33%' },
        },
        {
          name: 'sold',
          type: 'number',
          defaultValue: 0,
          access: { update: () => false },
          admin: { width: '33%', readOnly: true },
        },
      ],
    },

    /* ---------------- SALES WINDOW ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'salesStart',
          type: 'date',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
        {
          name: 'salesEnd',
          type: 'date',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
      ],
    },

    /* ---------------- PROMOTIONS ---------------- */
    {
      name: 'promotions',
      type: 'relationship',
      relationTo: 'event-promotions',
      hasMany: true,
      access: { update: staffOnly },
      admin: {
        description: 'Promotions that apply to this bundle.',
      },
    },

    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      access: { update: staffOnly },
    },

    /* ---------------- AUDIT ---------------- */
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

        return data
      },
    ],
  },
}

export default EventBundles
