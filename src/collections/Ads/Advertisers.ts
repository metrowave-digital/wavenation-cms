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
 * Internal field read protection
 */
const fieldInternalRead: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRole(req, OVERRIDE_ROLES)
}

/**
 * Internal field update protection
 */
const fieldInternalUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRole(req, OVERRIDE_ROLES)
}

/**
 * Search index toggle — tightly restricted
 */
const fieldSearchToggleUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false

  return isAdminRole(req) || hasRole(req, [AdsRoles.ADS_ADMIN])
}

/* ============================================================
   COLLECTION READ ACCESS
============================================================ */

/**
 * READ RULES
 * - Admin UI: Ads/Admin/Editorial+ users
 * - Public API: API key + fetch code (READ ONLY)
 */
const canReadAdvertisers: Access = ({ req }) => {
  // Admin UI (cookie auth)
  if (req?.user) {
    return isAdminRole(req) || hasRole(req, OVERRIDE_ROLES)
  }

  // Public / frontend API
  return apiLockedRead({ req } as any)
}

/* ============================================================
   ADVERTISERS COLLECTION
============================================================ */

export const Advertisers: CollectionConfig = {
  slug: 'advertisers',

  admin: {
    useAsTitle: 'name',
    group: 'Ads',
  },

  access: {
    /* ----------------------------------------
       READ
    ---------------------------------------- */
    read: canReadAdvertisers,

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
       UPDATE — Ads Manager+
    ---------------------------------------- */
    update: ({ req }) =>
      hasRole(req, [
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
      name: 'contactEmail',
      type: 'text',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'contactPhone',
      type: 'text',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'website',
      type: 'text',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'notes',
      type: 'textarea',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
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

export default Advertisers
