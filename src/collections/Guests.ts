import type { CollectionConfig } from 'payload'
import { generateSlug } from '../hooks/generateSlug'
import { allowAdminsAnd } from '../access/control'

export const Guests: CollectionConfig = {
  slug: 'guests',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'social'],
  },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
  },

  hooks: {
    beforeChange: [generateSlug],
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    { name: 'role', type: 'text' },

    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'bio',
      type: 'richText',
      required: true,
    },

    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },

    /* RELATION TO SHOWS OR EPISODES */
    {
      name: 'featuredOn',
      type: 'relationship',
      relationTo: ['shows', 'episodes'],
      hasMany: true,
    },
  ],
}
