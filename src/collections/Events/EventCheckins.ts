// src/collections/Events/EventCheckins.ts

import type { CollectionConfig, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Audit fields are admin-only
 */
const adminOnly: FieldAccess = ({ req }) => Boolean(req?.user && AccessControl.isAdminRole(req))

/* ============================================================
   COLLECTION
============================================================ */

export const EventCheckins: CollectionConfig = {
  slug: 'event-checkins',

  admin: {
    useAsTitle: 'id',
    group: 'Events',
    defaultColumns: ['ticket', 'event', 'method', 'checkedInAt', 'valid'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION LEVEL)
     NOTE: No `doc` here (Payload v3 rule)
  ----------------------------------------------------------- */
  access: {
    /**
     * Read: staff+, admins, system
     */
    read: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)),

    /**
     * Create: scanner apps, staff, admins
     */
    create: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)),

    /**
     * Immutable log
     */
    update: () => false,

    /**
     * Delete: admin only (emergency remediation)
     */
    delete: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN)),
  },

  timestamps: true,

  fields: [
    /* ---------------- TICKET + EVENT ---------------- */
    {
      name: 'ticket',
      type: 'relationship',
      relationTo: 'tickets',
      required: true,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },
    {
      name: 'ticketType',
      type: 'relationship',
      relationTo: 'ticket-types',
      admin: { readOnly: true },
    },

    /* ---------------- CHECK-IN DETAILS ---------------- */
    {
      name: 'checkedInAt',
      type: 'date',
      required: true,
    },

    {
      name: 'method',
      type: 'select',
      required: true,
      options: [
        { label: 'QR Scan', value: 'qr' },
        { label: 'Barcode Scan', value: 'barcode' },
        { label: 'Manual', value: 'manual' },
        { label: 'Kiosk', value: 'kiosk' },
        { label: 'RFID Wristband', value: 'rfid' },
      ],
    },

    {
      name: 'device',
      type: 'text',
      admin: {
        description: 'Scanner ID, kiosk ID, or device fingerprint.',
      },
    },

    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Staff or volunteer who performed the check-in.',
      },
    },

    {
      type: 'row',
      fields: [
        { name: 'latitude', type: 'number', admin: { width: '50%' } },
        { name: 'longitude', type: 'number', admin: { width: '50%' } },
      ],
    },

    {
      name: 'valid',
      type: 'checkbox',
      defaultValue: true,
      access: { update: adminOnly },
      admin: {
        description: 'False if duplicate scan, expired pass, wrong event, or fraud.',
      },
    },

    {
      name: 'notes',
      type: 'textarea',
      access: { update: adminOnly },
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'createdBy',
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
      ({ req, data, operation }) => {
        // Attach audit info
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }

        // Default check-in timestamp if missing
        if (!data.checkedInAt) {
          data.checkedInAt = new Date()
        }

        return data
      },
    ],
  },
}

export default EventCheckins
