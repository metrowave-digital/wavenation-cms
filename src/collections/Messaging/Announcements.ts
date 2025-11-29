// src/collections/Announcements.ts
import type { CollectionConfig } from 'payload'

export const Announcements: CollectionConfig = {
  slug: 'announcements',

  admin: {
    useAsTitle: 'title',
    group: 'System',
    defaultColumns: ['title', 'scope', 'status', 'startsAt', 'endsAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'High / Banner', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Low', value: 'low' },
      ],
    },

    {
      name: 'scope',
      type: 'select',
      defaultValue: 'global',
      options: [
        { label: 'Global (All Brands)', value: 'global' },
        { label: 'WaveNation Only', value: 'wavenation' },
        { label: 'Freedom Worship Center', value: 'fwc' },
        { label: 'Intercultural Media Alliance', value: 'ima' },
        { label: 'Metrowave / Other', value: 'metrowave' },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          admin: { width: '50%' },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
    },

    {
      name: 'ctaLabel',
      type: 'text',
    },
    {
      name: 'ctaUrl',
      type: 'text',
    },

    /* AUDIENCE FILTERS */
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      admin: { description: 'Target certain roles (optional)' },
      options: ['free', 'creator', 'pro', 'industry', 'host', 'editor', 'admin'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    {
      name: 'requireAuth',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Only show to logged-in users' },
    },

    /* CONTENT TARGETING (optional) */
    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
    {
      name: 'relatedShows',
      type: 'relationship',
      relationTo: 'shows',
      hasMany: true,
    },

    {
      name: 'dismissible',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Users can dismiss this announcement' },
    },

    {
      name: 'metadata',
      type: 'json',
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        if (data.endsAt && new Date(data.endsAt) < new Date()) {
          data.status = 'expired'
        }

        return data
      },
    ],
  },
}
