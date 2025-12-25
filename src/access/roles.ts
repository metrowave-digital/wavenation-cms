export const Roles = {
  SYSTEM: 'system',
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  STAFF: 'staff',
  MODERATOR: 'moderator',

  EDITOR: 'editor',
  INDUSTRY: 'industry',

  HOST: 'host',
  CREATOR: 'creator',
  PRO: 'pro',

  DJ: 'dj',
  VJ: 'vj',
  CONTRIBUTOR: 'contributor',

  FREE: 'free',
} as const

// Ads-specific roles
export const AdsRoles = {
  ADS_ADMIN: 'ads-admin',
  ADS_MANAGER: 'ads-manager',
  ADS_ANALYST: 'ads-analyst',
} as const

// Unified role type source
export const AllRoles = {
  ...Roles,
  ...AdsRoles,
} as const

export type Role = (typeof AllRoles)[keyof typeof AllRoles]

// Enterprise-safe mutable hierarchy + freeze applied AFTER typing
export const RoleHierarchy: Role[] = [
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
  Roles.DJ,
  Roles.VJ,
  Roles.CONTRIBUTOR,
  Roles.FREE,

  // Ads privilege ranks
  AdsRoles.ADS_ADMIN,
  AdsRoles.ADS_MANAGER,
  AdsRoles.ADS_ANALYST,
]

Object.freeze(RoleHierarchy)

/* ============================================================
   HIERARCHY UTILITIES
============================================================ */

export const getRoleRank = (role: Role): number => {
  return RoleHierarchy.indexOf(role)
}

export const getHighestRole = (roles: Role[]): Role | null => {
  if (!roles.length) return null
  return roles.reduce((highest, r) => (getRoleRank(r) < getRoleRank(highest) ? r : highest))
}
