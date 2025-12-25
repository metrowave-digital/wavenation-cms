// src/access/control.ts

import type { Access, AccessArgs, FieldAccess } from 'payload'
import { Roles, AdsRoles, getRoleRank, getHighestRole } from './roles'
import type { Role } from './roles'

/* ============================================================
   ROLE NORMALIZATION
============================================================ */

export const normalizeRoles = (roles: unknown): Role[] => {
  if (!roles) return []
  if (Array.isArray(roles)) return roles.filter((r): r is Role => typeof r === 'string')
  if (typeof roles === 'string') return [roles as Role]
  return []
}

/* ============================================================
   PUBLIC API SECURITY — READ ONLY
   ⚠️ NEVER USE FOR WRITE OPERATIONS
============================================================ */

const VALID_API_KEYS = new Set<string>(
  [process.env.CMS_PUBLIC_API_KEY, process.env.ADS_API_KEY].filter(
    (v): v is string => typeof v === 'string' && v.length > 0,
  ),
)

const VALID_FETCH_CODES = new Set<string>(
  [process.env.PUBLIC_FETCH_CODE, process.env.ADS_FETCH_CODE].filter(
    (v): v is string => typeof v === 'string' && v.length > 0,
  ),
)

/**
 * Strict public API read guard
 * - Used ONLY for frontend / anonymous reads
 * - Never blocks authenticated users
 */
export const apiLockedRead: Access = ({ req }: AccessArgs): boolean => {
  // Admin / authenticated override
  if (req?.user) return true

  const apiKey = req?.headers?.get('x-api-key')
  const fetchCode = req?.headers?.get('x-fetch-code')

  if (!apiKey || !fetchCode) return false
  if (!VALID_API_KEYS.has(apiKey)) return false
  if (!VALID_FETCH_CODES.has(fetchCode)) return false

  return true
}

/* ============================================================
   ADMIN OVERRIDE ROLES
============================================================ */

const ADMIN_OVERRIDE_ROLES: Role[] = [
  Roles.SYSTEM,
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  AdsRoles.ADS_ADMIN,
]

Object.freeze(ADMIN_OVERRIDE_ROLES)

export const ADMIN_OVERRIDE_SET = new Set<Role>(ADMIN_OVERRIDE_ROLES)

/**
 * Admin role detector
 * (collection + field safe)
 */
export const isAdminRole = (req: AccessArgs['req']): boolean => {
  if (!req?.user) return false
  const roles = normalizeRoles(req.user.roles)
  return roles.some((r) => ADMIN_OVERRIDE_SET.has(r))
}

/* ============================================================
   CORE RBAC HELPERS
============================================================ */

export const hasRole = (req: AccessArgs['req'], allowed: Role[]): boolean => {
  if (!req?.user) return false

  const highest = getHighestRole(normalizeRoles(req.user.roles))
  if (highest && ADMIN_OVERRIDE_SET.has(highest)) return true

  const allowedSet = new Set<Role>(allowed)
  const roles = normalizeRoles(req.user.roles)
  return roles.some((r) => allowedSet.has(r))
}

export const hasRoleAtOrAbove = (req: AccessArgs['req'], required: Role): boolean => {
  if (!req?.user) return false

  const highest = getHighestRole(normalizeRoles(req.user.roles))
  if (highest && ADMIN_OVERRIDE_SET.has(highest)) return true

  const roles = normalizeRoles(req.user.roles)
  const validRanks = roles.map(getRoleRank).filter((i) => i >= 0)
  if (!validRanks.length) return false

  const highestRank = Math.min(...validRanks)
  const requiredRank = getRoleRank(required)

  return highestRank <= requiredRank
}

/* ============================================================
   ADS PERMISSIONS (COLLECTION LEVEL)
============================================================ */

export const isAdsAdmin: Access = ({ req }) =>
  hasRole(req, [AdsRoles.ADS_ADMIN, Roles.ADMIN, Roles.SYSTEM, Roles.SUPER_ADMIN])

export const isAdsManager: Access = ({ req }) =>
  hasRole(req, [
    AdsRoles.ADS_MANAGER,
    AdsRoles.ADS_ADMIN,
    Roles.STAFF,
    Roles.MODERATOR,
    Roles.EDITOR,
    Roles.ADMIN,
    Roles.SYSTEM,
    Roles.SUPER_ADMIN,
  ])

export const isAdsAnalyst: Access = ({ req }) =>
  hasRole(req, [
    AdsRoles.ADS_ANALYST,
    AdsRoles.ADS_MANAGER,
    AdsRoles.ADS_ADMIN,
    Roles.STAFF,
    Roles.MODERATOR,
    Roles.EDITOR,
    Roles.ADMIN,
    Roles.SYSTEM,
    Roles.SUPER_ADMIN,
  ])

/* ============================================================
   FIELD-LEVEL ACCESS (BOOLEAN ONLY)
============================================================ */

export const adsSearchSafe: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req)
}

export const metricsFieldUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false

  const allowed: Role[] = [
    AdsRoles.ADS_ANALYST,
    AdsRoles.ADS_MANAGER,
    AdsRoles.ADS_ADMIN,
    Roles.ADMIN,
    Roles.SYSTEM,
    Roles.SUPER_ADMIN,
  ]

  return hasRole(req, allowed)
}

/* ============================================================
   GENERAL COLLECTION ACCESS
============================================================ */

export const isPublic: Access = ({ req }) => {
  if (req?.user) return true
  return apiLockedRead({ req } as AccessArgs)
}

export const isLoggedIn: Access = ({ req }) => Boolean(req?.user)

export const isAdmin: Access = ({ req }) => Boolean(isAdminRole(req))

