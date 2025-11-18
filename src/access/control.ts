// apps/cms/src/access/control.ts

import type { Access } from 'payload'
import type { User } from '../payload-types'

export const isAdmin: Access = ({ req }) => {
  return req.user?.role === 'admin'
}

export const allowAdminsAnd = (roles: string[]): Access => {
  return ({ req }) => {
    const user = req.user as User
    if (!user) return false
    if (user.role === 'admin') return true
    return roles.includes(user.role)
  }
}

export const allowIfSelfOrAdmin: Access = ({ req, id }) => {
  const user = req.user as User
  if (!user) return false
  if (user.role === 'admin') return true

  return user.id === id
}
