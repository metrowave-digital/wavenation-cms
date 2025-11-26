// src/collections/EPGCache.ts
import type { CollectionConfig } from 'payload'

export const EPGCache: CollectionConfig = {
  slug: 'epg-cache',
  admin: {
    useAsTitle: 'id',
    group: 'On-Demand',
  },

  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'tvData',
      type: 'json',
    },
    {
      name: 'vodData',
      type: 'json',
    },
    {
      name: 'generatedAt',
      type: 'date',
    },
  ],
  timestamps: true,
}
