// src/collections/Events/Venues.ts

import type { CollectionConfig, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only fields (capacity, geo, timezone, deletion-critical data)
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

export const Venues: CollectionConfig = {
  slug: 'venues',

  admin: {
    useAsTitle: 'name',
    group: 'Events',
    defaultColumns: ['name', 'city', 'capacity', 'venueType'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION LEVEL)
     NOTE: No `doc` here (Payload v3 rule)
  ----------------------------------------------------------- */
  access: {
    /**
     * Public read (event listings, maps)
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
      access: { update: staffOnly },
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      access: { update: adminOnly },
      admin: { description: 'Auto-generated if empty.' },
    },

    {
      name: 'venueType',
      type: 'select',
      defaultValue: 'venue',
      access: { update: staffOnly },
      options: [
        { label: 'Venue', value: 'venue' },
        { label: 'Theater / Cinema', value: 'theater' },
        { label: 'Club', value: 'club' },
        { label: 'Church', value: 'church' },
        { label: 'Outdoor', value: 'outdoor' },
        { label: 'Virtual', value: 'virtual' },
        { label: 'Other', value: 'other' },
      ],
    },

    /* ---------------- CAPACITY + TIME ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'capacity',
          type: 'number',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
        {
          name: 'timezone',
          type: 'text',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
      ],
    },

    /* ---------------- ADDRESS ---------------- */
    {
      name: 'addressLine1',
      type: 'text',
      access: { update: staffOnly },
    },
    {
      name: 'addressLine2',
      type: 'text',
      access: { update: staffOnly },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          type: 'text',
          access: { update: staffOnly },
          admin: { width: '40%' },
        },
        {
          name: 'state',
          type: 'text',
          access: { update: staffOnly },
          admin: { width: '30%' },
        },
        {
          name: 'postalCode',
          type: 'text',
          access: { update: staffOnly },
          admin: { width: '30%' },
        },
      ],
    },
    {
      name: 'country',
      type: 'text',
      access: { update: staffOnly },
    },

    /* ---------------- GEO ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'latitude',
          type: 'number',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
        {
          name: 'longitude',
          type: 'number',
          access: { update: adminOnly },
          admin: { width: '50%' },
        },
      ],
    },

    /* ---------------- CONTACT ---------------- */
    {
      name: 'contactEmail',
      type: 'text',
      access: { update: staffOnly },
    },
    {
      name: 'contactPhone',
      type: 'text',
      access: { update: staffOnly },
    },
    {
      name: 'website',
      type: 'text',
      access: { update: staffOnly },
    },

    {
      name: 'notes',
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

        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        return data
      },
    ],
  },
}

export default Venues
