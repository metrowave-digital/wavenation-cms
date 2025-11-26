import type { Access } from 'payload'
import { isContributor, allowIfSelfOrAdmin, allowRoles } from './control'

export const postsReadAccess: Access = () => true

export const postsCreateAccess: Access = ({ req }) => {
  return isContributor({ req })
}

export const postsUpdateAccess: Access = ({ req, id }) => {
  return allowIfSelfOrAdmin({ req, id })
}

export const postsDeleteAccess: Access = ({ req, id }) => {
  return allowIfSelfOrAdmin({ req, id })
}
