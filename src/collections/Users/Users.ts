import type { CollectionConfig, AccessArgs } from 'payload'

/* ============================================================
   ROLE CHECK HELPERS
============================================================ */

const userRoles = (req: AccessArgs['req']): string[] =>
  Array.isArray(req.user?.roles) ? req.user.roles : []

const isAdmin = ({ req }: AccessArgs): boolean => {
  const roles = userRoles(req)
  return roles.includes('admin') || roles.includes('super-admin') || roles.includes('system')
}

const isAdminOrSelf = ({ req, id }: AccessArgs): boolean => {
  if (!req.user) return false

  const roles = userRoles(req)

  return (
    roles.includes('admin') ||
    roles.includes('super-admin') ||
    roles.includes('system') ||
    req.user.id === id
  )
}

/* ============================================================
   USERS COLLECTION (FIXED)
============================================================ */

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,

  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['email', 'roles'],
  },

  access: {
    // ✅ CRITICAL FIX: allow self-read
    read: isAdminOrSelf,

    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },

  timestamps: true,

  fields: [
    {
      name: 'roles',
      type: 'select',
      required: true,
      hasMany: true,
      defaultValue: ['free'],
      admin: {
        description: 'Defines the user access level within WaveNation CMS.',
      },
      options: [
        { label: 'Free User', value: 'free' },
        { label: 'Creator', value: 'creator' },
        { label: 'Pro Creator', value: 'pro' },
        { label: 'Host / DJ', value: 'host' },
        { label: 'DJ', value: 'dj' },
        { label: 'VJ', value: 'vj' },
        { label: 'Industry', value: 'industry' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Editor', value: 'editor' },
        { label: 'Staff', value: 'staff' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'System', value: 'system' },
      ],
    },

    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'middleInitial', type: 'text' },
        { name: 'lastName', type: 'text', required: true },
      ],
    },

    { name: 'dateOfBirth', type: 'date' },
    { name: 'phone', type: 'text' },

    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
    },

    {
      name: 'acceptTerms',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
  ],
}
