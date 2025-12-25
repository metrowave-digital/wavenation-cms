import type { CollectionConfig, Access } from 'payload'
import { isAdmin, isStaffAccess, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Read:
 * - Public: allowed (benefits are display-only)
 */
const canReadBenefits: Access = () => true

/**
 * Create:
 * - Creator or above
 */
const canCreateBenefit: Access = ({ req }) =>
  Boolean(req?.user && hasRoleAtOrAbove(req, Roles.CREATOR))

/**
 * Update:
 * - Creator+
 * - Staff/Admin
 */
const canUpdateBenefit: Access = ({ req }) => {
  if (!req?.user) return false
  if (isAdmin({ req }) || isStaffAccess({ req })) return true
  return hasRoleAtOrAbove(req, Roles.CREATOR)
}

/**
 * Delete:
 * - Admin only
 * (benefits may be shared across tiers)
 */
const canDeleteBenefit: Access = ({ req }) => Boolean(isAdmin({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const CreatorTierBenefits: CollectionConfig = {
  slug: 'creator-tier-benefits',

  admin: {
    useAsTitle: 'title',
    group: 'Creator Economy',
    defaultColumns: ['title'],
  },

  access: {
    read: canReadBenefits,
    create: canCreateBenefit,
    update: canUpdateBenefit,
    delete: canDeleteBenefit,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CORE
    -------------------------------------------------------- */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    /* --------------------------------------------------------
       UI / BADGING
    -------------------------------------------------------- */
    {
      name: 'badgeIcon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional — badge shown in chats, comments, or profiles.',
      },
    },

    /* --------------------------------------------------------
       INTERNAL FLAGS (OPTIONAL)
    -------------------------------------------------------- */
    {
      name: 'internal',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Internal-only benefit (not shown publicly)',
      },
    },
  ],
}
