import type { CollectionConfig } from 'payload'

export const ActivityLogs: CollectionConfig = {
  slug: 'activity-logs',

  labels: {
    singular: 'Activity Log',
    plural: 'Activity Logs',
  },

  admin: {
    useAsTitle: 'action',
    group: 'System',
    defaultColumns: ['action', 'user', 'createdAt'],
  },

  access: {
    read: ({ req }) => !!req.user && req.user.role === 'admin',
    create: () => true,
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'action',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'details',
      type: 'json',
    },
  ],
}
