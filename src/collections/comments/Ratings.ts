// src/collections/Ratings.ts
import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'

export const Ratings: CollectionConfig = {
  slug: 'ratings',

  labels: {
    singular: 'Rating',
    plural: 'Ratings',
  },

  admin: {
    useAsTitle: 'rating',
    group: 'Engagement',
    defaultColumns: ['rating', 'target', 'user', 'createdAt'],
  },

  access: {
    read: allowRoles(['admin', 'editor', 'analyst']),
    create: () => true, // public allowed
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  timestamps: true,

  fields: [
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        step: 1,
        description: '1 = Poor, 5 = Excellent',
      },
    },

    {
      name: 'target',
      type: 'relationship',
      required: true,
      relationTo: ['episodes', 'films', 'articles', 'series', 'posts', 'polls'],
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    {
      name: 'ipAddress',
      type: 'text',
      required: false,
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
