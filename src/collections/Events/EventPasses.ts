// src/collections/Events/EventPasses.ts

import type { CollectionConfig, FieldAccess } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Owner or assignee can update limited fields
 */
const ownerOrAssignee: FieldAccess = ({ req, doc }) => {
  if (!req?.user || !doc) return false
  const uid = String(req.user.id)

  const ownerId = typeof doc.owner === 'object' ? String(doc.owner.id) : String(doc.owner)
  const assignedId =
    doc.assignedTo &&
    (typeof doc.assignedTo === 'object' ? String(doc.assignedTo.id) : String(doc.assignedTo))

  return uid === ownerId || uid === assignedId
}

/**
 * Admin-only fields
 */
const adminOnly: FieldAccess = ({ req }) => Boolean(req?.user && AccessControl.isAdminRole(req))

/* ============================================================
   COLLECTION
============================================================ */

export const EventPasses: CollectionConfig = {
  slug: 'event-passes',

  admin: {
    useAsTitle: 'passCode',
    group: 'Events',
    defaultColumns: ['passCode', 'passType', 'owner', 'status'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (COLLECTION LEVEL)
     NOTE: No `doc` allowed here
  ----------------------------------------------------------- */
  access: {
    read: ({ req }) => Boolean(req?.user),

    create: ({ req }) => Boolean(req?.user),

    update: ({ req }) => Boolean(req?.user && AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)),

    delete: ({ req }) => AccessControl.hasRoleAtOrAbove(req, Roles.ADMIN),
  },

  timestamps: true,

  fields: [
    /* ---------------- PASS IDENTIFICATION ---------------- */
    {
      name: 'passCode',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      access: { update: adminOnly },
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      access: { update: adminOnly },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Used / Scanned', value: 'used' },
        { label: 'Transferred', value: 'transferred' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },

    /* ---------------- PASS OWNER ---------------- */
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: { update: adminOnly },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'profiles',
      admin: { description: 'Optional different attendee.' },
      access: { update: adminOnly },
    },

    /* ---------------- PASS TYPE ---------------- */
    {
      name: 'passType',
      type: 'select',
      required: true,
      access: { update: adminOnly },
      options: [
        { label: 'Festival Pass', value: 'festival' },
        { label: 'Weekend Pass', value: 'weekend' },
        { label: 'VIP Pass', value: 'vip' },
        { label: 'Platinum Pass', value: 'platinum' },
        { label: 'Industry Badge', value: 'industry' },
        { label: 'Creator Badge', value: 'creator' },
        { label: 'Staff', value: 'staff' },
      ],
    },

    /* ---------------- EVENTS COVERED ---------------- */
    {
      name: 'validEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      access: { update: adminOnly },
      admin: {
        description: 'All events this pass grants access to.',
      },
    },

    {
      name: 'expirationDate',
      type: 'date',
      access: { update: adminOnly },
    },

    /* ---------------- SCAN HISTORY ---------------- */
    {
      name: 'checkins',
      type: 'relationship',
      relationTo: 'event-checkins',
      hasMany: true,
      access: { update: () => false },
      admin: { readOnly: true },
    },

    /* ---------------- METADATA ---------------- */
    {
      name: 'metadata',
      type: 'json',
      access: { update: ownerOrAssignee },
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
      ({ req, data, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default EventPasses
