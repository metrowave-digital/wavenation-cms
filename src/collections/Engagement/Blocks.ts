// src/collections/Engagement/Blocks.ts

import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   INTERNAL HELPERS (PAYLOAD TYPING SAFE)
============================================================ */

/**
 * Checks whether the current user is the blocker or blocked party.
 * NOTE: Payload does not type `doc` in AccessArgs — this is expected.
 */
const isBlockParticipant = (req: any, doc: any): boolean => {
  if (!req?.user || !doc) return false

  const uid = String(req.user.id)

  const blockerId = typeof doc.blocker === 'object' ? String(doc.blocker?.id) : String(doc.blocker)

  const blockedId = typeof doc.blocked === 'object' ? String(doc.blocked?.id) : String(doc.blocked)

  return uid === blockerId || uid === blockedId
}

/* ============================================================
   COLLECTION
============================================================ */

export const Blocks: CollectionConfig = {
  slug: 'blocks',

  admin: {
    useAsTitle: 'id',
    group: 'Safety',
    defaultColumns: ['blocker', 'blocked', 'reason', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL (SAFETY-GRADE)
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Admin override
     * - Staff+
     * - Block participants only
     */
    read: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      if (AccessControl.hasRoleAtOrAbove(req, Roles.STAFF)) return true
      return isBlockParticipant(req, doc)
    },

    /**
     * CREATE
     * - Any logged-in user
     */
    create: AccessControl.isLoggedIn,

    /**
     * UPDATE
     * - Never (immutable safety records)
     */
    update: () => false,

    /**
     * DELETE
     * - Admin override
     * - Blocker (self-unblock)
     */
    delete: ({ req, doc }: any) => {
      if (AccessControl.isAdminRole(req)) return true
      if (!req?.user || !doc) return false

      const uid = String(req.user.id)
      const blockerId =
        typeof doc.blocker === 'object' ? String(doc.blocker?.id) : String(doc.blocker)

      return uid === blockerId
    },
  },

  timestamps: true,

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'blocker',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'blocked',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Harassment', value: 'harassment' },
        { label: 'Spam', value: 'spam' },
        { label: 'Scam / Phishing', value: 'scam' },
        { label: 'Abusive Language', value: 'abuse' },
        { label: 'Impersonation', value: 'impersonation' },
        { label: 'Inappropriate Content', value: 'inappropriate' },
        { label: 'Violation of Terms', value: 'terms' },
        { label: 'Personal Safety', value: 'safety' },
        { label: 'Other', value: 'other' },
      ],
    },

    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Moderator-only notes.',
      },
      access: {
        read: AccessControl.isStaffAccessField,
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional. Automatically expires the block.',
      },
    },

    {
      name: 'aiEvidence',
      type: 'json',
      admin: {
        description: 'AI moderation evidence (staff only).',
      },
      access: {
        read: AccessControl.isStaffAccessField,
        update: AccessControl.isStaffAccessField,
      },
    },

    {
      name: 'createdBy',
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
      ({ req, operation, data }) => {
        if (operation === 'create' && req?.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}

export default Blocks
