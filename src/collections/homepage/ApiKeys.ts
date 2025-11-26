import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

// Basic API key structure
export const APIKeys: CollectionConfig = {
  slug: 'api-keys',

  labels: {
    singular: 'API Key',
    plural: 'API Keys',
  },

  admin: {
    useAsTitle: 'label',
    group: 'System',
    description: 'Secure API keys for internal + external systems',
    defaultColumns: ['label', 'keyVisible', 'createdAt'],
  },

  access: {
    read: ({ req }) => !!req.user && req.user.role === 'admin',
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },

    {
      name: 'key',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Generated automatically. Never share this value.',
      },
    },

    {
      name: 'keyVisible',
      type: 'checkbox',
      label: 'Show Key in Admin UI?',
      defaultValue: false,
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (!data.key) {
          data.key = crypto.randomUUID().replace(/-/g, '') // 🔐 generate key
        }
        return data
      },
    ],
  },
}
