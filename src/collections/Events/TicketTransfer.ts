// src/collections/Events/TicketTransfer.ts

import type { CollectionConfig, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only fields (status, transferCode)
 */
const adminOnly: FieldAccess = ({ req }) => Boolean(req?.user && AccessControl.isAdminRole(req))

/**
 * Only sender (fromUser) can update notes/reason while pending
 */
const senderOnlyWhilePending: FieldAccess = ({ req, doc }) => {
  if (!req?.user || !doc) return false
  if (doc.status !== 'pending') return false

  const uid = String(req.user.id)
  const fromId = typeof doc.fromUser === 'object' ? String(doc.fromUser.id) : String(doc.fromUser)

  return uid === fromId
}

/* ============================================================
   COLLECTION
============================================================ */

export const TicketTransfer: CollectionConfig = {
  slug: 'ticket-transfers',

  admin: {
    useAsTitle: 'transferCode',
    group: 'Events',
    defaultColumns: ['event', 'fromUser', 'toUser', 'status'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION LEVEL)
     NOTE: No `doc` allowed here (Payload v3 rule)
  ----------------------------------------------------------- */
  access: {
    /**
     * Read: logged-in users (ownership enforced at field level)
     */
    read: ({ req }) => Boolean(req?.user),

    /**
     * Create: logged-in users (validated in hooks)
     */
    create: ({ req }) => Boolean(req?.user),

    /**
     * Update: staff+ only
     * (status transitions handled by system/admin)
     */
    update: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)),

    /**
     * Delete: admin only (emergency remediation)
     */
    delete: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN)),
  },

  timestamps: true,

  fields: [
    /* ---------------- IDENTIFIER ---------------- */
    {
      name: 'transferCode',
      type: 'text',
      unique: true,
      required: true,
      access: { update: adminOnly },
      admin: { readOnly: true },
    },

    /* ---------------- CONTEXT ---------------- */
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      access: { update: adminOnly },
    },

    {
      name: 'ticketType',
      type: 'relationship',
      relationTo: 'ticket-types',
      required: true,
      access: { update: adminOnly },
    },

    /* ---------------- PARTICIPANTS ---------------- */
    {
      name: 'fromUser',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: { update: adminOnly },
    },

    {
      name: 'toUser',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: { update: adminOnly },
    },

    /* ---------------- STATUS ---------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      access: { update: adminOnly },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },

    /* ---------------- NOTES ---------------- */
    {
      name: 'reason',
      type: 'textarea',
      access: { update: senderOnlyWhilePending },
      admin: {
        description: 'Optional note explaining the transfer.',
      },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Generate transfer code
        if (operation === 'create' && !data.transferCode) {
          data.transferCode = 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        }

        // Enforce sender identity
        if (operation === 'create' && req.user) {
          const uid = String(req.user.id)
          const fromId =
            typeof data.fromUser === 'object' ? String(data.fromUser.id) : String(data.fromUser)

          if (uid !== fromId) {
            throw new Error('Only the ticket owner can initiate a transfer.')
          }
        }

        return data
      },
    ],
  },
}

export default TicketTransfer
