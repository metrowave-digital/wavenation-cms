import type { CollectionConfig, Access } from 'payload'
import { isAdmin, isStaffAccess, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS (TYPE-SAFE)
============================================================ */

/**
 * Read:
 * - Logged-in users only
 * (Filtering handled via queries)
 */
const canReadRedemptions: Access = ({ req }) => Boolean(req?.user)

/**
 * Create:
 * - Creator or above
 * (Creators generate promo / comp codes)
 */
const canCreateRedemption: Access = ({ req }) =>
  Boolean(req?.user && hasRoleAtOrAbove(req, Roles.CREATOR))

/**
 * Update:
 * - Staff / Admin only
 * (Redemption is a critical mutation)
 */
const canUpdateRedemption: Access = ({ req }) =>
  Boolean(req?.user && (isAdmin({ req }) || isStaffAccess({ req })))

/**
 * Delete:
 * - Disabled (audit integrity)
 */
const canDeleteRedemption: Access = () => false

/* ============================================================
   COLLECTION
============================================================ */

export const CreatorRedemptions: CollectionConfig = {
  slug: 'creator-redemptions',

  admin: {
    useAsTitle: 'code',
    group: 'Creator Economy',
    defaultColumns: ['code', 'creator', 'status', 'expiresAt'],
  },

  access: {
    read: canReadRedemptions,
    create: canCreateRedemption,
    update: canUpdateRedemption,
    delete: canDeleteRedemption,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CORE IDENTIFIER
    -------------------------------------------------------- */
    {
      name: 'code',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        description: 'Single-use or campaign redemption code',
      },
    },

    /* --------------------------------------------------------
       RELATIONSHIPS
    -------------------------------------------------------- */
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'tier',
      type: 'relationship',
      relationTo: 'creator-tiers',
      admin: {
        readOnly: true,
      },
    },

    /* --------------------------------------------------------
       STATUS & LIFECYCLE
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unredeemed',
      options: [
        { label: 'Unredeemed', value: 'unredeemed' },
        { label: 'Redeemed', value: 'redeemed' },
        { label: 'Expired', value: 'expired' },
        { label: 'Invalid', value: 'invalid' },
      ],
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'redeemedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },

    /* --------------------------------------------------------
       METADATA / AUDIT
    -------------------------------------------------------- */
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Campaign info, source, notes, audit flags',
      },
    },
  ],
}
