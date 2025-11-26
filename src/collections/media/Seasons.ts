import type { CollectionConfig } from 'payload'
import { allowRoles } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Seasons: CollectionConfig = {
  slug: 'seasons',
  admin: {
    useAsTitle: 'title',
    group: 'TV & Film',
    defaultColumns: ['title', 'series', 'seasonNumber', 'status'],
  },

  access: {
    read: () => true,
    create: allowRoles(['editor', 'producer', 'admin']),
    update: allowRoles(['editor', 'producer', 'admin']),
    delete: allowRoles(['admin']),
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
      required: true,
    },

    { name: 'seasonNumber', type: 'number', required: true },

    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'episodes',
      type: 'relationship',
      relationTo: 'episodes',
      hasMany: true,
    },

    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Announced', value: 'announced' },
        { label: 'In Production', value: 'in-production' },
        { label: 'Released', value: 'released' },
      ],
    },

    SEOFields,
  ],
}
