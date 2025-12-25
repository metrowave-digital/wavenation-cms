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
    // Public read — filtering handled at query / frontend level
    read: () => true,

    create: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { description: 'Auto-generated if empty.' },
    },

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
        { name: 'startsAt', type: 'date', admin: { width: '50%' } },
        { name: 'endsAt', type: 'date', admin: { width: '50%' } },
      ],
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
    },

    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaUrl', type: 'text' },

    /* AUDIENCE TARGETING */
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
    },

    /* CONTENT CONTEXT */
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
    },

    {
      name: 'metadata',
      type: 'json',
    },
  ],

  /* ============================================================
     HOOKS — LIFECYCLE AUTOMATION
  ============================================================ */
  hooks: {
    beforeChange: [
      ({ data }) => {
        const now = new Date()

        /* ------------------------------------------------------
           Slug auto-generation
        ------------------------------------------------------ */
        if (data.title && !data.slug) {
          data.slug =
            data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '') +
            '-' +
            Date.now().toString(36) // avoids collisions
        }

        /* ------------------------------------------------------
           Status automation
        ------------------------------------------------------ */
        if (data.startsAt && new Date(data.startsAt) <= now && data.status === 'scheduled') {
          data.status = 'active'
        }

        if (data.endsAt && new Date(data.endsAt) < now) {
          data.status = 'expired'
        }

        return data
      },
    ],
  },
}
