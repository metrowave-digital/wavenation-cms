import type { CollectionConfig } from 'payload'
import { generateSlug } from '@/hooks/generateSlug'
import { allowRoles, isAdmin, publicRead } from '@/access/control'
import { SEOFields } from '@/fields/seo'
import { MusicLicensingFields } from '@/fields/musicLicensing'

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',

  labels: {
    singular: 'Podcast',
    plural: 'Podcasts',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Audio',
    defaultColumns: ['title', 'status', 'primaryHost'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['editor', 'creator', 'host-dj', 'admin']),
    update: allowRoles(['editor', 'creator', 'host-dj', 'admin']),
    delete: isAdmin,
  },

  hooks: { beforeChange: [generateSlug] },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hiatus', value: 'hiatus' },
        { label: 'Ended', value: 'ended' },
      ],
    },

    {
      name: 'description',
      type: 'richText',
    },

    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'primaryHost',
      type: 'relationship',
      relationTo: 'profiles',
    },

    {
      name: 'coHosts',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    {
      name: 'rssFeed',
      type: 'text',
      label: 'External RSS Feed URL (if applicable)',
    },

    {
      name: 'platformLinks',
      type: 'group',
      fields: [
        { name: 'spotify', type: 'text' },
        { name: 'apple', type: 'text', label: 'Apple Podcasts' },
        { name: 'google', type: 'text', label: 'Google Podcasts' },
        { name: 'youtube', type: 'text', label: 'YouTube' },
      ],
    },

    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'subscribers', type: 'number', defaultValue: 0 },
        { name: 'totalPlays', type: 'number', defaultValue: 0 },
      ],
    },

    SEOFields,
    MusicLicensingFields,
  ],
}
