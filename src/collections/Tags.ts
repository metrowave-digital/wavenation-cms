import type { CollectionConfig } from 'payload'
import { normalizeTagNames } from '../hooks/normalizeTagNames'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'name' },

  access: { read: () => true },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],

  hooks: {
    beforeChange: [normalizeTagNames],
  },
}
