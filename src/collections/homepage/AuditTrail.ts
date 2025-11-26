import type { CollectionConfig } from 'payload'

export const AuditTrail: CollectionConfig = {
  slug: 'audit-trail',

  admin: {
    group: 'System',
    useAsTitle: 'action',
  },

  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: () => false,
  },

  fields: [
    { name: 'action', type: 'text', required: true },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    { name: 'collection', type: 'text' },
    { name: 'docId', type: 'text' },
    { name: 'before', type: 'json' },
    { name: 'after', type: 'json' },
  ],
}

export default AuditTrail
