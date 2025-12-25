import type { CollectionConfig } from 'payload'
import { seoFields } from '../../fields/seo'

import { isAdmin, isStaffAccess, isPublic } from '@/access/control'

export const Tracks: CollectionConfig = {
  slug: 'tracks',

  admin: {
    useAsTitle: 'title',
    group: 'Music',
    defaultColumns: ['title', 'primaryArtist', 'album', 'runtime', 'status'],
  },

  access: {
    read: isPublic, // 🔐 API-locked public read
    create: isStaffAccess,
    update: isStaffAccess,
    delete: isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Track Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', unique: true, index: true },
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

        {
          label: 'Artists',
          fields: [
            { name: 'primaryArtist', type: 'relationship', relationTo: 'profiles', required: true },
            {
              name: 'featuredArtists',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            { name: 'producers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'writers', type: 'relationship', relationTo: 'profiles', hasMany: true },
            { name: 'album', type: 'relationship', relationTo: 'albums' },
          ],
        },

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
            {
              name: 's3AudioFile',
              type: 'upload',
              relationTo: 'media',
              admin: { condition: (data) => data?.audioProvider === 's3' },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: { condition: (data) => data?.audioProvider === 'external' },
            },
          ],
        },

        {
          label: 'Metadata',
          fields: [
            { name: 'runtime', type: 'text' },
            { name: 'bpm', type: 'number' },
            { name: 'key', type: 'text' },
            { name: 'isrc', type: 'text' },
            { name: 'genre', type: 'relationship', relationTo: 'categories' },
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
            { name: 'lyrics', type: 'richText' },
          ],
        },

        {
          label: 'Visuals',
          fields: [
            { name: 'coverArt', type: 'upload', relationTo: 'media' },
            { name: 'videoVisual', type: 'upload', relationTo: 'media' },
          ],
        },

        {
          label: 'Playlists',
          fields: [
            { name: 'playlists', type: 'relationship', relationTo: 'playlists', hasMany: true },
          ],
        },

        {
          label: 'SEO',
          fields: [seoFields],
        },

        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'streams', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                { name: 'likes', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                { name: 'shares', type: 'number', defaultValue: 0, admin: { readOnly: true } },
                {
                  name: 'engagementScore',
                  type: 'number',
                  defaultValue: 0,
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },

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

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
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
