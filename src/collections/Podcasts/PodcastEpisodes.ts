import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'

import * as AccessControl from '@/access/control'

export const PodcastEpisodes: CollectionConfig = {
  slug: 'podcast-episodes',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'episodeNumber', 'podcast', 'status'],
  },

  /* -----------------------------------------------------------
     ACCESS (ENTERPRISE SAFE — NO DATA CHANGES)
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔐 API key OR logged-in
    create: AccessControl.isAdmin,
    update: AccessControl.isAdmin,
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        // =======================================================
        // TAB 1 — EPISODE DETAILS
        // =======================================================
        {
          label: 'Details',
          fields: [
            { name: 'title', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if empty.' },
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'episodeNumber',
                  type: 'number',
                  required: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'seasonNumber',
                  type: 'number',
                  admin: { width: '33%' },
                },
                {
                  name: 'status',
                  type: 'select',
                  admin: { width: '33%' },
                  defaultValue: 'published',
                  options: [
                    { label: 'Published', value: 'published' },
                    { label: 'Scheduled', value: 'scheduled' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' },
                  ],
                },
              ],
            },

            { name: 'publishedDate', type: 'date' },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },

        // =======================================================
        // TAB 2 — AUDIO SOURCE
        // =======================================================
        {
          label: 'Audio Source',
          fields: [
            {
              name: 'audioProvider',
              type: 'select',
              required: true,
              defaultValue: 'cloudflare',
              options: [
                { label: 'Cloudflare Stream', value: 'cloudflare' },
                { label: 'S3 / R2 (MP3)', value: 's3' },
                { label: 'External URL', value: 'external' },
              ],
            },

            {
              name: 'cloudflareAudioId',
              type: 'text',
              admin: {
                condition: (data) => data?.audioProvider === 'cloudflare',
                description: 'Cloudflare audio UID',
              },
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

        // =======================================================
        // TAB 3 — RELATIONSHIPS
        // =======================================================
        {
          label: 'Relationships',
          fields: [
            {
              name: 'podcast',
              type: 'relationship',
              relationTo: 'podcasts',
              required: true,
            },
            {
              name: 'hosts',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
            {
              name: 'guests',
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
          ],
        },

        // =======================================================
        // TAB 4 — VIDEO / VOD (OPTIONAL)
        // =======================================================
        {
          label: 'Video / VOD',
          fields: [
            {
              name: 'vod',
              type: 'relationship',
              relationTo: 'vod',
              admin: {
                description:
                  'Optional video or vodcast version of this episode (studio recording, simulcast, or companion video)',
              },
            },
          ],
        },

        // =======================================================
        // TAB 5 — METADATA
        // =======================================================
        {
          label: 'Metadata',
          fields: [
            { name: 'runtimeMinutes', type: 'number' },

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

            {
              name: 'transcript',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },

        // =======================================================
        // TAB 6 — EXTRAS
        // =======================================================
        {
          label: 'Extras',
          fields: [
            {
              name: 'clips',
              type: 'array',
              labels: { singular: 'Clip', plural: 'Clips' },
              fields: [
                { name: 'title', type: 'text' },
                {
                  name: 'audio',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },

            {
              name: 'promos',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                {
                  name: 'audio',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },

        // =======================================================
        // TAB 7 — PLAYLISTS
        // =======================================================
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

        // =======================================================
        // TAB 8 — SEO
        // =======================================================
        {
          label: 'SEO',
          fields: [seoFields],
        },

        // =======================================================
        // TAB 9 — ANALYTICS
        // =======================================================
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'plays',
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

        // ----------------------------------------------------
        // TAB 10 — SYSTEM
        // ----------------------------------------------------
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
      ({ data = {}, req, operation }) => {
        const userId = req.user ? String(req.user.id) : undefined

        if (userId) {
          if (operation === 'create') data.createdBy = userId
          data.updatedBy = userId
        }

        if (data?.title && !data?.slug) {
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

export default PodcastEpisodes
