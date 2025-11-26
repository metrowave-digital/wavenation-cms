import type { CollectionConfig } from 'payload'

export const VODSeasons: CollectionConfig = {
  slug: 'vod-seasons',

  admin: {
    useAsTitle: 'title',
    group: 'VOD',
    defaultColumns: ['title', 'show', 'seasonNumber', 'status'],
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'show',
      type: 'relationship',
      relationTo: 'vod',
      required: true,
    },
    {
      name: 'seasonNumber',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: ['published', 'draft'],
      defaultValue: 'draft',
    },
  ],
}

export default VODSeasons
