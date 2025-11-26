import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'

export const VODGenres: CollectionConfig = {
  slug: 'vod-genres',

  admin: {
    useAsTitle: 'name',
    group: 'VOD',
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}

export default VODGenres
