// src/collections/Events/TicketTypes.ts

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
 * Staff+ can manage descriptive fields
 */
const staffOnly: FieldAccess = ({ req }) =>
  Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF))

/* ============================================================
   COLLECTION
============================================================ */

export const TicketTypes: CollectionConfig = {
  slug: 'ticket-types',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'event', 'price', 'status', 'quantityAvailable'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION LEVEL)
     NOTE: No `doc` here (Payload v3 rule)
  ----------------------------------------------------------- */
  access: {
    /**
     * Public read (storefront)
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
    /* ---------------- CONTEXT ---------------- */
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      access: { update: adminOnly },
    },

    /* ---------------- IDENTITY ---------------- */
    {
      name: 'name',
      type: 'text',
      required: true,
      access: { update: staffOnly },
    },

    {
      name: 'code',
      type: 'text',
      admin: { description: 'Internal code (e.g. GA, VIP, EBIRD).' },
      access: { update: staffOnly },
    },

    /* ---------------- STATUS ---------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      access: { update: adminOnly },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Sold Out', value: 'sold-out' },
        { label: 'Disabled', value: 'disabled' },
      ],
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
          admin: { width: '30%' },
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
          ],
        },
        {
          name: 'feePolicy',
          type: 'select',
          defaultValue: 'include',
          access: { update: adminOnly },
          options: [
            { label: 'Fees Included', value: 'include' },
            { label: 'Fees Added', value: 'add' },
          ],
          admin: { width: '30%' },
        },
      ],
    },

    /* ---------------- INVENTORY ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'quantityTotal',
          type: 'number',
          required: true,
          access: { update: adminOnly },
          admin: { width: '33%' },
        },
        {
          name: 'quantitySold',
          type: 'number',
          defaultValue: 0,
          access: { update: () => false },
          admin: { width: '33%', readOnly: true },
        },
        {
          name: 'quantityAvailable',
          type: 'number',
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

    /* ---------------- ORDER LIMITS ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'minPerOrder',
          type: 'number',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
        {
          name: 'maxPerOrder',
          type: 'number',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
      ],
    },

    /* ---------------- DESCRIPTION ---------------- */
    {
      name: 'description',
      type: 'textarea',
      access: { update: staffOnly },
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: () => false },
      admin: { readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      access: { update: () => false },
      admin: { readOnly: true },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        // Inventory math
        if (typeof data.quantityTotal === 'number' && typeof data.quantitySold === 'number') {
          data.quantityAvailable = Math.max(data.quantityTotal - data.quantitySold, 0)

          // Auto sold-out status
          if (data.quantityAvailable === 0 && data.status === 'active') {
            data.status = 'sold-out'
          }
        }

        return data
      },
    ],
  },
}

export default TicketTypes
