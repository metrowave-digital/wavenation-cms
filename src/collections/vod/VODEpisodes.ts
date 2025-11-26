import type { CollectionConfig } from 'payload'

export const VODEpisodes: CollectionConfig = {
  slug: 'vod-episodes',

  admin: {
    useAsTitle: 'title',
    group: 'VOD',
    defaultColumns: ['title', 'season', 'episodeNumber', 'isFree'],
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
      name: 'season',
      type: 'relationship',
      relationTo: 'vod-seasons',
      required: true,
    },

    {
      name: 'episodeNumber',
      type: 'number',
      required: true,
    },

    {
      name: 'video',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'isFree',
      type: 'checkbox',
      defaultValue: false,
    },

    { name: 'description', type: 'textarea' },

    {
      name: 'runtime',
      type: 'number',
    },

    {
      name: 'status',
      type: 'select',
      options: ['published', 'draft'],
      defaultValue: 'draft',
    },
  ],
}

export default VODEpisodes
