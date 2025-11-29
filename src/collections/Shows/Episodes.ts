// src/collections/Shows/Episodes.ts

import type { CollectionConfig, PayloadRequest } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields } from '../../fields/seo'

const isAdmin = ({ req }: { req: PayloadRequest }) => {
  // Cast to any so we don't fight the User type for `roles`
  const roles = Array.isArray((req.user as any)?.roles) ? ((req.user as any).roles as string[]) : []
  return roles.includes('admin') || roles.includes('super-admin')
}

export const Episodes: CollectionConfig = {
  slug: 'episodes',

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'episodeNumber', 'seasonNumber', 'show'],
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
        /* ---------------------------------------------
         * TAB 1 — Episode Information
         * --------------------------------------------- */
        {
          label: 'Episode Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { description: 'Auto-generated if left empty.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'episodeNumber',
                  type: 'number',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'seasonNumber',
                  type: 'number',
                  admin: { width: '50%' },
                },
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
              name: 'airDate',
              type: 'date',
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },

        /* ---------------------------------------------
         * TAB 2 — Video Source
         * --------------------------------------------- */
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

            // Cloudflare Stream fields
            {
              name: 'cloudflareVideoId',
              type: 'text',
              admin: {
                description: 'Cloudflare Stream video UID',
                condition: (data) => data?.videoProvider === 'cloudflare',
              },
            },
            {
              name: 'cloudflarePlaybackUrl',
              type: 'text',
              admin: {
                description: 'HLS/DASH playback URL',
                condition: (data) => data?.videoProvider === 'cloudflare',
              },
            },

            // S3 / R2 hosted MP4
            {
              name: 's3VideoFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data?.videoProvider === 's3',
                description: 'Upload MP4 stream file',
              },
            },

            // External link
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.videoProvider === 'external',
                description: 'Paste YouTube, Vimeo, or custom HLS URL',
              },
            },
          ],
        },

        /* ---------------------------------------------
         * TAB 3 — Images & Branding
         * --------------------------------------------- */
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
                  admin: {
                    width: '50%',
                    description: 'Episode poster image',
                  },
                },
                {
                  name: 'bannerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                    description: 'Wide banner artwork',
                  },
                },
              ],
            },
            {
              name: 'brandColor',
              type: 'text',
              admin: { description: 'Optional HEX brand color' },
            },
          ],
        },

        /* ---------------------------------------------
         * TAB 4 — Associated Show & Cast
         * --------------------------------------------- */
        {
          label: 'Relationships',
          fields: [
            {
              name: 'show',
              type: 'relationship',
              relationTo: 'shows',
              required: true,
              admin: { description: 'Episode belongs to which TV show?' },
            },

            {
              name: 'hosts',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              admin: { description: 'On-screen hosts or talent' },
            },

            {
              name: 'guests',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
              admin: { description: 'Guest appearances' },
            },

            {
              name: 'writers',
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
              name: 'editors',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
          ],
        },

        /* ---------------------------------------------
         * TAB 5 — Ratings & Metadata
         * --------------------------------------------- */
        {
          label: 'Metadata',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'runtimeMinutes',
                  type: 'number',
                  admin: { width: '33%', description: 'Duration in minutes' },
                },
                {
                  name: 'contentRating',
                  type: 'select',
                  admin: { width: '33%' },
                  options: [
                    { label: 'G / All Ages', value: 'G' },
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
              ],
            },

            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              admin: { description: 'Add episode tags' },
            },

            {
              name: 'transcript',
              type: 'richText',
              editor: lexicalEditor(),
              admin: { description: 'Optional episode transcript' },
            },
          ],
        },

        /* ---------------------------------------------
         * TAB 6 — Clips, Extras, Promos
         * --------------------------------------------- */
        {
          label: 'Extras',
          fields: [
            {
              name: 'clips',
              type: 'array',
              labels: { singular: 'Clip', plural: 'Clips' },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                },
                {
                  name: 'clipVideo',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },

            {
              name: 'behindTheScenes',
              type: 'array',
              labels: { singular: 'Featurette', plural: 'BTS' },
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

        /* ---------------------------------------------
         * TAB 7 — SEO
         * --------------------------------------------- */
        {
          label: 'SEO',
          fields: [seoFields],
        },

        /* ---------------------------------------------
         * TAB 8 — Analytics
         * --------------------------------------------- */
        {
          label: 'Analytics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'views',
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

        /* ---------------------------------------------
         * TAB 9 — Audit
         * --------------------------------------------- */
        {
          label: 'Audit',
          fields: [
            {
              name: 'createdBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true, position: 'sidebar' },
            },
            {
              name: 'updatedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: { readOnly: true, position: 'sidebar' },
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data = {}, req, operation }) => {
        // Guarded default for strict TS; `data` is never undefined inside now

        if (req.user) {
          if (operation === 'create') data.createdBy = (req.user as any).id
          data.updatedBy = (req.user as any).id
        }

        // auto slug
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
