import type { Access } from 'payload'

export const canReadDrafts: Access = ({ req }) => {
  return ['admin', 'editor'].includes(req.user?.role ?? '')
}
