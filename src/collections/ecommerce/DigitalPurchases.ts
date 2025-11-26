// src/collections/ecommerce/DigitalPurchases.ts
import type { CollectionConfig } from 'payload'

export const DigitalPurchases: CollectionConfig = {
  slug: 'digital-purchases',

  admin: {
    group: 'E-Commerce',
  },

  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'file',
      type: 'relationship',
      relationTo: 'media',
    },
    { name: 'downloadCount', type: 'number', defaultValue: 0 },
    { name: 'expiresAt', type: 'date' },
  ],
}
