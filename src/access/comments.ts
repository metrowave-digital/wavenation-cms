import type { Access } from 'payload'
import { allowRoles } from './control'

export const commentsReadAccess: Access = () => true
export const commentsCreateAccess: Access = ({ req }) => !!req.user

export const commentsUpdateAccess: Access = allowRoles([
  'admin',
  'editor',
  'creator',
  'contributor',
])

export const commentsDeleteAccess = commentsUpdateAccess
