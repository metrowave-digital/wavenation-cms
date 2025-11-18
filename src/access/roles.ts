// apps/cms/src/access/roles.ts

export type UserRole = 'admin' | 'editor' | 'creator' | 'contributor' | 'reviewer' | 'host-dj'

export const ROLE_LIST: UserRole[] = [
  'admin',
  'editor',
  'creator',
  'contributor',
  'reviewer',
  'host-dj',
]
