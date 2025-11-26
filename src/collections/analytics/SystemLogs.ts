import type { CollectionConfig } from 'payload'

export const SystemLogs: CollectionConfig = {
  slug: 'system-logs',

  admin: {
    group: 'System',
    useAsTitle: 'logType',
  },

  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: () => false,
  },

  fields: [
    { name: 'logType', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'metadata', type: 'json' },
  ],
}

export default SystemLogs