export const isStaff: Access = ({ req }) =>
  hasRole(req, [Roles.STAFF, Roles.ADMIN, Roles.SYSTEM, Roles.SUPER_ADMIN])

export const isCreator: Access = ({ req }) =>
  hasRole(req, [Roles.MODERATOR, Roles.EDITOR, Roles.HOST, Roles.PRO, Roles.CREATOR])

/* ============================================================
   EDITORIAL ACCESS (PAYLOAD SAFE)
============================================================ */

export const isEditorOrAbove: Access = ({ req }) => hasRoleAtOrAbove(req, Roles.EDITOR)

export const isModeratorOrAbove: Access = ({ req }) => hasRoleAtOrAbove(req, Roles.MODERATOR)

export const isStaffAccess: Access = ({ req }) => hasRoleAtOrAbove(req, Roles.STAFF)

/* ============================================================
   FIELD ACCESS WRAPPERS (ENTERPRISE SAFE)
   FieldAccess must return boolean and has different args type
============================================================ */

export const isStaffAccessField: FieldAccess = ({ req }: any): boolean =>
  Boolean(hasRoleAtOrAbove(req, Roles.STAFF))

export const isAdminField: FieldAccess = ({ req }: any): boolean => Boolean(isAdminRole(req))

/* ============================================================
   ADMIN READ ACCESS (ADMIN UI SAFE)
============================================================ */

export const canReadAdmin: Access = ({ req }) => Boolean(req?.user)

/* ============================================================
   PUBLIC API READ (STRICT)
============================================================ */

export const canReadPublicAPI: Access = ({ req }) => apiLockedRead({ req } as AccessArgs)

/* ============================================================
   CHANNEL-SCOPED HELPERS (ENTERPRISE)
   Fixes: string|undefined vs number comparisons
============================================================ */

type IdLike = string | number
type RelLike = IdLike | { id: IdLike } | null | undefined

interface ChannelLike {
  creator?: RelLike
  moderators?: RelLike[]
}

/**
 * Normalize relationship value -> string id
 */
const relToIdString = (value: RelLike): string | undefined => {
  if (value == null) return undefined
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object' && 'id' in value) return String(value.id)
  return undefined
}

/**
 * Normalize user id -> string
 */
const userIdString = (req: AccessArgs['req']): string | undefined => {
  const id = req?.user?.id
  if (id == null) return undefined
  return String(id)
}

/**
 * Channel owner (creator)
 */
export const isChannelOwner = (req: AccessArgs['req'], channel?: ChannelLike): boolean => {
  const uid = userIdString(req)
  const ownerId = relToIdString(channel?.creator)
  if (!uid || !ownerId) return false
  return uid === ownerId
}

/**
 * Channel moderator
 */
export const isChannelModerator = (req: AccessArgs['req'], channel?: ChannelLike): boolean => {
  const uid = userIdString(req)
  if (!uid || !Array.isArray(channel?.moderators)) return false

  return channel.moderators
    .map(relToIdString)
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .some((id) => id === uid)
}

/**
 * Can edit channel:
 * - Admin override roles
 * - Staff+
 * - Channel owner
 * - Channel moderator
 */
export const canEditChannel = (req: AccessArgs['req'], channel?: ChannelLike): boolean => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true
  if (isChannelOwner(req, channel)) return true
  if (isChannelModerator(req, channel)) return true
  return false
}

// control.ts (add near channel helpers)

interface ChatLike {
  participants?: RelLike[]
}

export const isChatParticipant = (req: AccessArgs['req'], chat?: ChatLike): boolean => {
  const uid = userIdString(req)
  if (!uid || !Array.isArray(chat?.participants)) return false

  return chat.participants
    .map(relToIdString)
    .filter((x): x is string => Boolean(x))
    .some((id) => id === uid)
}

/* ============================================================
   FIELD-SAFE WRAPPERS (BOOLEAN ONLY)
   Use these ONLY inside field.access.{read|update}
============================================================ */

export const isEditorOrAboveField: FieldAccess = ({ req }: any): boolean =>
  Boolean(req?.user && hasRoleAtOrAbove(req as any, Roles.EDITOR))

export const isModeratorOrAboveField: FieldAccess = ({ req }: any): boolean =>
  Boolean(req?.user && hasRoleAtOrAbove(req as any, Roles.MODERATOR))

/* ============================================================
   EVENT-SCOPED HELPERS (ENTERPRISE SAFE)
============================================================ */

interface EventLike {
  organizers?: RelLike[]
  hosts?: RelLike[]
  performers?: RelLike[]
  status?: string
}

/**
 * Is user attached to event (organizer / host / performer)
 */
export const isEventContributor = (req: AccessArgs['req'], event?: EventLike): boolean => {
  const uid = userIdString(req)
  if (!uid || !event) return false

  const rels = [...(event.organizers || []), ...(event.hosts || []), ...(event.performers || [])]

  return rels
    .map(relToIdString)
    .filter((x): x is string => Boolean(x))
    .some((id) => id === uid)
}

/**
 * Can edit event:
 * - Admin override
 * - Staff+
 * - Event contributor
 */
export const canEditEvent = (req: AccessArgs['req'], event?: EventLike): boolean => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true
  if (hasRoleAtOrAbove(req, Roles.STAFF)) return true
  if (isEventContributor(req, event)) return true
  return false
}

/**
 * Publishing guard
 * Only Editors+ or Admins
 */
export const canPublishEvent: Access = ({ req }) => hasRoleAtOrAbove(req, Roles.EDITOR)

/**
 * Field-safe version
 */
export const canPublishEventField: FieldAccess = ({ req }: any): boolean =>
  Boolean(req?.user && hasRoleAtOrAbove(req as any, Roles.EDITOR))
