import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Artists: CollectionConfig = {
  slug: 'artists',

  labels: {
    singular: 'Artist',
    plural: 'Artists',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Music',
    defaultColumns: ['name', 'primaryGenre'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'admin']),
    update: allowRoles(['editor', 'creator', 'admin']),
    delete: isAdmin,
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'primaryGenre',
      type: 'relationship',
      relationTo: 'categories',
    },

    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },

    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'bio',
      type: 'richText',
    },

    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text', label: 'X / Twitter' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },

    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'followers', type: 'number', defaultValue: 0 },
        { name: 'monthlyListeners', type: 'number', defaultValue: 0 },
      ],
    },

    SEOFields,
  ],
}
