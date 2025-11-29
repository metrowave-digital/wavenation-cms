// src/access/roles.ts

/**
 * Master Role List for WaveNation CMS
 * -----------------------------------
 * Every role you define here becomes part of the Role union type.
 */

export const Roles = {
  SYSTEM: 'system',
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  STAFF: 'staff',
  MODERATOR: 'moderator',

  HOST: 'host',
  CREATOR: 'creator',
  PRO: 'pro',
  INDUSTRY: 'industry',
  EDITOR: 'editor',

  // Additional optional roles:
  DJ: 'dj',
  VJ: 'vj',
  CONTRIBUTOR: 'contributor',

  // Baseline / default role:
  FREE: 'free',
} as const

/**
 * Type: union of all allowed roles
 */
export type Role = (typeof Roles)[keyof typeof Roles]

/**
 * Role hierarchy (highest → lowest privilege)
 * --------------------------------------------------
 * You may adjust ordering for your permission model.
 */
export const RoleHierarchy: Role[] = [
  Roles.SYSTEM,
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.STAFF,
  Roles.MODERATOR,

  // Mid-tier privileged roles
  Roles.EDITOR,
  Roles.INDUSTRY,

  // Creator ecosystem
  Roles.HOST,
  Roles.PRO,
  Roles.CREATOR,
  Roles.DJ,
  Roles.VJ,
  Roles.CONTRIBUTOR,

  // Lowest tier
  Roles.FREE,
]

/**
 * Convenience groupings — optional but extremely helpful
 */
export const AdminRoles: Role[] = [Roles.SYSTEM, Roles.SUPER_ADMIN, Roles.ADMIN]

export const StaffRoles: Role[] = [...AdminRoles, Roles.STAFF, Roles.MODERATOR, Roles.EDITOR]

export const CreatorRoles: Role[] = [
  ...StaffRoles,
  Roles.HOST,
  Roles.PRO,
  Roles.CREATOR,
  Roles.DJ,
  Roles.VJ,
  Roles.CONTRIBUTOR,
]

export const PublicRoles: Role[] = [...CreatorRoles, Roles.INDUSTRY, Roles.FREE]
