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
    req.user.id === id // <--- FIXED
  )
}

/* ============================================================
   USERS COLLECTION
   (Fully Payload v3 Compatible)
============================================================ */

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // <--- Automatically adds: email + password + hashing + login

  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['email', 'roles'],
  },

  access: {
    read: isAdmin, // Only admins can view users
    create: isAdmin, // Only admins can create users
    update: isAdminOrSelf, // Admin or the user themselves
    delete: isAdmin, // Only admins can delete users
  },

  timestamps: true,

  fields: [
    /* -----------------------------------------------------------
     * ROLES (fully aligned with your roles.ts)
     ----------------------------------------------------------- */
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
        // baseline
        { label: 'Free User', value: 'free' },

        // creators + performers
        { label: 'Creator', value: 'creator' },
        { label: 'Pro Creator', value: 'pro' },
        { label: 'Host / DJ', value: 'host' },
        { label: 'DJ', value: 'dj' },
        { label: 'VJ', value: 'vj' },
        { label: 'Industry', value: 'industry' },
        { label: 'Contributor', value: 'contributor' },

        // editorial & staff
        { label: 'Editor', value: 'editor' },
        { label: 'Staff', value: 'staff' },
        { label: 'Moderator', value: 'moderator' },

        // core admin
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'System', value: 'system' },
      ],
    },

    /* -----------------------------------------------------------
     * NAME FIELDS
     ----------------------------------------------------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'middleInitial',
          type: 'text',
          admin: { width: '33%' },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          admin: { width: '33%' },
        },
      ],
    },

    {
      name: 'dateOfBirth',
      type: 'date',
    },

    {
      name: 'phone',
      type: 'text',
    },

    /* -----------------------------------------------------------
     * PROFILE RELATION
     ----------------------------------------------------------- */
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: false,
      admin: {
        description: 'Linked profile data for this user.',
      },
    },

    /* -----------------------------------------------------------
     * TERMS ACCEPTANCE
     ----------------------------------------------------------- */
    {
      name: 'acceptTerms',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description: 'User must accept terms of service.',
      },
    },
  ],
}
