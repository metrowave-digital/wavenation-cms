import type { Access, AccessArgs } from 'payload'
import { Roles, RoleHierarchy } from './roles'
import type { Role } from './roles'

/**
 * Helper: Check if user has ANY of these roles
 */
export const hasRole = (req: AccessArgs['req'], allowed: Role[]): boolean => {
  const roles: Role[] = Array.isArray(req.user?.roles) ? req.user.roles : []
  return roles.some((r) => allowed.includes(r))
}

/**
 * Helper: Check if user has a role >= required role in the hierarchy
 */
export const hasRoleAtOrAbove = (req: AccessArgs['req'], requiredRole: Role): boolean => {
  const roles: Role[] = Array.isArray(req.user?.roles) ? req.user.roles : []

  const highestUserRoleIndex = Math.min(
    ...roles.map((r) => RoleHierarchy.indexOf(r)).filter((x) => x >= 0),
  )

  const requiredIndex = RoleHierarchy.indexOf(requiredRole)

  return highestUserRoleIndex <= requiredIndex
}

/**
 * Allow only logged-in users
 */
export const isLoggedIn: Access = ({ req }) => {
  return Boolean(req.user)
}

/**
 * Allow only system, super-admin, admin
 */
export const isAdmin: Access = ({ req }) => {
  return hasRole(req, [Roles.SYSTEM, Roles.SUPER_ADMIN, Roles.ADMIN])
}

/**
 * Allow staff & admin levels
 */
export const isStaff: Access = ({ req }) => {
  return hasRole(req, [Roles.SYSTEM, Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STAFF])
}

/**
 * Allow creators, hosts, and above
 */
export const isCreator: Access = ({ req }) => {
  return hasRole(req, [
    Roles.SYSTEM,
    Roles.SUPER_ADMIN,
    Roles.ADMIN,
    Roles.STAFF,
    Roles.MODERATOR,
    Roles.HOST,
    Roles.CREATOR,
    Roles.PRO,
  ])
}

/**
 * Public (anyone can read)
 */
export const isPublic: Access = () => true

/**
 * Allow only owner OR admin
 */
export const isSelfOrAdmin: Access = ({ req, id }) => {
  if (!req.user) return false
  if (req.user.id === id) return true

  return hasRole(req, [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.SYSTEM])
}

/**
 * Block all access
 */
export const noAccess: Access = () => false
