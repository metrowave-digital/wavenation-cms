import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles } from '@/access/control'
import { SEOFields } from '@/fields/seo'

export const Channels: CollectionConfig = {
  slug: 'channels',

  labels: {
    singular: 'Channel',
    plural: 'Channels',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Video',
    defaultColumns: ['name', 'type', 'streamUrl', 'status'],
  },

  access: {
    read: () => true,
    create: allowRoles(['admin']),
    update: allowRoles(['admin']),
    delete: allowRoles(['admin']),
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    /* BASIC INFO */
    { name: 'name', type: 'text', required: true },

    { name: 'slug', type: 'text', unique: true },

    {
      name: 'type',
      type: 'select',
      defaultValue: 'fast',
      options: [
        { label: 'FAST Channel', value: 'fast' },
        { label: 'Virtual Channel', value: 'virtual' },
        { label: 'Playlist Channel', value: 'playlist' },
      ],
    },

    { name: 'description', type: 'textarea' },

    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },

    /* STREAM */
    {
      name: 'streamUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'HLS URL, DASH URL, or Cloudflare Stream manifest.',
      },
    },

    {
      name: 'backupStreamUrl',
      type: 'text',
      admin: {
        description: 'Optional backup stream in case of failure.',
      },
    },

    /* RELATE TO SCHEDULE */
    {
      name: 'schedule',
      type: 'relationship',
      relationTo: 'tv-schedule',
      hasMany: true,
      admin: {
        description: 'Programming blocks associated with this channel.',
      },
    },

    /* CUSTOM TARGETING */
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },

    {
      name: 'genre',
      type: 'relationship',
      relationTo: 'categories',
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    /* AVAILABILITY */
    {
      name: 'availability',
      type: 'group',
      fields: [
        { name: 'availableFrom', type: 'date' },
        { name: 'availableUntil', type: 'date' },
      ],
    },

    /* STATUS */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Offline', value: 'offline' },
        { label: 'Coming Soon', value: 'coming-soon' },
      ],
    },

    /* SEO */
    SEOFields,
  ],
}

export default Channels
