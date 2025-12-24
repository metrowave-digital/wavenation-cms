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

export type Role = (typeof Roles)[keyof typeof Roles]

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
]
