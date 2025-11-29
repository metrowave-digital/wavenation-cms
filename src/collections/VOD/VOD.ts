// src/collections/VOD/VOD.ts

import type { CollectionConfig, PayloadRequest } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'

const isAdmin = ({ req }: { req: PayloadRequest }) => {
  const roles = Array.isArray((req.user as any)?.roles) ? ((req.user as any).roles as string[]) : []
  return roles.includes('admin') || roles.includes('super-admin')
}

export const VOD: CollectionConfig = {
  slug: 'vod',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'vodType', 'status', 'runtimeMinutes'],
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
        /* ------------------------------------------------------------------
         * TAB 1 — GENERAL INFO
         ------------------------------------------------------------------ */
        {
          label: 'Details',
          fields: [
            { name: 'title', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if left empty.' },
            },

            {
              name: 'vodType',
              type: 'select',
              required: true,
              defaultValue: 'special',
              options: [
                { label: 'Special', value: 'special' },
                { label: 'Exclusive', value: 'exclusive' },
                { label: 'Interview', value: 'interview' },
                { label: 'Music Performance', value: 'performance' },
                { label: 'Event Replay', value: 'event-replay' },
                { label: 'Sermon / Teaching', value: 'sermon' },
                { label: 'Short-form Content', value: 'short' },
                { label: 'Documentary Short', value: 'doc-short' },
                { label: 'Feature Clip', value: 'feature-clip' },
              ],
            },

            {
              name: 'status',
              type: 'select',
              defaultValue: 'published',
              options: [
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Draft', value: 'draft' },
                { label: 'Archived', value: 'archived' },
              ],
            },

            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },

            {
              name: 'publishedDate',
              type: 'date',
            },
          ],
        },

        /* ------------------------------------------------------------------
         * TAB 2 — VIDEO SOURCE
         ------------------------------------------------------------------ */
        {
          label: 'Video Source',
          fields: [
            {
              name: 'videoProvider',
              type: 'select',
              required: true,
              defaultValue: 'cloudflare',
              options: [
                { label: 'Cloudflare Stream', value: 'cloudflare' },
                { label: 'S3 / R2 (MP4)', value: 's3' },
                { label: 'External URL', value: 'external' },
              ],
            },

            /* CLOUD FLARE */
            {
              name: 'cloudflareVideoId',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'cloudflare',
                description: 'Cloudflare Stream UID',
              },
            },

            {
              name: 'cloudflarePlaybackUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'cloudflare',
                description: 'Cloudflare playback URL (HLS/DASH)',
              },
            },

            /* S3 */
            {
              name: 's3VideoFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data?.videoProvider === 's3',
                description: 'Upload MP4 / WEBM file',
              },
            },

            /* External */
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'external',
                description: 'YouTube, Vimeo, or direct URL',
              },
            },
          ],
        },

        /* ------------------------------------------------------------------
         * TAB 3 — IMAGES, ART, BRANDING
         ------------------------------------------------------------------ */
        {
          label: 'Branding',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
                {
                  name: 'bannerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
              ],
            },

            {
              name: 'stillImages',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
            },

            {
              name: 'brandColor',
              type: 'text',
              admin: { description: 'Optional HEX theme color' },
            },
          ],
        },

        /* ------------------------------------------------------------------
         * TAB 4 — RELATIONSHIPS
         ------------------------------------------------------------------ */
        {
          label: 'Relationships',
          fields: [
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
              name: 'creators',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              admin: { description: 'Directors, producers, editors, creators' },
            },

            {
              name: 'relatedShows',
              type: 'relationship',
              relationTo: 'shows',
              hasMany: true,
              admin: { description: 'Optional grouping to TV or Radio shows' },
            },

            {
              name: 'relatedEpisodes',
              type: 'relationship',
              relationTo: 'episodes',
              hasMany: true,
              admin: {
                description: 'Optional — if this VOD belongs with specific episodes',
              },
            },
          ],
        },

        /* ------------------------------------------------------------------
         * TAB 5 — METADATA
         ------------------------------------------------------------------ */
        {
          label: 'Metadata',
          fields: [
            {
              name: 'runtimeMinutes',
              type: 'number',
              admin: { width: '33%' },
            },
            {
              name: 'contentRating',
              type: 'select',
              admin: { width: '33%' },
              options: [
                { label: 'All Ages', value: 'G' },
                { label: 'PG', value: 'PG' },
                { label: 'PG-13', value: 'PG-13' },
                { label: 'TV-MA', value: 'TV-MA' },
              ],
            },
            {
              name: 'genre',
              type: 'relationship',
              relationTo: 'categories',
              admin: { width: '33%' },
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

        /* ------------------------------------------------------------------
         * TAB 6 — EXTRAS (CLIPS, PROMOS)
         ------------------------------------------------------------------ */
        {
          label: 'Extras',
          fields: [
            {
              name: 'clips',
              type: 'array',
              labels: { singular: 'Clip', plural: 'Clips' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },

            {
              name: 'behindTheScenes',
              type: 'array',
              labels: { singular: 'BTS', plural: 'BTS' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },

            {
              name: 'promos',
              type: 'array',
              labels: { singular: 'Promo', plural: 'Promos' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'video', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },

        /* ------------------------------------------------------------------
         * TAB 7 — PLAYLISTS
         ------------------------------------------------------------------ */
        {
          label: 'Playlists',
          fields: [
            {
              name: 'collections',
              type: 'array',
              labels: { singular: 'Collection', plural: 'Collections' },
              admin: { description: 'Group VOD items into curated playlists' },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'relationship',
                  relationTo: 'vod',
                  hasMany: true,
                  admin: {
                    description: 'Add other VOD videos to this collection',
                  },
                },
              ],
            },
          ],
        },

        /* ------------------------------------------------------------------
         * TAB 8 — SEO
         ------------------------------------------------------------------ */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* ------------------------------------------------------------------
         * TAB 9 — ANALYTICS
         ------------------------------------------------------------------ */
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'views', type: 'number', defaultValue: 0, admin: { readOnly: true } },
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

        /* ------------------------------------------------------------------
         * TAB 10 — SYSTEM
         ------------------------------------------------------------------ */
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
      async ({ data = {}, req, operation }) => {
        if (req.user) {
          if (operation === 'create') data.createdBy = (req.user as any).id
          data.updatedBy = (req.user as any).id
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
