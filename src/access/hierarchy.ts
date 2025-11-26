import type { Access } from 'payload'
import { Role } from './roles'

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 5,
  'host-dj': 4,
  producer: 4,
  editor: 3,
  creator: 2,
  contributor: 2,
  dj: 2,
  viewer: 1,
}

export const allowMinRole = (minRole: Role): Access => {
  return ({ req }) => {
    const role = req.user?.role as Role | undefined
    if (!role) return false
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole]
  }
}
