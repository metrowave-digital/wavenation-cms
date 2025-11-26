import type { Access } from 'payload'

// ---------------------------------------------
// Logged In
// ---------------------------------------------
export const isLoggedIn: Access = ({ req }) => {
  return !!req.user
}

// ---------------------------------------------
// Role Checks
// ---------------------------------------------
export const isAdmin: Access = ({ req }) => {
  return req.user?.role === 'admin'
}

export const isHostDJ: Access = ({ req }) => {
  const role = req.user?.role as string | undefined
  return role === 'host-dj' || role === 'admin'
}

export const isEditor: Access = ({ req }) => {
  const role = req.user?.role as string | undefined
  return role === 'editor' || role === 'admin'
}

export const isContributor: Access = ({ req }) => {
  const role = req.user?.role as string | undefined
  return ['contributor', 'creator', 'editor', 'reviewer', 'host-dj', 'admin'].includes(role ?? '')
}

// ---------------------------------------------
// Allow specific roles (with admin override)
// ---------------------------------------------
export const allowRoles =
  (roles: string[]): Access =>
  ({ req }) => {
    const role = req.user?.role as string | undefined
    return !!role && (roles.includes(role) || role === 'admin')
  }

// ---------------------------------------------
// Allow if self or admin
// ---------------------------------------------
export const allowIfSelfOrAdmin: Access = ({ req, id }) => {
  if (!req.user) return false
  return req.user.role === 'admin' || req.user.id === id
}

// ---------------------------------------------
// Allow if document.owner === user or admin
// ---------------------------------------------
export const allowIfOwner: Access = ({ req, data }) => {
  if (!req.user) return false
  const owner = typeof data?.owner === 'object' ? data.owner?.id : data?.owner
  return owner === req.user.id || req.user.role === 'admin'
}

// ---------------------------------------------
// Public Read
// ---------------------------------------------
export const publicRead: Access = () => true
