import type { CollectionConfig } from 'payload'
import { seoFields } from '../../fields/seo'

// Properly typed admin guard
const isAdmin = ({ req }: { req: import('payload').PayloadRequest }) => {
  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  return roles.includes('admin') || roles.includes('super-admin')
}

export const Tracks: CollectionConfig = {
  slug: 'tracks',

  admin: {
    useAsTitle: 'title',
    group: 'Music',
    defaultColumns: ['title', 'primaryArtist', 'album', 'runtime', 'status'],
  },

  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        // -----------------------------------------------------------
        // TAB 1 – BASIC INFO
        // -----------------------------------------------------------
        {
          label: 'Track Info',
          fields: [
            { name: 'title', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if empty' },
            },

            {
              name: 'status',
              type: 'select',
              defaultValue: 'released',
              options: [
                { label: 'Released', value: 'released' },
                { label: 'Unreleased', value: 'unreleased' },
                { label: 'Preview', value: 'preview' },
                { label: 'Blocked', value: 'blocked' },
              ],
            },

            { name: 'description', type: 'textarea' },
          ],
        },

        // -----------------------------------------------------------
        // TAB 2 – ARTISTS
        // -----------------------------------------------------------
        {
          label: 'Artists',
          fields: [
            {
              name: 'primaryArtist',
              type: 'relationship',
              relationTo: 'profiles',
              required: true,
            },
            {
              name: 'featuredArtists',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'producers',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'writers',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'album',
              type: 'relationship',
              relationTo: 'albums',
            },
          ],
        },

        // -----------------------------------------------------------
        // TAB 3 – AUDIO SOURCE
        // -----------------------------------------------------------
        {
          label: 'Audio Source',
          fields: [
            {
              name: 'audioProvider',
              type: 'select',
              defaultValue: 's3',
              options: [
                { label: 'Cloudflare Stream', value: 'cloudflare' },
                { label: 'S3 / R2 (MP3)', value: 's3' },
                { label: 'External URL', value: 'external' },
              ],
            },

            // Cloudflare
            {
              name: 'cloudflareAudioId',
              type: 'text',
              admin: { condition: (data) => data?.audioProvider === 'cloudflare' },
            },
            {
              name: 'cloudflarePlaybackUrl',
              type: 'text',
              admin: { condition: (data) => data?.audioProvider === 'cloudflare' },
            },

            // S3
            {
              name: 's3AudioFile',
              type: 'upload',
              relationTo: 'media',
              admin: { condition: (data) => data?.audioProvider === 's3' },
            },

            // External URL
            {
              name: 'externalUrl',
              type: 'text',
              admin: { condition: (data) => data?.audioProvider === 'external' },
            },
          ],
        },

        // -----------------------------------------------------------
        // TAB 4 – METADATA
        // -----------------------------------------------------------
        {
          label: 'Metadata',
          fields: [
            { name: 'runtime', type: 'text', admin: { width: '33%' } },
            { name: 'bpm', type: 'number', admin: { width: '33%' } },
            { name: 'key', type: 'text', admin: { width: '33%' } },

            {
              name: 'isrc',
              type: 'text',
              admin: { description: 'International Standard Recording Code' },
            },

            { name: 'genre', type: 'relationship', relationTo: 'categories' },
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },

            {
              name: 'lyrics',
              type: 'richText',
              admin: { description: 'Optional lyrics or timed captions' },
            },
          ],
        },

        // -----------------------------------------------------------
        // TAB 5 – VISUALS
        // -----------------------------------------------------------
        {
          label: 'Visuals',
          fields: [
            { name: 'coverArt', type: 'upload', relationTo: 'media' },
            {
              name: 'videoVisual',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional visualizer loop' },
            },
          ],
        },

        // -----------------------------------------------------------
        // TAB 6 – PLAYLIST RELATION
        // -----------------------------------------------------------
        {
          label: 'Playlists',
          fields: [
            {
              name: 'playlists',
              type: 'relationship',
              relationTo: 'playlists',
              hasMany: true,
            },
          ],
        },

        // -----------------------------------------------------------
        // TAB 7 – SEO
        // -----------------------------------------------------------
        {
          label: 'SEO',
          fields: [seoFields],
        },

        // -----------------------------------------------------------
        // TAB 8 – ANALYTICS
        // -----------------------------------------------------------
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'streams',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'likes',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'shares',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
                {
                  name: 'engagementScore',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true, width: '25%' },
                },
              ],
            },
          ],
        },

        // -----------------------------------------------------------
        // TAB 9 – SYSTEM
        // -----------------------------------------------------------
        {
          label: 'System',
          fields: [
            {
              name: 'createdBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true },
            },
            {
              name: 'updatedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true },
            },
          ],
        },
      ],
    },
  ],

  // -----------------------------------------------------------
  // HOOKS — Correct Payload v3 Typing
  // -----------------------------------------------------------
  hooks: {
    beforeChange: [
      ({
        data,
        req,
        operation,
      }: {
        data: any
        req: import('payload').PayloadRequest
        operation: 'create' | 'update'
      }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = req.user.id
          data.updatedBy = req.user.id
        }

        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }

        return data
      },
    ],
  },
}
