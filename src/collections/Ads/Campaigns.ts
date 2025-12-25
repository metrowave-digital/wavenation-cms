import type { CollectionConfig, FieldAccess, Access } from 'payload'

import { apiLockedRead, hasRole, isAdminRole } from '@/access/control'

import { Roles, AdsRoles } from '@/access/roles'
import type { Role } from '@/access/roles'

/* ============================================================
   FIELD-LEVEL ACCESS (BOOLEAN SAFE)
============================================================ */

const OVERRIDE_ROLES: Role[] = [
  // Core admin / editorial
  Roles.SYSTEM,
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.STAFF,
  Roles.MODERATOR,
  Roles.EDITOR,
  Roles.INDUSTRY,
  Roles.HOST,
  Roles.PRO,
  Roles.CREATOR,

  // Ads hierarchy
  AdsRoles.ADS_ADMIN,
  AdsRoles.ADS_MANAGER,
  AdsRoles.ADS_ANALYST,
]

Object.freeze(OVERRIDE_ROLES)

/**
 * Field-level internal read
 */
const fieldInternalRead: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRole(req, OVERRIDE_ROLES)
}

/**
 * Field-level internal update
 */
const fieldInternalUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRole(req, OVERRIDE_ROLES)
}

/**
 * Budget update — Ads Analyst+
 */
const fieldBudgetUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false

  return hasRole(req, [
    AdsRoles.ADS_ANALYST,
    AdsRoles.ADS_MANAGER,
    AdsRoles.ADS_ADMIN,
    Roles.ADMIN,
    Roles.SYSTEM,
    Roles.SUPER_ADMIN,
  ])
}

/**
 * Search index toggle — very restricted
 */
const fieldSearchToggleUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false

  return hasRole(req, [AdsRoles.ADS_ADMIN, Roles.ADMIN, Roles.SYSTEM, Roles.SUPER_ADMIN])
}

/* ============================================================
   COLLECTION READ ACCESS
============================================================ */

/**
 * READ RULES
 * - Admin UI: Ads/Admin/Editorial+ roles
 * - Public API: API key + fetch code (READ ONLY)
 */
const canReadCampaigns: Access = ({ req }) => {
  // Admin UI (cookie auth)
  if (req?.user) {
    return isAdminRole(req) || hasRole(req, OVERRIDE_ROLES)
  }

  // Public / ingestion API
  return apiLockedRead({ req } as any)
}

/* ============================================================
   CAMPAIGNS COLLECTION
============================================================ */

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',

  admin: {
    group: 'Ads',
    useAsTitle: 'name',
  },

  access: {
    /* ----------------------------------------
       READ
    ---------------------------------------- */
    read: canReadCampaigns,

    /* ----------------------------------------
       CREATE — Ads Manager or Editorial+
    ---------------------------------------- */
    create: ({ req }) =>
      hasRole(req, [
        AdsRoles.ADS_MANAGER,
        AdsRoles.ADS_ADMIN,
        Roles.EDITOR,
        Roles.STAFF,
        Roles.ADMIN,
        Roles.SYSTEM,
        Roles.SUPER_ADMIN,
      ]),

    /* ----------------------------------------
       UPDATE — Ads Analyst+
    ---------------------------------------- */
    update: ({ req }) =>
      hasRole(req, [
        AdsRoles.ADS_ANALYST,
        AdsRoles.ADS_MANAGER,
        AdsRoles.ADS_ADMIN,
        Roles.ADMIN,
        Roles.SYSTEM,
        Roles.SUPER_ADMIN,
      ]),

    /* ----------------------------------------
       DELETE — Ads Admin+
    ---------------------------------------- */
    delete: ({ req }) =>
      hasRole(req, [AdsRoles.ADS_ADMIN, Roles.ADMIN, Roles.SYSTEM, Roles.SUPER_ADMIN]),
  },

  fields: [
    /* ================= CORE ================= */

    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'ads',
      type: 'relationship',
      relationTo: 'ads',
      hasMany: true,
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'advertiser',
      type: 'relationship',
      relationTo: 'advertisers',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      type: 'row',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
      fields: [
        { name: 'startDate', type: 'date', admin: { width: '50%' } },
        { name: 'endDate', type: 'date', admin: { width: '50%' } },
      ],
    },

    {
      name: 'budget',
      type: 'number',
      access: {
        read: fieldInternalRead,
        update: fieldBudgetUpdate,
      },
    },

    {
      name: 'channels',
      type: 'select',
      hasMany: true,
      options: ['radio', 'tv', 'web', 'mobile', 'podcast', 'app', 'live-event'].map((v) => ({
        label: v,
        value: v,
      })),
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'metadata',
      type: 'json',
    },

    /* ================= SEARCH GOVERNANCE ================= */

    {
      name: '_searchable',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: () => false,
        update: fieldSearchToggleUpdate,
      },
    },
  ],
}

export default Campaigns
