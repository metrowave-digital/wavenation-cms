export const ROLE_LIST = [
  'admin',
  'producer',
  'editor',
  'contributor',
  'creator',
  'dj',
  'host-dj',
  'viewer',
] as const

export type Role = (typeof ROLE_LIST)[number]
