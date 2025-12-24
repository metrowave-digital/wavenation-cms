// src/access/control.ts

import type { Access, AccessArgs } from 'payload'
import { Roles, RoleHierarchy } from './roles'
import type { Role } from './roles'

/* ============================================================
   ROLE NORMALIZATION
============================================================ */

export const normalizeRoles = (roles: unknown): Role[] => {
  if (!roles) return []

  if (Array.isArray(roles)) {
    return roles
      .map((r) => {
        if (typeof r === 'string') return r as Role
        if (typeof r === 'object' && r !== null && 'role' in r) {
          return (r as { role: Role }).role
        }
        return null
      })
      .filter(Boolean) as Role[]
  }

  if (typeof roles === 'string') return [roles as Role]
  return []
}

/* ============================================================
   ADMIN ROLE SET (TS-SAFE)
============================================================ */

const ADMIN_ROLES: Role[] = [Roles.SYSTEM, Roles.SUPER_ADMIN, Roles.ADMIN]

const isAdminRole = (req: AccessArgs['req']): boolean => {
  if (!req.user) return false
  const roles = normalizeRoles(req.user.roles)
  return roles.some((r) => ADMIN_ROLES.includes(r))
}

/* ============================================================
   CORE ROLE CHECKS
============================================================ */

export const hasRole = (req: AccessArgs['req'], allowed: Role[]): boolean => {
  if (!req.user) return false

  // 🔑 ADMIN OVERRIDE — ALWAYS TRUE
  if (isAdminRole(req)) return true

  const roles = normalizeRoles(req.user.roles)
  return roles.some((r) => allowed.includes(r))
}

export const hasRoleAtOrAbove = (req: AccessArgs['req'], required: Role): boolean => {
  if (!req.user) return false

  // 🔑 ADMIN OVERRIDE — ALWAYS TRUE
  if (isAdminRole(req)) return true

  const roles = normalizeRoles(req.user.roles)
  if (!roles.length) return false

  const highestIndex = Math.min(...roles.map((r) => RoleHierarchy.indexOf(r)).filter((i) => i >= 0))

  return highestIndex <= RoleHierarchy.indexOf(required)
}

/* ============================================================
   BOOLEAN HELPERS (HOOK / FIELD SAFE)
============================================================ */

export const isAdminBoolean = (req: AccessArgs['req']): boolean => isAdminRole(req)

export const isStaffBoolean = (req: AccessArgs['req']): boolean => hasRole(req, [Roles.STAFF])

/* ============================================================
   COLLECTION ACCESS EXPORTS
============================================================ */

export const isPublic: Access = () => true

export const isAdmin: Access = ({ req }) => isAdminRole(req)

export const isStaff: Access = ({ req }) => hasRole(req, [Roles.STAFF])

export const isCreator: Access = ({ req }) =>
  hasRole(req, [Roles.MODERATOR, Roles.EDITOR, Roles.HOST, Roles.PRO, Roles.CREATOR])

/* ============================================================
   ADDITIONAL SAFE ACCESS HELPERS (ADD-ONLY)
============================================================ */

/**
 * Admin only (explicit alias, avoids redeclare)
 */
export const isAdminOnly: Access = ({ req }) => {
  if (!req?.user) return false
  return hasRole(req, [Roles.ADMIN])
}

/**
 * Staff OR Admin OR Editor
 */
export const isEditorial: Access = ({ req }) => {
  if (!req?.user) return false
  return hasRole(req, [Roles.ADMIN, Roles.STAFF, Roles.EDITOR])
}

/**
 * Logged-in OR public read
 */
export const isLoggedInOrPublic: Access = ({ req }) => {
  return Boolean(req?.user)
}

/**
 * Owner-only access
 */
export const isOwner = (userField: string): Access => {
  return ({ req }) => {
    if (!req?.user) return false

    return {
      [userField]: {
        equals: req.user.id,
      },
    }
  }
}

/**
 * Owner OR Staff/Admin
 */
export const isOwnerOrStaff = (userField: string): Access => {
  return ({ req }) => {
    if (!req?.user) return false

    if (hasRole(req, [Roles.ADMIN, Roles.STAFF])) {
      return true
    }

    return {
      [userField]: {
        equals: req.user.id,
      },
    }
  }
}

/* ============================================================
   AUTH ACCESS (MISSING EXPORT)
============================================================ */

/**
 * Logged-in users only
 */
export const isLoggedIn: Access = ({ req }) => {
  return Boolean(req?.user)
}
